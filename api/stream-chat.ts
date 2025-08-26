export const config = {
  runtime: 'edge',
};

const QWEN_CHAT_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
const QWEN_CHAT_MODEL = 'qwen-turbo';

// Helper to format history for Qwen API
const toQwenHistory = (history: { role: string, text: string }[]) => {
    return history.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.text
    })).filter(msg => msg.content);
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        return new Response('API key not configured.', { status: 500 });
    }

    try {
        const { history, newMessage, systemInstruction } = await req.json();

        const messages = [];
        if (systemInstruction) {
            messages.push({ role: 'system', content: systemInstruction });
        }
        messages.push(...toQwenHistory(history));
        messages.push({ role: 'user', content: newMessage });

        const apiResponse = await fetch(QWEN_CHAT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
                'X-DashScope-Stream': 'enable',
            },
            body: JSON.stringify({
                model: QWEN_CHAT_MODEL,
                input: { messages },
                parameters: { result_format: 'text', incremental_output: true }
            }),
        });
        
        if (!apiResponse.ok || !apiResponse.body) {
            const errorText = await apiResponse.text();
            throw new Error(`Qwen API error: ${apiResponse.status} ${errorText}`);
        }

        const stream = new ReadableStream({
            async start(controller) {
                const reader = apiResponse.body!.getReader();
                const decoder = new TextDecoder();
                let buffer = '';
                let lastChunk = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        if (line.startsWith('data:')) {
                            try {
                                const jsonStr = line.substring(5).trim();
                                if (!jsonStr) continue;

                                const data = JSON.parse(jsonStr);
                                const fullText = data?.output?.text || '';
                                const textChunk = fullText.substring(lastChunk.length);
                                lastChunk = fullText;
                                
                                if (textChunk) {
                                    controller.enqueue(new TextEncoder().encode(textChunk));
                                }
                            } catch (e) {
                                console.error('Error parsing SSE chunk:', line, e);
                            }
                        }
                    }
                }
                controller.close();
            },
        });

        return new Response(stream, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });

    } catch (error) {
        console.error('Error in stream-chat handler:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return new Response(errorMessage, { status: 500 });
    }
}
