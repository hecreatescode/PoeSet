import { useState } from 'react';

export interface Settings {
  customFonts?: string[];
  selectedCustomFont?: string;
  fontFamily?: string;
  customMoods?: string[];
  language?: string;
  [key: string]: any;
}

const defaultSettings: Settings = {
  customFonts: [],
  selectedCustomFont: undefined,
  fontFamily: 'serif',
  customMoods: [],
  language: 'pl',
};

export default function useSettings() {

  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const stored = localStorage.getItem('poeset_settings');
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem('poeset_settings', JSON.stringify(updated));
      return updated;
    });
  };

  return { settings, updateSetting };
}
