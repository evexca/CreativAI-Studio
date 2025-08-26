
export const config = {
  runtime: 'edge',
};

const QWEN_IMAGE_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';
const QWEN_IMAGE_MODEL = 'wanx-v1';

// Helper to convert ArrayBuffer to Base64 in Edge environments
function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const pollTask = async (taskId: string, apiKey: string) => {
    const taskStatusUrl = `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`;
    
    for (let i = 0; i < 30; i++) { // Poll for a maximum of 60 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const statusResponse = await fetch(taskStatusUrl, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        if (!statusResponse.ok) continue;

        const statusData = await statusResponse.json();
        const taskStatus = statusData?.output?.task_status;

        if (taskStatus === 'SUCCEEDED') {
            return statusData;
        }
        if (taskStatus === 'FAILED') {
            throw new Error(`Image generation failed: ${statusData?.output?.message || 'Unknown error'}`);
        }
    }
    throw new Error('Image generation timed out.');
}


export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: 'API key not configured.' }), { status: 500 });
  }

  try {
    const { prompt, aspectRatio } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 });
    }

    const sizeMap: { [key: string]: string } = {
        '1:1': '1024*1024', '16:9': '1792*1024', '9:16': '1024*1792',
        '4:3': '1024*768', '3:4': '768*1024',
    };
    const imageSize = sizeMap[aspectRatio] || '1024*1024';

    const response = await fetch(QWEN_IMAGE_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
            'X-DashScope-Async': 'enable',
        },
        body: JSON.stringify({
            model: QWEN_IMAGE_MODEL,
            input: { prompt },
            parameters: { size: imageSize, n: 1 },
        }),
    });
    
    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Qwen API error: ${response.status} ${errorData}`);
    }

    const initialData = await response.json();
    const taskId = initialData?.output?.task_id;
    if (!taskId) {
      throw new Error('Failed to start image generation task.');
    }

    const taskResult = await pollTask(taskId, API_KEY);
    
    const imageUrl = taskResult?.output?.results?.[0]?.url;
    if (!imageUrl) {
        throw new Error('Image URL not found in task result.');
    }
    
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64ImageBytes = arrayBufferToBase64(imageBuffer);
    
    return new Response(JSON.stringify({ image: base64ImageBytes }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating image:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}