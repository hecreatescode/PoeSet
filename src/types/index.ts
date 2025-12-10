// Typy danych dla aplikacji PoeSet

export interface PoemVersion {
  id: string;
  content: string;
  timestamp: string;
}

export type MoodType = string; // Can be default moods or custom ones

export const DEFAULT_MOODS = ['happy', 'sad', 'neutral', 'inspired', 'melancholic', 'excited', 'calm', 'anxious'] as const;

export interface Poem {
  id: string;
  title: string;
  content: string;
  date: string; // ISO string
  tags: string[];
  collectionIds: string[];
  createdAt: string;
  updatedAt: string;
  versions?: PoemVersion[];
  mood?: MoodType;
  isEncrypted?: boolean;
  isMarkdown?: boolean;
  template?: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  color: string;
  poemIds: string[];
  createdAt: string;
  isPrivate?: boolean;
  order?: number;
}

export interface DailyJournal {
  date: string; // YYYY-MM-DD
  poemIds: string[];
}

export interface Statistics {
  totalPoems: number;
  poemsThisWeek: number;
  poemsThisMonth: number;
  averageLength: number;
  mostUsedTags: { tag: string; count: number }[];
  writingStreak: number;
  mostProductiveDay: string;
  mostProductiveHour: number;
}

export interface Goal {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  target: number;
  current: number;
  startDate: string;
  endDate?: string;
  title: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export type Theme = 'light' | 'dark' | 'sepia' | 'midnight' | 'forest' | 'ocean' | 'rose';
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';
export type LayoutWidth = 'narrow' | 'medium' | 'wide' | 'full';

export interface Settings {
  theme: Theme;
  fontFamily: 'serif' | 'sans-serif';
  fontSize: FontSize;
  lineSpacing: 'compact' | 'normal' | 'relaxed';
  layoutWidth: LayoutWidth;
  startView: 'journal' | 'poems';
  language: string;
  enableMarkdown: boolean;
  enableEncryption: boolean;
  encryptionKey?: string;
  enableReminders: boolean;
  reminderTime?: string;
  enableSwipeGestures: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  offlineMode: boolean;
  customMoods: string[];
}

export type Screen = 'journal' | 'poems' | 'collections' | 'statistics' | 'settings' | 'templates' | 'goals';

export interface PoemTemplate {
  id: string;
  name: string;
  description?: string;
  structure: string;
  example?: string;
  isCustom?: boolean;
}
