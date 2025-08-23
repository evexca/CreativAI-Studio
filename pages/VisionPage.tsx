
import React, { useState, useCallback, ChangeEvent } from 'react';
import { analyzeImage } from '../services/geminiService';
import { VisionIcon } from '../components/Icons';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

const VisionPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<{ file: File; previewUrl: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage({
        file,
        previewUrl: URL.createObjectURL(file),
      });
      setResult(null);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!prompt.trim() || !image) {
      setError('Please provide both an image and a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const imageBase64 = await fileToBase64(image.file);
      const response = await analyzeImage(prompt, imageBase64, image.file.type);
      setResult(response.text);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, image]);

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-brand-text-secondary mb-2">
            Upload Image
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-brand-border border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <VisionIcon />
              <div className="flex text-sm text-brand-text-secondary">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-brand-surface rounded-md font-medium text-brand-primary hover:text-brand-primary-hover focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-brand-bg focus-within:ring-brand-primary"
                >
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-brand-text-secondary">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        {image && <img src={image.previewUrl} alt="Preview" className="w-full rounded-lg" />}

        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-brand-text-secondary mb-2">
            Your Question
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., What is in this image?"
            rows={3}
            className="w-full bg-brand-surface border border-brand-border rounded-md p-3 text-brand-text focus:ring-2 focus:ring-brand-primary focus:outline-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || !image || !prompt}
          className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-brand-border disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Image'}
        </button>
      </div>

      <div className="bg-brand-surface p-6 rounded-lg border border-brand-border">
        <h3 className="text-lg font-semibold mb-4 text-white">Analysis Result</h3>
        {isLoading && <p className="text-brand-text-secondary animate-pulse">Thinking...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {result && <p className="whitespace-pre-wrap">{result}</p>}
        {!isLoading && !result && !error && <p className="text-brand-text-secondary">The analysis of your image will appear here.</p>}
      </div>
    </div>
  );
};

export default VisionPage;
