
import React from 'react';
import { Page } from '../types';
import { NAV_ITEMS } from '../constants';
import { LogoIcon } from './Icons';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  return (
    <nav className="w-64 bg-brand-surface border-r border-brand-border p-4 flex-col hidden md:flex">
      <div className="flex items-center gap-2 mb-8">
        <LogoIcon />
        <h1 className="text-xl font-bold text-white">CreativAI</h1>
      </div>
      <ul className="flex flex-col gap-2">
        {NAV_ITEMS.map((item) => (
          <li key={item.page}>
            <button
              onClick={() => setActivePage(item.page)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === item.page
                  ? 'bg-brand-primary text-white'
                  : 'text-brand-text-secondary hover:bg-brand-border hover:text-brand-text'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <button className="w-full text-left text-brand-text-secondary hover:text-brand-text text-sm">
          Settings
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
