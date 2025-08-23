import { GoogleGenAI, GenerateContentResponse, Chat, Type } from "@google/genai";
import { ChatMessage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let chatInstance: Chat | null = null;

const createChat = (systemInstruction: string) => {
    chatInstance = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
        },
    });
};

export const streamChat = async (history: ChatMessage[], newMessage: string, systemInstruction: string) => {
    // For simplicity here, we create a new one each time to pass the systemInstruction.
    createChat(systemInstruction);
    
    if(!chatInstance) throw new Error("Chat not initialized");

    return chatInstance.sendMessageStream({ message: newMessage });
};

export const analyzeImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<GenerateContentResponse> => {
    const imagePart = {
        inlineData: {
            mimeType: mimeType,
            data: imageBase64,
        },
    };
    const textPart = {
        text: prompt,
    };
    return await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });
};

export const generateImage = async (prompt: string, aspectRatio: string) => {
    return ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: aspectRatio,
        },
    });
};

export const generateVideo = async (prompt: string) => {
    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: prompt,
        config: {
            numberOfVideos: 1
        }
    });
    return operation;
};

export const getVideoOperation = async (operation: any) => {
    return await ai.operations.getVideosOperation({ operation: operation });
};


export const generateMusic = async (prompt: string): Promise<GenerateContentResponse> => {
    return ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Based on the following prompt, generate a song structure with a title, genre, mood, lyrics, and chord progressions. Prompt: "${prompt}"`,
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
                                type: { type: Type.STRING, description: 'e.g., Verse, Chorus, Bridge' },
                                lines: { type: Type.ARRAY, items: { type: Type.STRING } },
                                chords: { type: Type.ARRAY, items: { type: Type.STRING } }
                            },
                            required: ["type", "lines"]
                        }
                    }
                },
                required: ["title", "genre", "mood", "lyrics"]
            }
        },
    });
};