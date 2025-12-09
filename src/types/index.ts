// Typy danych dla aplikacji PoeSet

export interface Poem {
  id: string;
  title: string;
  content: string;
  date: string; // ISO string
  tags: string[];
  collectionIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  color: string;
  poemIds: string[];
  createdAt: string;
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

export type Theme = 'light' | 'dark' | 'sepia';

export interface Settings {
  theme: Theme;
  fontFamily: 'serif' | 'sans-serif';
  lineSpacing: 'compact' | 'normal' | 'relaxed';
  startView: 'journal' | 'poems';
  language: string;
}

export type Screen = 'journal' | 'poems' | 'collections' | 'statistics' | 'settings';
