import React, { useState, useCallback, useEffect } from 'react';
import { generateImage } from '../services/aiService';
import { ImageIcon, DownloadIcon, ShareIcon, MagicIcon, PaletteIcon } from '../components/Icons';

const ASPECT_RATIOS = [
    { value: '1:1', label: 'Square (1:1)' },
    { value: '16:9', label: 'Widescreen (16:9)' },
    { value: '9:16', label: 'Portrait (9:16)' },
    { value: '4:3', label: 'Landscape (4:3)' },
    { value: '3:4', label: 'Tall (3:4)' },
];

const ART_STYLES = ['Anime', 'Realistic', 'Cartoon', 'Logo'];

const ImageGeneratorPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Sync selectedStyle with prompt content for button UI
    const match = prompt.match(/^(Anime|Realistic|Cartoon|Logo) Style: /);
    if (match && ART_STYLES.includes(match[1])) {
      setSelectedStyle(match[1]);
    } else {
      setSelectedStyle(null);
    }
  }, [prompt]);

  const handleStyleClick = (style: string) => {
    const stylePrefix = `${style} Style: `;
    // If this style is already selected, deselect it by removing the prefix
    if (selectedStyle === style) {
        setPrompt(prompt.replace(stylePrefix, '').trimStart());
    } else {
        // A different style is selected, or no style is selected.
        // Remove any existing style prefix.
        const stylePrefixRegex = /^(?:Anime|Realistic|Cartoon|Logo) Style: /;
        const basePrompt = prompt.replace(stylePrefixRegex, '').trimStart();
        // Add the new prefix.
        setPrompt(`${stylePrefix}${basePrompt}`);
    }
  };
  
  const handleGenerate = useCallback(async () => {
    const finalPrompt = prompt.trim();
    if (!finalPrompt) {
      setError('Please enter a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setImageUrl(null);
    try {
      const base64Image = await generateImage(finalPrompt, aspectRatio);
      const url = `data:image/jpeg;base64,${base64Image}`;
      setImageUrl(url);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate image. Please try again.');
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
        title: 'Image generated with Creativ AI',
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
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg overflow-hidden border border-brand-light-gray">
      <header className="p-5 bg-brand-light border-b border-brand-light-gray">
        <h2 className="text-xl font-bold text-brand-dark flex items-center gap-3">
            <PaletteIcon />
            Image Generation
        </h2>
        <p className="text-brand-gray mt-1">Describe what you want to create</p>
      </header>

      <div className="p-5 space-y-4">
        <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A blue robot holding a red skateboard in a futuristic city"
            rows={4}
            className="w-full bg-brand-light border border-gray-300 rounded-xl p-4 text-brand-dark focus:ring-2 focus:ring-brand-primary focus:outline-none resize-none"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="aspect-ratio" className="text-sm font-medium text-brand-gray mb-2 block">Aspect Ratio</label>
                <select
                    id="aspect-ratio"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full bg-brand-light border border-gray-300 rounded-xl px-4 py-3 text-brand-dark focus:ring-2 focus:ring-brand-primary focus:outline-none appearance-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236c757d' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
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
             <div className="space-y-2">
                <label className="text-sm font-medium text-brand-gray">Select a Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ART_STYLES.map(style => (
                        <button
                            key={style}
                            onClick={() => handleStyleClick(style)}
                            className={`w-full text-center px-2 py-2.5 rounded-lg border transition-all duration-200 text-sm font-semibold ${
                                selectedStyle === style
                                    ? 'bg-brand-primary text-white border-brand-primary shadow-md'
                                    : 'bg-white text-brand-dark border-gray-300 hover:bg-brand-light-gray hover:border-brand-primary'
                            }`}
                        >
                            {style}
                        </button>
                    ))}
                </div>
            </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#9b59b6] to-[#3498db] hover:opacity-90 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 disabled:bg-brand-light-gray disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <MagicIcon />
              <span>Generate Image</span>
            </>
          )}
        </button>
        {error && (
            <div className="text-red-800 bg-red-100 border border-red-300 p-3 rounded-md mt-4">
                <p className="font-semibold">Error</p>
                <p className="whitespace-pre-wrap text-sm">{error}</p>
            </div>
        )}
      </div>
      
      <div className="flex-1 p-5 bg-brand-light-gray/60 flex items-center justify-center">
        {isLoading && (
          <div style={placeholderStyle} className="w-full max-w-md bg-white rounded-lg flex flex-col items-center justify-center border border-dashed border-gray-300 animate-pulse p-4">
            <ImageIcon className="w-12 h-12 text-gray-400" />
            <p className="mt-2 text-brand-gray">Generating your masterpiece...</p>
          </div>
        )}
        {imageUrl && !isLoading && (
          <div className="w-full">
             <img src={imageUrl} alt={prompt} className="w-full rounded-lg shadow-lg" />
             <div className="mt-4 flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleDownload}
                    className="flex-1 bg-white hover:bg-brand-light-gray text-brand-dark font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 border border-gray-300"
                >
                    <DownloadIcon />
                    <span>Download</span>
                </button>
                {typeof navigator.share === 'function' && (
                    <button
                        onClick={handleShare}
                        className="flex-1 bg-white hover:bg-brand-light-gray text-brand-dark font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 border border-gray-300"
                    >
                        <ShareIcon />
                        <span>Share</span>
                    </button>
                )}
             </div>
          </div>
        )}
         {!isLoading && !imageUrl && (
            <div style={placeholderStyle} className="w-full max-w-md bg-white rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-8 text-center">
                <ImageIcon className="w-16 h-16 text-brand-primary" />
                <p className="mt-4 text-brand-gray">Your generated image will appear here.</p>
            </div>
        )}
      </div>

    </div>
  );
};

export default ImageGeneratorPage;