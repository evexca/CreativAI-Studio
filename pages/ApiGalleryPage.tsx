import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateVideo, getVideoOperation } from '../services/geminiService';
import { VideoIcon, DownloadIcon, ShareIcon } from '../components/Icons';

const LOADING_MESSAGES = [
    "Kicking off the generation process...",
    "Storyboarding your creative scene...",
    "Brewing the digital pixels...",
    "Rendering the first few frames...",
    "This can take a few minutes, hang tight!",
    "Adding some AI-powered special effects...",
    "Finalizing the video render...",
    "Almost there..."
];

const VideoGeneratorPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

    const operationRef = useRef<any>(null);
    const pollerRef = useRef<number | null>(null);
    const messageIntervalRef = useRef<number | null>(null);

    const stopPolling = () => {
        if (pollerRef.current) {
            clearInterval(pollerRef.current);
            pollerRef.current = null;
        }
        if (messageIntervalRef.current) {
            clearInterval(messageIntervalRef.current);
            messageIntervalRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            stopPolling();
        };
    }, []);
    
    const pollOperation = useCallback(async () => {
        if (!operationRef.current) return;

        try {
            const updatedOperation = await getVideoOperation(operationRef.current);
            operationRef.current = updatedOperation;

            if (updatedOperation.done) {
                stopPolling();
                const downloadLink = updatedOperation.response?.generatedVideos?.[0]?.video?.uri;
                if (downloadLink) {
                    const videoRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                    const blob = await videoRes.blob();
                    const url = URL.createObjectURL(blob);
                    setVideoUrl(url);
                } else {
                    setError('Video generation completed, but no video was returned.');
                }
                setIsLoading(false);
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while checking video status.');
            setIsLoading(false);
            stopPolling();
        }
    }, []);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setVideoUrl(null);
        operationRef.current = null;

        // Start cycling through loading messages
        let messageIndex = 0;
        setLoadingMessage(LOADING_MESSAGES[messageIndex]);
        messageIntervalRef.current = window.setInterval(() => {
            messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
            setLoadingMessage(LOADING_MESSAGES[messageIndex]);
        }, 4000);

        try {
            const initialOperation = await generateVideo(prompt);
            operationRef.current = initialOperation;
            pollerRef.current = window.setInterval(pollOperation, 10000); // Poll every 10 seconds
        } catch (err) {
            console.error(err);
            setError('Failed to start video generation. Please try again.');
            setIsLoading(false);
            stopPolling();
        }
    }, [prompt, pollOperation]);

    const handleDownload = useCallback(() => {
        if (!videoUrl) return;
        const link = document.createElement('a');
        link.href = videoUrl;
        const fileName = prompt.substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'creativai-video';
        link.download = `${fileName}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, [videoUrl, prompt]);
    
      const handleShare = useCallback(async () => {
        if (!videoUrl || !navigator.share) return;
    
        try {
          const response = await fetch(videoUrl);
          const blob = await response.blob();
          const file = new File([blob], 'creativai-video.mp4', { type: 'video/mp4' });
    
          await navigator.share({
            files: [file],
            title: 'Video generated with CreativAI Studio',
            text: `Check out this video I created: "${prompt}"`,
          });
        } catch (error) {
          console.error('Error sharing video:', error);
        }
      }, [videoUrl, prompt]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-brand-surface p-6 rounded-lg border border-brand-border">
                <h3 className="text-lg font-semibold mb-4 text-white">Generate a Video</h3>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A neon hologram of a cat driving a sports car at top speed"
                    rows={3}
                    className="w-full bg-brand-bg border border-brand-border rounded-md p-3 text-brand-text focus:ring-2 focus:ring-brand-primary focus:outline-none"
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="mt-4 w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-brand-border disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? 'Generating...' : 'Generate Video'}
                </button>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>

            <div className="mt-8">
                {isLoading && (
                    <div className="w-full aspect-video bg-brand-surface rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-brand-border animate-pulse">
                        <VideoIcon />
                        <p className="mt-4 text-brand-text-secondary">{loadingMessage}</p>
                    </div>
                )}
                {videoUrl && (
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Result</h4>
                        <video src={videoUrl} controls className="w-full rounded-lg shadow-lg" />
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
                {!isLoading && !videoUrl && (
                    <div className="w-full aspect-video bg-brand-surface rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-brand-border">
                        <VideoIcon />
                        <p className="mt-2 text-brand-text-secondary">Your generated video will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoGeneratorPage;