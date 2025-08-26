
import React from 'react';
import { RobotIcon } from '../components/Icons';

interface SplashScreenProps {
  onGetStarted: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#1a2a6c] via-[#b21f1f] to-[#1a2a6c] text-center p-4">
      <div className="max-w-2xl">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-5xl md:text-6xl text-white">
            <RobotIcon />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Creativ AI
          </h1>
        </div>
        <p className="text-lg text-gray-300 mb-8">
          Welcome to your all-in-one platform for exploring the creative power of AI.
          Generate text, images, and music with cutting-edge models, all in one place.
        </p>
        <button
          onClick={onGetStarted}
          className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg shadow-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;