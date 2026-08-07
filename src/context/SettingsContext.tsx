import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Settings } from '../types';

const DEFAULT_SETTINGS: Settings = {
  themeMode: 'dark',
  assistantName: 'Chatty',
  apiProvider: 'mock',
  apiKey: '',
  voiceReplies: false,
  streaming: true,
  fontScale: 'md',
};

interface SettingsContextValue {
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<Settings>('Chatty-settings', DEFAULT_SETTINGS);

  const updateSettings = (partial: Partial<Settings>) =>
    setSettings((prev) => ({ ...prev, ...partial }));

  const resetSettings = () => setSettings(DEFAULT_SETTINGS);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
