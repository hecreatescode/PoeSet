// System przechowywania danych w localStorage
import type { Poem, Collection, Settings, DailyJournal } from '../types';

const STORAGE_KEYS = {
  POEMS: 'poeset_poems',
  COLLECTIONS: 'poeset_collections',
  JOURNALS: 'poeset_journals',
  SETTINGS: 'poeset_settings',
};

// Poems
export const getPoems = (): Poem[] => {
  const data = localStorage.getItem(STORAGE_KEYS.POEMS);
  return data ? JSON.parse(data) : [];
};

export const savePoem = (poem: Poem): void => {
  const poems = getPoems();
  const existingIndex = poems.findIndex(p => p.id === poem.id);
  
  if (existingIndex >= 0) {
    poems[existingIndex] = poem;
  } else {
    poems.push(poem);
  }
  
  localStorage.setItem(STORAGE_KEYS.POEMS, JSON.stringify(poems));
};

export const deletePoem = (id: string): void => {
  const poems = getPoems().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.POEMS, JSON.stringify(poems));
};

export const getPoemById = (id: string): Poem | undefined => {
  return getPoems().find(p => p.id === id);
};

// Collections
export const getCollections = (): Collection[] => {
  const data = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
  return data ? JSON.parse(data) : [];
};

export const saveCollection = (collection: Collection): void => {
  const collections = getCollections();
  const existingIndex = collections.findIndex(c => c.id === collection.id);
  
  if (existingIndex >= 0) {
    collections[existingIndex] = collection;
  } else {
    collections.push(collection);
  }
  
  localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
};

export const deleteCollection = (id: string): void => {
  const collections = getCollections().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
};

// Daily Journals
export const getJournals = (): DailyJournal[] => {
  const data = localStorage.getItem(STORAGE_KEYS.JOURNALS);
  return data ? JSON.parse(data) : [];
};

export const getJournalByDate = (date: string): DailyJournal | undefined => {
  return getJournals().find(j => j.date === date);
};

export const saveJournal = (journal: DailyJournal): void => {
  const journals = getJournals();
  const existingIndex = journals.findIndex(j => j.date === journal.date);
  
  if (existingIndex >= 0) {
    journals[existingIndex] = journal;
  } else {
    journals.push(journal);
  }
  
  localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));
};

// Settings
export const getSettings = (): Settings => {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : {
    theme: 'light',
    fontFamily: 'serif',
    lineSpacing: 'normal',
    startView: 'journal',
    language: 'pl',
  };
};

export const saveSettings = (settings: Settings): void => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

// Export/Backup
export const exportAllData = (): string => {
  return JSON.stringify({
    poems: getPoems(),
    collections: getCollections(),
    journals: getJournals(),
    settings: getSettings(),
    exportDate: new Date().toISOString(),
  }, null, 2);
};

export const importAllData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    if (data.poems) localStorage.setItem(STORAGE_KEYS.POEMS, JSON.stringify(data.poems));
    if (data.collections) localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(data.collections));
    if (data.journals) localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(data.journals));
    if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
    return true;
  } catch (error) {
    console.error('Import failed:', error);
    return false;
  }
};
