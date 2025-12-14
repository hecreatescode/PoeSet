  // Reaguj na zmianę odstępów między wersami (lineSpacing)
  useEffect(() => {
    const allowed = ['compact', 'normal', 'relaxed'];
    allowed.forEach(val => document.body.classList.remove(`line-spacing-${val}`));
    document.body.classList.add(`line-spacing-${settings.lineSpacing}`);
  }, [settings.lineSpacing]);
import { useState, useEffect, lazy, Suspense } from 'react';
import { NotificationProvider } from './components/Notification';
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
  const [settings, setSettings] = useState(getSettings());

  // Swipe gesture state
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  // Minimum distance to trigger swipe (in pixels)
  const minSwipeDistance = 80;
  // Maximum vertical distance to still count as horizontal swipe
  const maxVerticalDistance = 100;

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
    const s = getSettings();
    setSettings(s);
    document.body.setAttribute('data-theme', s.theme);
    document.body.classList.add(`font-${s.fontFamily}`);
    document.body.classList.add(`font-size-${s.fontSize || 'medium'}`);
    document.body.classList.add(`line-spacing-${s.lineSpacing}`);
    document.body.classList.add(`layout-width-${s.layoutWidth}`);
    if (s.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    if (s.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
    setCurrentScreen(s.startView);

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

  // Reaguj na zmianę highContrast
  useEffect(() => {
    if (settings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [settings.highContrast]);

  // Reaguj na zmianę reducedMotion
  useEffect(() => {
    if (settings.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }, [settings.reducedMotion]);

  // Reaguj na zmianę enableMarkdown (np. body class, jeśli chcesz stylować)
  useEffect(() => {
    if (settings.enableMarkdown) {
      document.body.classList.add('markdown-enabled');
    } else {
      document.body.classList.remove('markdown-enabled');
    }
  }, [settings.enableMarkdown]);

  // Reaguj na zmianę enableSwipeGestures (np. body class, jeśli chcesz stylować)
  useEffect(() => {
    if (settings.enableSwipeGestures) {
      document.body.classList.add('swipe-enabled');
    } else {
      document.body.classList.remove('swipe-enabled');
    }
  }, [settings.enableSwipeGestures]);

  // Listen for theme changes in settings
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'poeset_settings') {
        const s = getSettings();
        setSettings(s);
        document.body.setAttribute('data-theme', s.theme);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // React to theme change in settings (local update)
  useEffect(() => {
    document.body.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  // Swipe gesture handlers
  useEffect(() => {
    const settings = getSettings();
    if (!settings.enableSwipeGestures) return;

    const isInteractiveElement = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof Element)) return false;
      
      const tagName = target.tagName.toLowerCase();
      const interactiveTags = ['input', 'textarea', 'select', 'button', 'a'];
      
      if (interactiveTags.includes(tagName)) return true;
      
      // Check if inside a modal, editor, or other interactive component
      const closestInteractive = target.closest(
        '.modal, [role="dialog"], [contenteditable], .poem-editor, .collection-editor'
      );
      
      return closestInteractive !== null;
    };

    const onTouchStart = (e: TouchEvent) => {
      // Don't start swipe on interactive elements
      if (isInteractiveElement(e.target)) {
        setIsSwiping(false);
        return;
      }
      
      setTouchEnd(null);
      setTouchStart({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY
      });
      setIsSwiping(true);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isSwiping || !touchStart) return;
      
      setTouchEnd({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY
      });
    };

    const onTouchEnd = () => {
      if (!isSwiping || !touchStart || !touchEnd) {
        setTouchStart(null);
        setTouchEnd(null);
        setIsSwiping(false);
        return;
      }
      
      const distanceX = touchStart.x - touchEnd.x;
      const distanceY = Math.abs(touchStart.y - touchEnd.y);
      
      // Only trigger horizontal swipe if vertical movement is minimal
      if (distanceY > maxVerticalDistance) {
        setTouchStart(null);
        setTouchEnd(null);
        setIsSwiping(false);
        return;
      }
      
      const isLeftSwipe = distanceX > minSwipeDistance;
      const isRightSwipe = distanceX < -minSwipeDistance;
      
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
      setIsSwiping(false);
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', onTouchEnd);

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [currentScreen, touchStart, touchEnd, isSwiping]);

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
    <NotificationProvider>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src="/naglowek.svg"
            alt="PoeSet Header"
            style={{
              width: '240px',
              height: '48px',
              color: 'var(--primary)', // automatyczny kolor z motywu
            }}
            className="app-logo"
          />
        </div>
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
    </NotificationProvider>
  );
}

export default App;
