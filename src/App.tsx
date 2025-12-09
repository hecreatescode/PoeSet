import { useState, useEffect, lazy, Suspense } from 'react';
import { BookOpen, FileText, Folder, BarChart3, Settings as SettingsIcon } from 'lucide-react';
import './App.css';
import type { Screen } from './types';
import { getSettings } from './utils/storage';
import { useLanguage } from './i18n/useLanguage';

// Lazy loading komponentów dla lepszej wydajności
const JournalScreen = lazy(() => import('./components/JournalScreen/JournalScreen'));
const PoemsScreen = lazy(() => import('./components/PoemsScreen/PoemsScreen'));
const CollectionsScreen = lazy(() => import('./components/CollectionsScreen/CollectionsScreen'));
const StatisticsScreen = lazy(() => import('./components/StatisticsScreen/StatisticsScreen'));
const SettingsScreen = lazy(() => import('./components/SettingsScreen/SettingsScreen'));

function App() {
  const { t } = useLanguage();
  const [currentScreen, setCurrentScreen] = useState<Screen>('journal');

  // Loading spinner component
  const LoadingSpinner = () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      color: 'var(--text-secondary)'
    }}>
      <div>{t.common.loading}</div>
    </div>
  );

  useEffect(() => {
    // Apply initial settings
    const settings = getSettings();
    document.body.setAttribute('data-theme', settings.theme);
    document.body.classList.add(`font-${settings.fontFamily}`);
    document.body.classList.add(`font-size-${settings.fontSize || 'medium'}`);
    document.body.classList.add(`line-spacing-${settings.lineSpacing}`);
    
    if (settings.highContrast) {
      document.body.classList.add('high-contrast');
    }
    
    if (settings.reducedMotion) {
      document.body.classList.add('reduced-motion');
    }
    
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
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--light-bg)',
        borderBottom: '1px solid var(--light-border)',
        zIndex: 999,
      }}>
        <h1 style={{
          fontFamily: "'Jomhuria', serif",
          fontSize: '3rem',
          fontWeight: 400,
          margin: 0,
          letterSpacing: '2px',
        }}>
          PoeSet
        </h1>
      </header>
      <main className="main-content" style={{ paddingTop: '60px' }}>
        <Suspense fallback={<LoadingSpinner />}>
          {renderScreen()}
        </Suspense>
      </main>

      <nav className="navigation">
        <button 
          className={`nav-button ${currentScreen === 'journal' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('journal')}
        >
          <BookOpen size={24} />
          <span>{t.nav.journal}</span>
        </button>
        
        <button 
          className={`nav-button ${currentScreen === 'poems' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('poems')}
        >
          <FileText size={24} />
          <span>{t.nav.poems}</span>
        </button>
        
        <button 
          className={`nav-button ${currentScreen === 'collections' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('collections')}
        >
          <Folder size={24} />
          <span>{t.nav.collections}</span>
        </button>
        
        <button 
          className={`nav-button ${currentScreen === 'statistics' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('statistics')}
        >
          <BarChart3 size={24} />
          <span>{t.nav.statistics}</span>
        </button>
        
        <button 
          className={`nav-button ${currentScreen === 'settings' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('settings')}
        >
          <SettingsIcon size={24} />
          <span>{t.nav.settings}</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
