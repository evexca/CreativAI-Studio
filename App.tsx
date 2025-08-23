
import React, { useState, useCallback } from 'react';
import { Page } from './types';
import { NAV_ITEMS } from './constants';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import ImageGeneratorPage from './pages/ImageGeneratorPage';
import MusicGeneratorPage from './pages/SearchPage';
import SplashScreen from './pages/SplashScreen';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.HOME);
  const [isAppStarted, setIsAppStarted] = useState<boolean>(false);

  const renderPage = useCallback(() => {
    switch (activePage) {
      case Page.HOME:
        return <HomePage setActivePage={setActivePage} />;
      case Page.CHAT:
        return <ChatPage />;
      case Page.IMAGE_GENERATOR:
        return <ImageGeneratorPage />;
      case Page.MUSIC_GENERATOR:
        return <MusicGeneratorPage />;
      default:
        return <HomePage setActivePage={setActivePage} />;
    }
  }, [activePage]);

  const currentPage = NAV_ITEMS.find(item => item.page === activePage) || NAV_ITEMS[0];
  
  if (!isAppStarted) {
    return <SplashScreen onGetStarted={() => setIsAppStarted(true)} />;
  }

  return (
    <div className="flex h-screen bg-brand-bg font-sans">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex flex-col flex-1">
        <Header 
          title={currentPage.label}
          activePage={activePage}
          setActivePage={setActivePage}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;