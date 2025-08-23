
import React, { useState, useCallback } from 'react';
import { generateMusic } from '../services/geminiService';
import { MusicIcon } from '../components/Icons';

interface Song {
    title: string;
    genre: string;
    mood: string;
    lyrics: {
        type: string;
        lines: string[];
        chords: string[];
    }[];
}

const MusicGeneratorPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [song, setSong] = useState<Song | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt for your song.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSong(null);
        try {
            const response = await generateMusic(prompt);
            const jsonStr = response.text.trim();
            const songData = JSON.parse(jsonStr);
            setSong(songData);
        } catch (err) {
            console.error(err);
            setError('Failed to generate music. The model may have returned an unexpected format. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [prompt]);
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          handleGenerate();
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-brand-surface p-6 rounded-lg border border-brand-border">
                <h3 className="text-lg font-semibold mb-4 text-white">Generate a Song Idea</h3>
                <div className="relative">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="e.g., A blues song about a robot who lost his favorite wrench"
                      className="w-full bg-brand-bg border border-brand-border rounded-md p-3 text-brand-text focus:ring-2 focus:ring-brand-primary focus:outline-none pr-32"
                    />
                    <button
                      onClick={handleGenerate}
                      disabled={isLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-brand-border disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Generating...' : 'Generate'}
                    </button>
                </div>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>

            <div className="mt-8">
                {isLoading && (
                    <div className="w-full bg-brand-surface rounded-lg p-6 flex flex-col items-center justify-center border border-brand-border animate-pulse">
                        <MusicIcon />
                        <p className="mt-2 text-brand-text-secondary">Composing your song...</p>
                    </div>
                )}
                {song && (
                    <div className="bg-brand-surface p-8 rounded-lg border border-brand-border">
                        <h2 className="text-3xl font-bold text-white mb-2">{song.title}</h2>
                        <div className="flex gap-2 mb-6">
                            <span className="px-3 py-1 bg-brand-primary text-white text-sm rounded-full">{song.genre}</span>
                            <span className="px-3 py-1 bg-brand-border text-brand-text text-sm rounded-full">{song.mood}</span>
                        </div>
                        <div className="space-y-6">
                            {song.lyrics.map((part, index) => (
                                <div key={index}>
                                    <h4 className="text-lg font-semibold text-brand-primary mb-2">{part.type}</h4>
                                    {part.lines.map((line, lineIndex) => (
                                        <div key={lineIndex} className="mb-1">
                                            {part.chords && part.chords[lineIndex] && <p className="font-mono text-brand-primary-hover">{part.chords[lineIndex]}</p>}
                                            <p className="text-brand-text">{line}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {!isLoading && !song && (
                    <div className="w-full bg-brand-surface rounded-lg p-12 flex flex-col items-center justify-center border-2 border-dashed border-brand-border">
                        <MusicIcon />
                        <p className="mt-2 text-brand-text-secondary">Your generated song will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MusicGeneratorPage;
