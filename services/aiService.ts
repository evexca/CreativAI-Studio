import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, MessageRole, Song } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to show this error to the user in a more friendly way.
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;padding:1rem;background-color:red;color:white;text-align:center;z-index:9999;';
  errorDiv.textContent = 'ERROR: API_KEY is not configured. Please set up your .env file.';
  document.body.prepend(errorDiv);
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Streams a chat response from the Gemini API.
 */
export const streamChat = async function* (history: ChatMessage[], newMessage: string, systemInstruction: string) {
    const model = 'gemini-2.5-flash';
    
    // Gemini wants history in {role, parts} format.
    const contents = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));
    contents.push({ role: MessageRole.USER, parts: [{ text: newMessage }] });

    try {
        const stream = await ai.models.generateContentStream({
            model,
            contents,
            config: { systemInstruction }
        });

        for await (const chunk of stream) {
            yield { text: chunk.text };
        }
    } catch (error) {
        console.error("Error streaming chat with Gemini:", error);
        throw new Error("Failed to get response from AI. Please check the console for details.");
    }
};

/**
 * Generates an image using the Gemini API.
 */
export const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: aspectRatio as "1:1" | "16:9" | "9:16" | "4:3" | "3:4",
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        }
        
        // This case might happen if the image was blocked by safety settings.
        throw new Error('Image generation succeeded but returned no images. This might be due to safety policies.');

    } catch (error) {
        console.error("Error generating image with Gemini:", error);
        throw new Error("Failed to generate image. The prompt may have been blocked. Please check the console for details.");
    }
};

/**
 * Generates a song structure as a JSON object using the Gemini API.
 */
export const generateMusic = async (prompt: string): Promise<Song> => {
    const fullPrompt = `Based on the following prompt, generate a song structure with a title, genre, mood, lyrics, and chord progressions.
        
    Prompt: "${prompt}"`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        genre: { type: Type.STRING },
                        mood: { type: Type.STRING },
                        lyrics: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    type: { type: Type.STRING, description: "The type of the lyric section (e.g., Verse 1, Chorus)" },
                                    lines: { type: Type.ARRAY, items: { type: Type.STRING }, description: "The lines of the lyrics" },
                                    chords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "The chords corresponding to each line" },
                                }
                            }
                        }
                    }
                },
            },
        });

        const jsonText = response.text.trim();
        const songData = JSON.parse(jsonText);
        return songData as Song;
    } catch (error) {
        console.error("Error generating music with Gemini:", error);
        throw new Error("Failed to generate music. The AI may have returned an unexpected format. Please check console for details.");
    }
};