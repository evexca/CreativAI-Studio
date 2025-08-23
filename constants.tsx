
import React from 'react';
import { NavItem, Page } from './types';
import { HomeIcon, ChatIcon, ImageIcon, VideoIcon, MusicIcon } from './components/Icons';

export const NAV_ITEMS: NavItem[] = [
  { page: Page.HOME, label: 'Home', icon: <HomeIcon /> },
  { page: Page.CHAT, label: 'AI Chat', icon: <ChatIcon /> },
  { page: Page.IMAGE_GENERATOR, label: 'Image Generator', icon: <ImageIcon /> },
  { page: Page.VIDEO_GENERATOR, label: 'AI Video', icon: <VideoIcon /> },
  { page: Page.MUSIC_GENERATOR, label: 'AI Music', icon: <MusicIcon /> },
];