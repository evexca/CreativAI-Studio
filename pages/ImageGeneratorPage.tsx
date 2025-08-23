
import React, { useState, useCallback } from 'react';
import { generateImage } from '../services/geminiService';
import { ImageIcon, DownloadIcon, ShareIcon } from '../components/Icons';

const ASPECT_RATIOS = [
    { value: '1:1', label: 'Square (1:1)' },
    { value: '16:9', label: 'Widescreen (16:9)' },
    { value: '9:16', label: 'Portrait (9:16)' },
    { value: '4:3', label: 'Landscape (4:3)' },
    { value: '3:4', label: 'Tall (3:4)' },
];

const ImageGeneratorPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setImageUrl(null);
    try {
      const response = await generateImage(prompt, aspectRatio);
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      const url = `data:image/jpeg;base64,${base64ImageBytes}`;
      setImageUrl(url);
    } catch (err) {
      console.error(err);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio]);

  const handleDownload = useCallback(() => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    const fileName = prompt.substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'creativai-image';
    link.download = `${fileName}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [imageUrl, prompt]);

  const handleShare = useCallback(async () => {
    if (!imageUrl || !navigator.share) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'creativai-image.jpeg', { type: blob.type });

      await navigator.share({
        files: [file],
        title: 'Image generated with CreativAI Studio',
        text: `Check out this image I created: "${prompt}"`,
      });
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  }, [imageUrl, prompt]);
  
  const placeholderStyle = {
    aspectRatio: aspectRatio.replace(':', ' / ')
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-brand-surface p-6 rounded-lg border border-brand-border">
        <h3 className="text-lg font-semibold mb-4 text-white">Generate an Image</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A blue robot holding a red skateboard in a futuristic city"
                rows={3}
                className="w-full md:col-span-3 bg-brand-bg border border-brand-border rounded-md p-3 text-brand-text focus:ring-2 focus:ring-brand-primary focus:outline-none"
            />
            <div className="w-full md:col-span-1">
                <label htmlFor="aspect-ratio" className="sr-only">Aspect Ratio</label>
                <select
                    id="aspect-ratio"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full h-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 text-brand-text focus:ring-2 focus:ring-brand-primary focus:outline-none appearance-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238B949E' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                    }}
                >
                    {ASPECT_RATIOS.map(ratio => (
                        <option key={ratio.value} value={ratio.value}>{ratio.label}</option>
                    ))}
                </select>
            </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="mt-4 w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-brand-border disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      <div className="mt-8">
        {isLoading && (
          <div style={placeholderStyle} className="w-full bg-brand-surface rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-brand-border animate-pulse">
            <ImageIcon className="w-12 h-12 text-brand-text-secondary" />
            <p className="mt-2 text-brand-text-secondary">Generating your masterpiece...</p>
          </div>
        )}
        {imageUrl && (
          <div>
             <h4 className="text-lg font-semibold mb-4 text-white">Result</h4>
             <img src={imageUrl} alt={prompt} className="w-full rounded-lg shadow-lg" />
             <div className="mt-4 flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleDownload}
                    className="flex-1 bg-brand-surface hover:bg-brand-border text-brand-text font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                >
                    <DownloadIcon />
                    <span>Download</span>
                </button>
                {typeof navigator.share === 'function' && (
                    <button
                        onClick={handleShare}
                        className="flex-1 bg-brand-surface hover:bg-brand-border text-brand-text font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                        <ShareIcon />
                        <span>Share</span>
                    </button>
                )}
             </div>
          </div>
        )}
         {!isLoading && !imageUrl && (
            <div style={placeholderStyle} className="w-full bg-brand-surface rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-brand-border">
                <ImageIcon className="w-12 h-12 text-brand-text-secondary" />
                <p className="mt-2 text-brand-text-secondary">Your generated image will appear here.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ImageGeneratorPage;
