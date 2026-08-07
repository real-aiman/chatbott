// Shared TypeScript types for the whole app.

export type Role = 'user' | 'assistant';

export interface Attachment {
  id: string;
  name: string;
  type: string; // mime type
  size: number;
  url: string; // object URL / data URL for preview
  kind: 'image' | 'pdf' | 'docx' | 'file';
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  attachments?: Attachment[];
  isStreaming?: boolean;
  error?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  pinned?: boolean;
  favorite?: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Settings {
  themeMode: ThemeMode;
  assistantName: string;
  apiProvider: 'mock' | 'openai' | 'anthropic';
  apiKey: string;
  voiceReplies: boolean;
  streaming: boolean;
  fontScale: 'sm' | 'md' | 'lg';
}
