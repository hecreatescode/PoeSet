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
const TemplatesScreen = lazy(() => import('./components/TemplatesScreen/TemplatesScreen'));
const GoalsScreen = lazy(() => import('./components/GoalsScreen/GoalsScreen'));

function App() {
  const { t } = useLanguage();
  const [currentScreen, setCurrentScreen] = useState<Screen>('journal');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  // Swipe gesture state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum distance to trigger swipe (in pixels)
  const minSwipeDistance = 50;

  // Screen order for navigation
  const screens: Screen[] = ['journal', 'poems', 'collections', 'statistics', 'settings'];

  // Loading spinner component
  const LoadingSpinner = () => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      color: 'var(--text-secondary)',
      gap: 'var(--spacing-md)',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid var(--border-color)',
        borderTop: '4px solid var(--accent-color)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <div style={{ fontSize: '14px', opacity: 0.7 }}>
        {t.common.loading}
      </div>
    </div>
  );

  useEffect(() => {
    // Apply initial settings
    const settings = getSettings();
    document.body.setAttribute('data-theme', settings.theme);
    document.body.classList.add(`font-${settings.fontFamily}`);
    document.body.classList.add(`font-size-${settings.fontSize || 'medium'}`);
    document.body.classList.add(`line-spacing-${settings.lineSpacing}`);
    document.body.classList.add(`layout-width-${settings.layoutWidth}`);
    
    if (settings.highContrast) {
      document.body.classList.add('high-contrast');
    }
    
    if (settings.reducedMotion) {
      document.body.classList.add('reduced-motion');
    }
    
    // Set initial screen from settings
    setCurrentScreen(settings.startView);

    // PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Swipe gesture handlers
  useEffect(() => {
    const settings = getSettings();
    if (!settings.enableSwipeGestures) return;

    const onTouchStart = (e: TouchEvent) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;
      
      if (isLeftSwipe || isRightSwipe) {
        const currentIndex = screens.indexOf(currentScreen);
        
        if (isLeftSwipe && currentIndex < screens.length - 1) {
          // Swipe left - next screen
          setCurrentScreen(screens[currentIndex + 1]);
        } else if (isRightSwipe && currentIndex > 0) {
          // Swipe right - previous screen
          setCurrentScreen(screens[currentIndex - 1]);
        }
      }
      
      setTouchStart(null);
      setTouchEnd(null);
    };

    document.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [currentScreen, touchStart, touchEnd]);

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
      case 'templates':
        return <TemplatesScreen onBack={() => setCurrentScreen('poems')} onUseTemplate={(template) => console.log('Using template:', template)} />;
      case 'goals':
        return <GoalsScreen />;
      default:
        return <JournalScreen />;
    }
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
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
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-color)',
        zIndex: 999,
      }}>
        <h1 style={{
          fontFamily: "'Jomhuria', serif",
          fontSize: '3rem',
          fontWeight: 400,
          margin: 0,
          letterSpacing: '2px',
          color: 'var(--text-primary)',
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

      {/* PWA Install Prompt */}
      {showInstallPrompt && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: 'var(--spacing-md)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          maxWidth: '90%',
          width: '320px',
        }}>
          <p style={{ margin: '0 0 var(--spacing-md) 0', fontSize: '14px' }}>
            Zainstaluj PoeSet jako aplikację na swoim urządzeniu!
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <button 
              className="button button-primary" 
              onClick={handleInstallClick}
              style={{ flex: 1 }}
            >
              Zainstaluj
            </button>
            <button 
              className="button button-secondary" 
              onClick={() => setShowInstallPrompt(false)}
              style={{ flex: 1 }}
            >
              Później
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
