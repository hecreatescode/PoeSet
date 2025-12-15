
import { useState, useContext } from 'react';
import { useNotification } from '../Notification';
import { Type, Languages, AlignLeft, Maximize, FileText, Layout, Eye, HardDrive, Palette } from 'lucide-react';
import { LanguageContext } from '../../i18n/languageContextInternal';
import { useSettingsContext } from '../../context/SettingsContext';
import type { Settings } from '../../types';

const TITLE_DECORATORS = [
  { label: '„tytuł wiersza”', value: '„{title}”' },
  { label: '♡ tytuł wiersza ♡', value: '♡ {title} ♡' },
  { label: '♥ tytuł wiersza ♥', value: '♥ {title} ♥' },
  { label: '⸻ tytuł wiersza ⸻', value: '⸻ {title} ⸻' },
  { label: '✦ tytuł wiersza ✦', value: '✦ {title} ✦' },
  { label: '꧁tytuł wiersza꧂', value: '꧁{title}꧂' },
  { label: '┊ tytuł wiersza ┊', value: '┊ {title} ┊' },
  { label: '❁ tytuł wiersza ❁', value: '❁ {title} ❁' },
  { label: '❋ tytuł wiersza ❋', value: '❋ {title} ❋' },
  { label: '𝄪 tytuł wiersza 𝄪', value: '𝄪 {title} 𝄪' },
];

