export const config = {
  runtime: 'edge',
};

const QWEN_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
const QWEN_MODEL = 'qwen-turbo';

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: 'API key not configured.' }), { status: 500 });
  }

  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 });
    }

    const fullPrompt = `Based on the following prompt, generate a song structure with a title, genre, mood, lyrics, and chord progressions. Respond with ONLY a valid JSON object. Do not include any markdown formatting like \`\`\`json. The JSON object must have these keys: "title", "genre", "mood", and "lyrics". The "lyrics" key should be an array of objects, where each object has a "type" (e.g., "Verse 1", "Chorus"), "lines" (an array of strings), and "chords" (an array of strings).
    
    Prompt: "${prompt}"`;
    
    const response = await fetch(QWEN_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: QWEN_MODEL,
            input: {
                prompt: fullPrompt,
            },
            parameters: {
                result_format: 'text',
            },
        }),
    });
    
    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Qwen API error: ${response.status} ${errorData}`);
    }

    const result = await response.json();
    const content = result?.output?.text;
    
    if (!content) {
        throw new Error('No content returned from Qwen API.');
    }

    let songData;
    try {
        songData = JSON.parse(content);
    } catch(e) {
        throw new Error(`Failed to parse JSON from model response: ${content}`);
    }
    
    return new Response(JSON.stringify(songData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating music:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
