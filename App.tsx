
import React, { useState, useCallback } from 'react';
import { Page } from './types';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import ImageGeneratorPage from './pages/ImageGeneratorPage';
import MusicGeneratorPage from './pages/SearchPage';
import SettingsPage from './pages/SettingsPage';
import SplashScreen from './pages/SplashScreen';
import { MenuIcon } from './components/Icons';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.HOME);
  const [isAppStarted, setIsAppStarted] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  const renderPage = useCallback(() => {
    switch (activePage) {
      case Page.HOME:
        return <HomePage setActivePage={setActivePage} />;
      case Page.CHAT:
        return <ChatPage />;
      case Page.IMAGE_GENERATOR:
        return <ImageGeneratorPage />;
      case Page.MUSIC_GENERATOR:
        return <MusicGeneratorPage setActivePage={setActivePage} />;
      case Page.SETTINGS:
        return <SettingsPage />;
      default:
        return <HomePage setActivePage={setActivePage} />;
    }
  }, [activePage]);
  
  if (!isAppStarted) {
    return <SplashScreen onGetStarted={() => setIsAppStarted(true)} />;
  }

  return (
    <div className="min-h-screen p-2 sm:p-4 flex justify-center items-center bg-gradient-to-br from-[#1a2a6c] via-[#b21f1f] to-[#1a2a6c]">
      <div className="w-full h-full max-h-screen md:h-[90vh] md:max-w-[1400px] bg-white/95 rounded-2xl shadow-2xl flex overflow-hidden relative">
        {isMobileNavOpen && (
            <div 
                className="fixed inset-0 bg-black/60 z-20 md:hidden"
                onClick={() => setIsMobileNavOpen(false)}
                aria-hidden="true"
            ></div>
        )}
        <Sidebar 
            activePage={activePage} 
            setActivePage={setActivePage}
            isMobileNavOpen={isMobileNavOpen}
            setIsMobileNavOpen={setIsMobileNavOpen}
        />
        <div className="flex-1 flex flex-col overflow-y-auto">
            <header className="md:hidden flex items-center gap-4 p-3 bg-white/80 backdrop-blur-sm border-b border-brand-light-gray sticky top-0 z-10">
                <button 
                    onClick={() => setIsMobileNavOpen(true)} 
                    className="text-brand-dark p-1"
                    aria-label="Open navigation menu"
                >
                    <MenuIcon />
                </button>
                <h1 className="text-lg font-bold text-brand-dark">Creativ AI</h1>
            </header>
            <main className="flex-1 p-3 sm:p-5">
              {renderPage()}
            </main>
        </div>
      </div>
    </div>
  );
};

export default App;