const SettingsScreen = () => {
  const languageContext = useContext(LanguageContext);
  if (!languageContext) throw new Error('LanguageContext not found');
  const { t, language, setLanguage } = languageContext;
  const { settings, updateSetting } = useSettingsContext();
  const { notify } = useNotification();
  const [newFont, setNewFont] = useState('');
  const [customTitleDecorator, setCustomTitleDecorator] = useState(settings.titleDecorator || '');
  // Lokalne stany dla suwaków
  const fontSizeOptions = ['small', 'medium', 'large', 'xlarge'] as const;
  const layoutWidthOptions = ['narrow', 'medium', 'wide', 'full'] as const;
  const [localFontSize, setLocalFontSize] = useState(fontSizeOptions.indexOf(settings.fontSize));
  const [localLayoutWidth, setLocalLayoutWidth] = useState(layoutWidthOptions.indexOf(settings.layoutWidth));

  // Debounce do updateSetting (200ms)
  function debounce<T extends unknown[]>(fn: (...args: T) => void, delay: number) {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: T) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }
  const debouncedUpdateFontSize = debounce((idx: number) => {
    updateSetting('fontSize', fontSizeOptions[idx]);
  }, 200);
  const debouncedUpdateLayoutWidth = debounce((idx: number) => {
    updateSetting('layoutWidth', layoutWidthOptions[idx]);
  }, 200);

  // --- Funkcje pomocnicze ---
  const downloadBackup = (settings: Settings) => {
    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'poeset-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleExport = () => downloadBackup(settings);
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files && target.files[0];
      if (!file) return;
      const text = await file.text();
      try {
        const imported = JSON.parse(text);
        Object.keys(imported).forEach(key => {
          updateSetting(key as keyof typeof settings, imported[key]);
        });
        notify('Import zakończony sukcesem!', 'success');
      } catch {
        notify('Błąd importu pliku.', 'error');
      }
    };
    input.click();
  };
  // Funkcja do dynamicznego ładowania czcionki z Google Fonts
  const loadGoogleFont = (fontName: string) => {
    const formattedFont = fontName.replace(/ /g, '+');
    const id = `gf-${formattedFont}`;
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css?family=${formattedFont}:400,500,700&display=swap`;
      document.head.appendChild(link);
    }
  };

  // Normalizacja nazwy czcionki: każda pierwsza litera wyrazu wielka, reszta małe
  const normalizeFontName = (name: string) =>
    name
      .trim()
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

  // Sprawdzenie czy czcionka istnieje w Google Fonts
  const fontExistsInGoogleFonts = async (fontName: string): Promise<boolean> => {
    const formattedFont = fontName.replace(/ /g, '+');
    try {
      const res = await fetch(`https://fonts.googleapis.com/css?family=${formattedFont}:400`);
      const css = await res.text();
      // Google Fonts zwraca CSS z @font-face jeśli czcionka istnieje
      return css.includes('font-family');
    } catch {
      return false;
    }
  };

  // Dodanie czcionki i ustawienie jej jako aktywnej
  const handleAddCustomFont = async (font: string) => {
    const normalized = normalizeFontName(font);
    if (!normalized) return;
    // Sprawdź czy czcionka istnieje w Google Fonts
    const exists = await fontExistsInGoogleFonts(normalized);
    if (!exists) {
      notify(`Nie znaleziono czcionki "${normalized}" w Google Fonts.`, 'error');
      return;
    }
    if (!settings.customFonts?.includes(normalized)) {
      updateSetting('customFonts', [...(settings.customFonts || []), normalized]);
    }
    updateSetting('selectedCustomFont', normalized);
    loadGoogleFont(normalized);
    notify(`Dodano i ustawiono czcionkę: ${normalized}`, 'success');
  };


    // --- JSX główny ---
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
              fontWeight: 700,
              margin: '0 0 var(--spacing-xl) 0',
              textAlign: 'center',
              letterSpacing: 0.5,
              color: 'var(--accent-color)',
              fontFamily: settings.selectedCustomFont
                ? `'${settings.selectedCustomFont}', ${settings.fontFamily}`
                : settings.fontFamily === 'serif'
                  ? 'Georgia, Times, serif'
                  : 'Inter, Arial, sans-serif',
              transition: 'color 0.2s, font-family 0.2s',
              textShadow: '0 1px 6px var(--bg-secondary), 0 0px 1px var(--accent-color)'
            }}
          >
            Ustawienia
          </h1>
          {/* 1. Motyw */}
          {/* Theme Picker */}
          <div className="card" style={{ cursor: 'default' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <Palette size={20} />
              {t.settings.theme || 'Motyw aplikacji'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 'var(--spacing-sm)' }}>
              <button
                className={`button ${settings.theme === 'light' ? 'button-primary' : 'button-secondary'}`}
                onClick={() => updateSetting('theme', 'light')}
              >
                {t.themes?.light || 'Jasny'}
              </button>
              <button
                className={`button ${settings.theme === 'dark' ? 'button-primary' : 'button-secondary'}`}
                onClick={() => updateSetting('theme', 'dark')}
              >
                {t.themes?.dark || 'Ciemny'}
              </button>
              <button
                className={`button ${settings.theme === 'sepia' ? 'button-primary' : 'button-secondary'}`}
                onClick={() => updateSetting('theme', 'sepia')}
              >
                {t.themes?.sepia || 'Sepia'}
              </button>
              <button
                className={`button ${settings.theme === 'midnight' ? 'button-primary' : 'button-secondary'}`}
                onClick={() => updateSetting('theme', 'midnight')}
              >
                {t.themes?.midnight || 'Nocny'}
              </button>
              <button
                className={`button ${settings.theme === 'forest' ? 'button-primary' : 'button-secondary'}`}
                onClick={() => updateSetting('theme', 'forest')}
              >
                {t.themes?.forest || 'Las'}
              </button>
              <button
                className={`button ${settings.theme === 'ocean' ? 'button-primary' : 'button-secondary'}`}
                onClick={() => updateSetting('theme', 'ocean')}
              >
                {t.themes?.ocean || 'Ocean'}
              </button>
              <button
                className={`button ${settings.theme === 'rose' ? 'button-primary' : 'button-secondary'}`}
                onClick={() => updateSetting('theme', 'rose')}
              >
                {t.themes?.rose || 'Różany'}
              </button>
            </div>
          </div>
          {/* 2. Czcionka i niestandardowa czcionka */}
          <div className="card" style={{ cursor: 'default', marginBottom: 'var(--spacing-lg)' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <Type size={20} />
              {t.settings.font}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 'var(--spacing-sm)', marginBottom: '1rem' }}>
              <button
                className={`button ${settings.fontFamily === 'serif' && !settings.selectedCustomFont ? 'button-primary' : 'button-secondary'}`}
                onClick={() => {
                  updateSetting('fontFamily', 'serif');
                  updateSetting('selectedCustomFont', undefined);
                }}
              >
                {t.settings.serif}
              </button>
              <button
                className={`button ${settings.fontFamily === 'sans-serif' && !settings.selectedCustomFont ? 'button-primary' : 'button-secondary'}`}
                onClick={() => {
                  updateSetting('fontFamily', 'sans-serif');
                  updateSetting('selectedCustomFont', undefined);
                }}
              >
                {t.settings.sansSerif}
              </button>
            </div>
            <div style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {t.settings.customFontsDesc || 'Możesz dodać własną czcionkę z Google Fonts'}
            </div>
            <form onSubmit={e => { e.preventDefault(); if (newFont.trim()) { handleAddCustomFont(newFont.trim()); } }} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                className="custom-font-input"
                placeholder={t.settings.addFontPlaceholder || 'Nazwa czcionki z Google Fonts'}
                value={newFont}
                onChange={e => setNewFont(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="button button-primary">
                {t.settings.addFont || 'Dodaj'}
              </button>
            </form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(settings.customFonts || []).length === 0 && (
                <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>{t.settings.noCustomFonts || 'Brak dodanych czcionek.'}</span>
              )}
              {/* Pokazuj tylko wybraną czcionkę niestandardową, jeśli jest ustawiona */}
              {settings.selectedCustomFont && (
                <div key={settings.selectedCustomFont} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontFamily: `'${settings.selectedCustomFont}', sans-serif`, fontSize: '1.1em' }}>{settings.selectedCustomFont}</span>
                  <span className="button button-primary" style={{ cursor: 'default', boxShadow: '0 0 0 2px var(--accent-color)' }}>Ustawiona</span>
                </div>
              )}
            </div>
          </div>
          {/* 3. Język */}
          <div className="card" style={{ cursor: 'default' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <Languages size={20} />
              Język / Language
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 'var(--spacing-sm)' }}>
              <button
                className={`button ${language === 'pl' ? 'button-primary' : 'button-secondary'}`}
                onClick={() => setLanguage('pl')}
              >
                Polski
              </button>
              <button
                className={`button ${language === 'en' ? 'button-primary' : 'button-secondary'}`}
                onClick={() => setLanguage('en')}
              >
                English
              </button>
            </div>
          </div>
          {/* 4. Widok startowy */}
          <div className="card" style={{ cursor: 'default' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <FileText size={20} />
              {t.settings.startView}
            </h3>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <button
                className={`button ${settings.startView === 'journal' ? 'button-primary' : 'button-secondary'}`}
                onClick={() => updateSetting('startView', 'journal')}
              >
                {t.nav.journal}
              </button>
              <button
                className={`button ${settings.startView === 'poems' ? 'button-primary' : 'button-secondary'}`}
                onClick={() => updateSetting('startView', 'poems')}
              >
                {t.nav.poems}
              </button>
            </div>
          </div>
          {/* 5. Ozdobnik tytułu wiersza */}
          <div className="card" style={{ cursor: 'default' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500 }}>
              Ozdobnik tytułu wiersza
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {TITLE_DECORATORS.map(deco => (
                <button
                  key={deco.value}
                  className={`button ${settings.titleDecorator === deco.value ? 'button-primary' : 'button-secondary'}`}
                  onClick={() => { updateSetting('titleDecorator', deco.value); setCustomTitleDecorator(''); }}
                  style={{ fontFamily: 'inherit' }}
                >
                  {deco.label}
                </button>
              ))}
            </div>
            <form onSubmit={e => { e.preventDefault(); if (customTitleDecorator.trim()) { updateSetting('titleDecorator', customTitleDecorator.trim()); }}} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="custom-font-input"
                placeholder="Własny ozdobnik, np. ✧ {title} ✧"
                value={customTitleDecorator}
                onChange={e => setCustomTitleDecorator(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="button button-primary">
                Ustaw
              </button>
            </form>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.95em', marginTop: '0.5rem' }}>
              Użyj <b>{'{title}'}</b> jako miejsca na tytuł wiersza. Ozdobnik dostosuje się do motywu.
            </div>
          </div>
          {/* 6. Odstępy między wersami */}
          <div className="card" style={{ cursor: 'default' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <AlignLeft size={20} />
              {t.settings.lineSpacing}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 'var(--spacing-sm)' }}>
              <button
                className={`button ${settings.lineSpacing === 'compact' ? 'button-primary' : 'button-secondary'}`}
                onClick={() => updateSetting('lineSpacing', 'compact')}
              >
                {t.settings.compact}
              </button>
              <button
                className={`button ${settings.lineSpacing === 'normal' ? 'button-primary' : 'button-secondary'}`}
                onClick={() => updateSetting('lineSpacing', 'normal')}
              >
                {t.settings.normal}
              </button>
              <button
                className={`button ${settings.lineSpacing === 'relaxed' ? 'button-primary' : 'button-secondary'}`}
                onClick={() => updateSetting('lineSpacing', 'relaxed')}
              >
                {t.settings.relaxed}
              </button>
            </div>
          </div>

          {/* 7. Rozmiar czcionki oraz szerokość układu */}
          <div className="card" style={{ cursor: 'default' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2.5rem',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {/* Rozmiar czcionki */}
              <div style={{ flex: 1, minWidth: 220, width: '100%' }}>
                <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.75rem', whiteSpace: 'nowrap' }}>
                  <Type size={20} /> {t.accessibility.fontSize}
                </h3>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontSize: '0.95rem', opacity: 0.7 }}>A</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>A</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="1"
                    value={localFontSize}
                    onChange={e => {
                      const idx = parseInt(e.target.value);
                      setLocalFontSize(idx);
                      debouncedUpdateFontSize(idx);
                    }}
                    onMouseUp={() => updateSetting('fontSize', fontSizeOptions[localFontSize])}
                    onTouchEnd={() => updateSetting('fontSize', fontSizeOptions[localFontSize])}
                    style={{ width: '100%', display: 'block' }}
                  />
                </div>
                <div style={{ marginTop: 4, fontSize: '0.95rem', color: 'var(--text-secondary)', minHeight: 22, textAlign: 'center' }}>
                  {settings.fontSize === 'small' ? t.accessibility.small :
                    settings.fontSize === 'medium' ? t.accessibility.medium :
                    settings.fontSize === 'large' ? t.accessibility.large :
                    t.accessibility.xlarge}
                </div>
              </div>
              {/* Szerokość układu */}
              <div style={{ flex: 1, minWidth: 220, width: '100%' }}>
                <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.75rem', whiteSpace: 'nowrap' }}>
                  <Maximize size={20} /> {t.settings.layoutWidth}
                </h3>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontSize: '0.95rem', opacity: 0.7 }}>{t.settings.narrow}</span>
                    <span style={{ fontSize: '0.95rem', opacity: 0.7 }}>{t.settings.full}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="1"
                    value={localLayoutWidth}
                    onChange={e => {
                      const idx = parseInt(e.target.value);
                      setLocalLayoutWidth(idx);
                      debouncedUpdateLayoutWidth(idx);
                    }}
                    onMouseUp={() => updateSetting('layoutWidth', layoutWidthOptions[localLayoutWidth])}
                    onTouchEnd={() => updateSetting('layoutWidth', layoutWidthOptions[localLayoutWidth])}
                    style={{ width: '100%', display: 'block' }}
                  />
                </div>
                <div style={{ marginTop: 4, fontSize: '0.95rem', color: 'var(--text-secondary)', minHeight: 22, textAlign: 'center' }}>
                  {settings.layoutWidth === 'narrow' ? `${t.settings.narrow} (600px)` :
                    settings.layoutWidth === 'medium' ? `${t.settings.medium} (900px)` :
                    settings.layoutWidth === 'wide' ? `${t.settings.wide} (1200px)` :
                    `${t.settings.full} (100%)`}
                </div>
              </div>
            </div>
          </div>
          {/* 8. Funkcje */}
          <div className="card" style={{ cursor: 'default' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <Layout size={20} />
              {t.settings.features}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.enableMarkdown}
                  onChange={(e) => updateSetting('enableMarkdown', e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                <span>{t.settings.enableMarkdown}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.enableSwipeGestures}
                  onChange={(e) => updateSetting('enableSwipeGestures', e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                <span>{t.settings.enableSwipeGestures}</span>
              </label>
            </div>
          </div>
          {/* 9. Dostępność */}
          <div className="card" style={{ cursor: 'default' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <Eye size={20} />
              {t.accessibility.title}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => updateSetting('highContrast', e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                <span>{t.accessibility.highContrast}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                <span>{t.accessibility.reducedMotion}</span>
              </label>
            </div>
          </div>
          {/* 10. Kopia zapasowa */}
          <div className="card" style={{ cursor: 'default' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <HardDrive size={20} />
              {t.settings.backup}
            </h3>
            {/* Auto backup section + File System Access */}
            <div style={{ 
              background: 'var(--bg-secondary)', 
              borderRadius: 'var(--radius-md)', 
              padding: 'var(--spacing-md)', 
              marginBottom: 'var(--spacing-md)',
              border: '1px solid var(--border-color)'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer', marginBottom: 'var(--spacing-md)' }}>
                <input
                  type="checkbox"
                  checked={settings.useFileSystem || false}
                  onChange={e => updateSetting('useFileSystem', e.target.checked)}
                />
                <div>
                  <span style={{ fontWeight: 500 }}>
                    {settings.language === 'pl' ? 'Zapisuj wiersze na urządzeniu (poza przeglądarką)' : 'Save poems directly on device (not just browser)'}
                  </span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                    {settings.language === 'pl'
                      ? 'Wymusza zapisywanie i odczyt plików przez system plików urządzenia (File System Access API, wymaga obsługi przez przeglądarkę).'
                      : 'Forces saving and reading files using device file system (File System Access API, browser support required).'}
                  </p>
                </div>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer', marginBottom: settings.autoBackup ? 'var(--spacing-md)' : 0 }}>
                <input
                  type="checkbox"
                  checked={settings.autoBackup || false}
                  onChange={(e) => updateSetting('autoBackup', e.target.checked)}
                />
                <div>
                  <span style={{ fontWeight: 500 }}>{t.settings.autoBackup || 'Automatyczne kopie zapasowe'}</span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                    {settings.language === 'pl' ? 'Tworzy kopię co określony czas' : 'Creates backup at specified intervals'}
                  </p>
                </div>
              </label>
              {settings.autoBackup && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginLeft: '28px' }}>
                  <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {t.settings.backupFrequency || 'Częstotliwość (minuty)'}:
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={settings.autoBackupInterval || 30}
                    onChange={(e) => updateSetting('autoBackupInterval', parseInt(e.target.value))}
                    style={{ flex: 1, maxWidth: '150px' }}
                  />
                  <span style={{ 
                    minWidth: '50px', 
                    textAlign: 'center', 
                    fontWeight: 600, 
                    color: 'var(--accent-color)',
                    fontSize: '0.875rem'
                  }}>
                    {settings.autoBackupInterval || 30} min
                  </span>
                </div>
              )}
            </div>
            {/* Manual backup actions */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-md)'
            }}>
              <button 
                className="button button-primary" 
                onClick={handleExport}
              >
                {t.settings.export || 'Eksportuj ustawienia'}
              </button>
              <button 
                className="button button-secondary" 
                onClick={handleImport}
              >
                {t.settings.import || 'Importuj ustawienia'}
              </button>
              {/* Jeśli masz funkcję resetSettings w kontekście, użyj jej tutaj. Jeśli nie, zostaw przycisk nieaktywny lub ukryj. */}
              {/* <button className="button button-secondary" onClick={resetSettings}> {t.settings.reset || 'Przywróć domyślne'} </button> */}
            </div>
          </div>
          {/* 11. O aplikacji */}
          <div className="card" style={{ cursor: 'default' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500 }}>
              {t.settings.about}
            </h3>
            <p className="text-secondary" style={{ marginBottom: 'var(--spacing-sm)' }}>
              <strong>PoeSet</strong> - {settings.language === 'pl'
                ? 'Minimalistyczna aplikacja offline (PWA) do pisania, organizowania i analizowania własnej poezji — z zaawansowanymi funkcjami i pięknymi motywami.'
                : 'A minimalist, offline-first Progressive Web App for writing, organizing, and analyzing your poetry with advanced features and beautiful themes.'}
            </p>
            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
              {t.settings.version} 2.0.1
            </p>
            <p className="text-secondary" style={{ fontSize: '0.875rem', marginTop: 'var(--spacing-md)' }}>
            </p>
          </div>
        </div>
    );
};
export default SettingsScreen;
