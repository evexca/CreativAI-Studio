
import React from 'react';
import { Page } from '../types';
import { ChatIcon, ImageIcon, MusicIcon } from '../components/Icons';

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
    className="bg-brand-light border border-brand-light-gray rounded-xl p-6 text-center w-full h-full flex flex-col items-center hover:border-brand-primary hover:shadow-lg transition-all duration-300 group"
    aria-label={`Go to ${title}`}
  >
    <div className="text-brand-primary text-3xl mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-brand-dark mb-2">{title}</h3>
    <p className="text-brand-gray flex-grow text-sm">{description}</p>
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
    <div className="flex flex-col text-center h-full">
        <div className="max-w-5xl mx-auto w-full">
             <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-light-gray shadow-lg mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-4">
                    Welcome to <span className="text-brand-primary">Creativ AI</span>
                </h1>
                <p className="text-base sm:text-lg text-brand-gray max-w-3xl mx-auto">
                    Your all-in-one platform for exploring the creative power of AI. Choose a tool below to begin your journey.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto mb-12 md:mb-16">
                <FeatureCard 
                    icon={<ChatIcon />}
                    title="AI Chat"
                    description="Engage in intelligent conversations and get instant, human-like answers."
                    onClick={() => setActivePage(Page.CHAT)}
                />
                <FeatureCard 
                    icon={<ImageIcon />}
                    title="Image Generator"
                    description="Bring your wildest ideas to life. Create stunning visuals from simple text."
                    onClick={() => setActivePage(Page.IMAGE_GENERATOR)}
                />
                 <FeatureCard 
                    icon={<MusicIcon />}
                    title="Music Generator"
                    description="Compose unique song structures, lyrics, and chords from a simple idea."
                    onClick={() => setActivePage(Page.MUSIC_GENERATOR)}
                />
            </div>

            <div className="w-full">
                <h2 className="text-3xl font-bold text-brand-dark mb-4">Inspiration Gallery</h2>
                <p className="text-md text-brand-gray mb-8 max-w-2xl mx-auto">
                    See what's possible with our Image Generator. From photorealistic scenes to abstract art, your imagination is the only limit.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryItems.map((item, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-lg shadow-md">
                            <img 
                                src={item.src} 
                                alt={item.alt} 
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 aspect-square"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2 sm:p-4">
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
