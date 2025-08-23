import React from 'react';
import { Page } from '../types';
import { ChatIcon, ImageIcon } from '../components/Icons';

interface HomePageProps {
  setActivePage: (page: Page) => void;
}

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="bg-brand-surface border border-brand-border rounded-lg p-6 text-center w-full h-full flex flex-col items-center hover:border-brand-primary hover:bg-opacity-50 transition-all duration-300"
    aria-label={`Go to ${title}`}
  >
    <div className="bg-brand-primary text-white rounded-lg p-2 mb-3">
      {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5" })}
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-brand-text-secondary flex-grow text-sm">{description}</p>
    <div className="mt-4 text-brand-primary font-semibold text-sm">
      Get Started &rarr;
    </div>
  </button>
);


const HomePage: React.FC<HomePageProps> = ({ setActivePage }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                Welcome to <span className="text-brand-primary">CreativAI Studio</span>
            </h1>
            <p className="text-lg text-brand-text-secondary mb-12">
                Your all-in-one platform for exploring the creative power of AI. Choose a tool below to begin.
            </p>

            <div className="grid md:grid-cols-2 gap-8 w-full">
                <FeatureCard 
                    icon={<ChatIcon />}
                    title="AI Chat"
                    description="Engage in intelligent conversations, ask complex questions, and get instant, human-like answers."
                    onClick={() => setActivePage(Page.CHAT)}
                />
                <FeatureCard 
                    icon={<ImageIcon />}
                    title="Image Generator"
                    description="Bring your wildest ideas to life. Create stunning, unique visuals from simple text descriptions."
                    onClick={() => setActivePage(Page.IMAGE_GENERATOR)}
                />
            </div>
        </div>
    </div>
  );
};

export default HomePage;