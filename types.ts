export enum Page {
  HOME = 'HOME',
  CHAT = 'CHAT',
  IMAGE_GENERATOR = 'IMAGE_GENERATOR',
  VIDEO_GENERATOR = 'VIDEO_GENERATOR',
  MUSIC_GENERATOR = 'MUSIC_GENERATOR',
}

export interface NavItem {
  page: Page;
  label: string;
  icon: React.ReactNode;
}

export enum MessageRole {
    USER = 'user',
    MODEL = 'model',
    SYSTEM = 'system',
}

export interface ChatMessage {
    role: MessageRole;
    text: string;
    isStreaming?: boolean;
}