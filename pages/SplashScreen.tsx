
import React from 'react';
import { LogoIcon } from '../components/Icons';

interface SplashScreenProps {
  onGetStarted: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-brand-bg text-center p-4">
      <div className="max-w-2xl">
        <div className="flex items-center justify-center gap-4 mb-6">
          <LogoIcon className="w-12 h-12" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            CreativAI Studio
          </h1>
        </div>
        <p className="text-lg text-brand-text-secondary mb-8">
          Welcome to your all-in-one platform for exploring the creative power of AI.
          Generate text, images, videos, and music with cutting-edge models, all in one place.
        </p>
        <button
          onClick={onGetStarted}
          className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;
