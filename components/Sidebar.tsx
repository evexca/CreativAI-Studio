
import React from 'react';
import { Page } from '../types';
import { NAV_ITEMS } from '../constants';
import { RobotIcon, UserIcon, CloseIcon } from './Icons';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isMobileNavOpen, setIsMobileNavOpen }) => {
  const handleNavClick = (page: Page) => {
    setActivePage(page);
    setIsMobileNavOpen(false);
  };

  return (
    <nav 
        className={`w-72 bg-gradient-to-b from-[#2c3e50] to-[#1a2a6c] text-white p-6 flex flex-col shadow-lg z-30 transform transition-transform duration-300 ease-in-out fixed inset-y-0 left-0 md:relative md:translate-x-0 ${
            isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Main navigation"
    >
      <div className="flex items-center justify-between gap-4 mb-10 pb-5 border-b border-white/10">
        <div className="flex items-center gap-4">
            <div className="text-4xl bg-gradient-to-r from-brand-accent to-brand-primary text-transparent bg-clip-text">
                <RobotIcon />
            </div>
            <h1 className="text-2xl font-bold">Creativ AI</h1>
        </div>
        <button 
            onClick={() => setIsMobileNavOpen(false)} 
            className="md:hidden p-1 text-white/70 hover:text-white"
            aria-label="Close navigation menu"
        >
            <CloseIcon />
        </button>
      </div>
      <ul className="flex flex-col gap-2 flex-1">
        {NAV_ITEMS.map((item) => (
          <li key={item.page}>
            <button
              onClick={() => handleNavClick(item.page)}
              className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl text-md font-medium transition-all duration-300 ${
                activePage === item.page
                  ? 'bg-white/20 font-semibold'
                  : 'hover:bg-white/10'
              }`}
            >
              <span className="w-7 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <div className="flex items-center p-4 bg-black/20 rounded-2xl">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br from-brand-accent to-brand-primary mr-4">
                <UserIcon />
            </div>
            <div>
                <h3 className="text-lg font-semibold">User</h3>
                <p className="text-sm opacity-80">Active now</p>
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
