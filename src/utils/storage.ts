// System przechowywania danych w localStorage
import type { Poem, Collection, Settings, DailyJournal, Goal, Achievement, PoemVersion, PoemTemplate } from '../types';

const STORAGE_KEYS = {
  POEMS: 'poeset_poems',
  COLLECTIONS: 'poeset_collections',
  JOURNALS: 'poeset_journals',
  SETTINGS: 'poeset_settings',
  TEMPLATES: 'poeset_templates',
};

const MAX_VERSIONS = 10; // Maksymalna liczba zapisanych wersji

// Auto-backup system
let autoBackupInterval: number | null = null;

export const startAutoBackup = (intervalMinutes: number = 30): void => {
  if (autoBackupInterval) {
    clearInterval(autoBackupInterval);
  }
  
  autoBackupInterval = window.setInterval(() => {
    const data = exportAllData();
    try {
      // Save to IndexedDB for persistence
      if ('indexedDB' in window) {
        const request = indexedDB.open('PoeSetBackup', 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains('backups')) {
            db.createObjectStore('backups', { keyPath: 'id' });
          }
        };
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(['backups'], 'readwrite');
          const store = transaction.objectStore('backups');
          store.put({
            id: 'latest',
            data: data,
            timestamp: new Date().toISOString(),
          });
        };
      }
    } catch (error) {
      console.error('Auto-backup failed:', error);
    }
  }, intervalMinutes * 60 * 1000);
};

export const stopAutoBackup = (): void => {
  if (autoBackupInterval) {
    clearInterval(autoBackupInterval);
    autoBackupInterval = null;
  }
};

export const downloadBackup = (): void => {
  const data = exportAllData();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `poeset-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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
    const existingPoem = poems[existingIndex];
    
    // Zapisz wersję tylko jeśli treść się zmieniła
    if (existingPoem.content !== poem.content) {
      const versions = existingPoem.versions || [];
      const newVersion: PoemVersion = {
        id: `v_${Date.now()}`,
        content: existingPoem.content,
        timestamp: existingPoem.updatedAt,
      };
      
      // Dodaj nową wersję na początku i ogranicz do MAX_VERSIONS
      versions.unshift(newVersion);
      poem.versions = versions.slice(0, MAX_VERSIONS);
    } else {
      // Zachowaj istniejące wersje jeśli treść się nie zmieniła
      poem.versions = existingPoem.versions;
    }
    
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

export const addPoemToCollection = (poemId: string, collectionId: string): void => {
  const poem = getPoems().find(p => p.id === poemId);
  if (!poem) return;
  
  if (!poem.collectionIds.includes(collectionId)) {
    poem.collectionIds.push(collectionId);
    savePoem(poem);
  }
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
  const defaultSettings: Settings = {
    theme: 'light',
    fontFamily: 'serif',
    fontSize: 'medium',
    lineSpacing: 'normal',
    layoutWidth: 'medium',
    startView: 'journal',
    language: 'pl',
    enableMarkdown: true,
    enableEncryption: false,
    enableReminders: false,
    enableSwipeGestures: true,
    highContrast: false,
    reducedMotion: false,
    offlineMode: true,
    customMoods: [],
    autoBackup: false,
    autoBackupInterval: 30,
    customFonts: [],
    selectedCustomFont: undefined,
    useFileSystem: false,
  };
  
  if (!data) return defaultSettings;
  
  const savedSettings = JSON.parse(data);
  // Merge with defaults to ensure all properties exist
  return {
    ...defaultSettings,
    ...savedSettings,
    customMoods: savedSettings.customMoods || [],
    autoBackup: savedSettings.autoBackup || false,
    autoBackupInterval: savedSettings.autoBackupInterval || 30,
    useFileSystem: savedSettings.useFileSystem || false,
  };
};

export const saveSettings = (settings: Settings): void => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

// Goals
const GOALS_KEY = 'poeset_goals';

export const getGoals = (): Goal[] => {
  const data = localStorage.getItem(GOALS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveGoal = (goal: Goal): void => {
  const goals = getGoals();
  const existingIndex = goals.findIndex(g => g.id === goal.id);
  if (existingIndex >= 0) {
    goals[existingIndex] = goal;
  } else {
    goals.push(goal);
  }
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
};

export const deleteGoal = (id: string): void => {
  const goals = getGoals().filter(g => g.id !== id);
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
};

// Achievements
const ACHIEVEMENTS_KEY = 'poeset_achievements';

export const getAchievements = (): Achievement[] => {
  const data = localStorage.getItem(ACHIEVEMENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveAchievement = (achievement: Achievement): void => {
  const achievements = getAchievements();
  const existingIndex = achievements.findIndex(a => a.id === achievement.id);
  if (existingIndex >= 0) {
    achievements[existingIndex] = achievement;
  } else {
    achievements.push(achievement);
  }
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
};

// Templates
export const getTemplates = (): PoemTemplate[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
  const templates = data ? JSON.parse(data) : [];
  
  // Add default templates if none exist
  if (templates.length === 0) {
    const defaultTemplates: PoemTemplate[] = [
      {
        id: 'sonet',
        name: 'Sonet',
        structure: '14 wersów, 2 czterowiersze i 2 trzywiersze\nRym: ABBA ABBA CDC DCD\nMetrum: najczęściej jedenastozgłoskowiec',
        example: 'Nie ten jest szczęśliwy, kto samym szczęściem,\nJeno ten, kto szczęściem dobrze władnąć umie;\nKto wie, że przyjemność w rozkoszy się dymie,\nA szczęście prawdziwe w spokoju niewieścim.',
        isCustom: false,
      },
      {
        id: 'haiku',
        name: 'Haiku',
        structure: '3 wersy: 5-7-5 sylab\nTematyka: natura, pora roku, ulotność\nBez rymu, prostota wyrazu',
        example: 'Stary staw w ciszy,\nŻaba skacze do wody —\nPlusk w ciemnościach nocy.',
        isCustom: false,
      },
      {
        id: 'limerick',
        name: 'Limerick',
        structure: '5 wersów humorystycznych\nRym: AABBA\nWersy 1,2,5 dłuższe, 3,4 krótsze',
        example: 'Był sobie raz człowiek z Krakowa,\nCo lubił wymyślać nowe słowa,\nAż pewnego razu,\nW samym środku frazu,\nZawiązał się językowy supełek — i już dłuższa wypowiedź była niemożliwa.',
        isCustom: false,
      },
    ];
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(defaultTemplates));
    return defaultTemplates;
  }
  
  return templates;
};

export const saveTemplate = (template: PoemTemplate): void => {
  const templates = getTemplates();
  const existingIndex = templates.findIndex(t => t.id === template.id);
  
  if (existingIndex >= 0) {
    templates[existingIndex] = template;
  } else {
    templates.push(template);
  }
  
  localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
};

export const deleteTemplate = (id: string): void => {
  const templates = getTemplates().filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
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
