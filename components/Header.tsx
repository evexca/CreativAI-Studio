
import React, { useState, useRef, useEffect } from 'react';
import { Page } from '../types';
import { SettingsIcon, ChevronLeftIcon } from './Icons';

interface HeaderProps {
  title: string;
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ title, activePage, setActivePage }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-brand-surface border-b border-brand-border px-4 md:px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        {activePage !== Page.HOME && (
          <button
            onClick={() => setActivePage(Page.HOME)}
            className="text-brand-text-secondary hover:text-brand-text transition-colors p-1 -ml-2"
            aria-label="Go back to Home"
          >
            <ChevronLeftIcon />
          </button>
        )}
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>

      <div className="relative" ref={settingsRef}>
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="w-8 h-8 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center hover:bg-brand-border transition-colors"
          aria-haspopup="true"
          aria-expanded={isSettingsOpen}
          aria-label="Open settings menu"
        >
          <SettingsIcon className="w-5 h-5 text-brand-text" />
        </button>
        {isSettingsOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-brand-surface border border-brand-border rounded-md shadow-lg z-20 py-1">
            <a href="#" className="block px-4 py-2 text-sm text-brand-text-secondary hover:bg-brand-border hover:text-brand-text">
              Terms of Service
            </a>
            <a href="#" className="block px-4 py-2 text-sm text-brand-text-secondary hover:bg-brand-border hover:text-brand-text">
              About
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;