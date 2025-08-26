import React, { useState, useCallback } from 'react';
import { generateMusic } from '../services/aiService';
import { MusicIcon } from '../components/Icons';
import { Page, Song } from '../types';

interface MusicGeneratorPageProps {
    setActivePage: (page: Page) => void;
}


const MusicGeneratorPage: React.FC<MusicGeneratorPageProps> = ({ setActivePage }) => {
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
            const songData = await generateMusic(prompt);
            setSong(songData);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to generate music. The model may have returned an unexpected format. Please try again.');
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
        <div className="h-full">
            <div className="bg-white p-6 rounded-2xl border border-brand-light-gray shadow-lg">
                <h3 className="text-xl font-bold mb-1 text-brand-dark">Generate a Song Idea</h3>
                <p className="text-brand-gray mb-4">Describe the song you want to create.</p>
                <div className="relative">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="e.g., A blues song about a robot who lost his favorite wrench"
                      className="w-full bg-brand-light border border-gray-300 rounded-lg p-3 text-brand-dark focus:ring-2 focus:ring-brand-primary focus:outline-none pr-32"
                    />
                    <button
                      onClick={handleGenerate}
                      disabled={isLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-brand-light-gray disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Generating...' : 'Generate'}
                    </button>
                </div>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>

            <div className="mt-8">
                {isLoading && (
                    <div className="w-full bg-white rounded-lg p-6 flex flex-col items-center justify-center border border-brand-light-gray animate-pulse">
                        <MusicIcon className="w-12 h-12 text-brand-primary"/>
                        <p className="mt-2 text-brand-gray">Composing your song...</p>
                    </div>
                )}
                {song && (
                    <div className="bg-white p-8 rounded-2xl border border-brand-light-gray shadow-lg">
                        <h2 className="text-3xl font-bold text-brand-dark mb-2">{song.title}</h2>
                        <div className="flex gap-2 mb-6">
                            <span className="px-3 py-1 bg-brand-primary text-white text-sm rounded-full">{song.genre}</span>
                            <span className="px-3 py-1 bg-brand-light-gray text-brand-dark text-sm rounded-full">{song.mood}</span>
                        </div>
                        <div className="space-y-6">
                            {song.lyrics.map((part, index) => (
                                <div key={index}>
                                    <h4 className="text-lg font-semibold text-brand-primary mb-2">{part.type}</h4>
                                    {part.lines.map((line, lineIndex) => (
                                        <div key={lineIndex} className="mb-1">
                                            {part.chords && part.chords[lineIndex] && <p className="font-mono text-brand-secondary">{part.chords[lineIndex]}</p>}
                                            <p className="text-brand-dark">{line}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {!isLoading && !song && (
                    <div className="w-full bg-white rounded-2xl p-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 text-center">
                        <MusicIcon className="w-16 h-16 text-brand-primary"/>
                        <p className="mt-4 text-brand-gray">Your generated song will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MusicGeneratorPage;