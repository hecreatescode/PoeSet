import { useState, useEffect } from 'react';
import { BookOpen, FileText, Folder, BarChart3, Settings as SettingsIcon } from 'lucide-react';
import './App.css';
import type { Screen } from './types';
import { getSettings } from './utils/storage';
import JournalScreen from './components/JournalScreen/JournalScreen';
import PoemsScreen from './components/PoemsScreen/PoemsScreen';
import CollectionsScreen from './components/CollectionsScreen/CollectionsScreen';
import StatisticsScreen from './components/StatisticsScreen/StatisticsScreen';
import SettingsScreen from './components/SettingsScreen/SettingsScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('journal');

  useEffect(() => {
    // Apply initial settings
    const settings = getSettings();
    document.body.setAttribute('data-theme', settings.theme);
    document.body.classList.add(`font-${settings.fontFamily}`);
    document.body.classList.add(`line-spacing-${settings.lineSpacing}`);
    
    // Set initial screen from settings
    setCurrentScreen(settings.startView);
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'journal':
        return <JournalScreen />;
      case 'poems':
        return <PoemsScreen />;
      case 'collections':
        return <CollectionsScreen />;
      case 'statistics':
        return <StatisticsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <JournalScreen />;
    }
  };

  return (
    <div className="app">
      <main className="main-content">
        {renderScreen()}
      </main>

      <nav className="navigation">
        <button 
          className={`nav-button ${currentScreen === 'journal' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('journal')}
        >
          <BookOpen size={24} />
          <span>Dziennik</span>
        </button>
        
        <button 
          className={`nav-button ${currentScreen === 'poems' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('poems')}
        >
          <FileText size={24} />
          <span>Wiersze</span>
        </button>
        
        <button 
          className={`nav-button ${currentScreen === 'collections' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('collections')}
        >
          <Folder size={24} />
          <span>Zbiory</span>
        </button>
        
        <button 
          className={`nav-button ${currentScreen === 'statistics' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('statistics')}
        >
          <BarChart3 size={24} />
          <span>Statystyki</span>
        </button>
        
        <button 
          className={`nav-button ${currentScreen === 'settings' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('settings')}
        >
          <SettingsIcon size={24} />
          <span>Ustawienia</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
