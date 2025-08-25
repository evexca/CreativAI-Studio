
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

const galleryItems = [
  {
    src: 'https://i.imgur.com/H9RO2zD.png',
    alt: 'Abstract portrait with a burst of vibrant colors.',
    prompt: 'An explosive and colorful abstract portrait of a face, oil on canvas, vibrant and emotional.',
  },
  {
    src: 'https://i.imgur.com/tkcSmhE.png',
    alt: 'A cool cat wearing sunglasses and a leather jacket.',
    prompt: 'Photorealistic portrait of a cool cat wearing a black leather jacket and sunglasses, studio lighting, highly detailed.',
  },
  {
    src: 'https://i.imgur.com/MiE5TMJ.png',
    alt: 'A giant glowing tree in the middle of a mystical lake.',
    prompt: 'A majestic, glowing tree of life standing in the middle of a serene lake at twilight, fantasy landscape, mystical mountains in the background.',
  },
  {
    src: 'https://i.imgur.com/NIEstEQ.png',
    alt: 'An astronaut fishing from the moon into the clouds.',
    prompt: 'A surreal scene of an astronaut sitting on a crescent moon, fishing for stars in a sea of colorful clouds, digital art.',
  },
  {
    src: 'https://i.imgur.com/P975Gy7.png',
    alt: 'A close-up of a delicious, gourmet hamburger.',
    prompt: 'Extreme close-up of a gourmet cheeseburger with fresh lettuce, tomatoes, and melted cheese on a sesame seed bun, food photography, cinematic lighting.',
  },
  {
    src: 'https://i.imgur.com/wU2yyyw.png',
    alt: 'A watercolor painting of a charming European street.',
    prompt: 'A charming European street scene with cobblestones and colorful buildings, watercolor style, soft and romantic.',
  },
];


const HomePage: React.FC<HomePageProps> = ({ setActivePage }) => {
  return (
    <div className="flex flex-col items-center text-center">
        <div className="max-w-4xl mx-auto w-full">
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

            <div className="mt-20 w-full mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Inspiration Gallery</h2>
                <p className="text-md text-brand-text-secondary mb-8 max-w-2xl mx-auto">
                    See what's possible with our Image Generator. From photorealistic scenes to abstract art, your imagination is the only limit. All images below were generated from simple text prompts.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryItems.map((item, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg">
                            <img 
                                src={item.src} 
                                alt={item.alt} 
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 aspect-square"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <p className="text-white text-xs md:text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    "{item.prompt}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default HomePage;