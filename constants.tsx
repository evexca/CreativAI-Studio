
import React from 'react';
import { NavItem, Page } from './types';
import { LayoutIcon, ChatIcon, ImageIcon, MusicIcon, SettingsIcon } from './components/Icons';

export const NAV_ITEMS: NavItem[] = [
  { page: Page.HOME, label: 'Home', icon: <LayoutIcon /> },
  { page: Page.CHAT, label: 'AI Chat', icon: <ChatIcon /> },
  { page: Page.IMAGE_GENERATOR, label: 'Image Generator', icon: <ImageIcon /> },
  { page: Page.MUSIC_GENERATOR, label: 'AI Music', icon: <MusicIcon /> },
  { page: Page.SETTINGS, label: 'Settings', icon: <SettingsIcon /> },
];