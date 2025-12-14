function downloadBackup(settings: any) {
  const dataStr = JSON.stringify(settings, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'poeset-backup.json';
  a.click();
  URL.revokeObjectURL(url);
}

function handleExport(settings: any) {
  downloadBackup(settings);
}
import { useState, useContext } from 'react';
import { useNotification } from '../Notification';
import { Type, Languages, AlignLeft, Maximize, FileText, Layout, Eye, HardDrive, Save, Download, Upload, Palette } from 'lucide-react';
import { LanguageContext } from '../../i18n/languageContextInternal';
import useSettings from '../../hooks/useSettings';
// import { DEFAULT_MOODS } from '../../types';


function handleImport(updateSetting: (key: string, value: any) => void, notify: (msg: string, type?: any) => void) {
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
        updateSetting(key, imported[key]);
      });
      notify('Import zakończony sukcesem!', 'success');
    } catch {
      notify('Błąd importu pliku.', 'error');
    }
  };
  input.click();
}

// nieużywane

const SettingsScreen = () => {
  const languageContext = useContext(LanguageContext);
  if (!languageContext) throw new Error('LanguageContext not found');
  const { t, language, setLanguage } = languageContext;
  const { settings, updateSetting } = useSettings();
  const { notify } = useNotification();
  const [newFont, setNewFont] = useState('');

  const handleAddCustomFont = (font: string) => {
    if (!settings.customFonts?.includes(font)) {
      updateSetting('customFonts', [...(settings.customFonts || []), font]);
      setNewFont('');
      // Dodaj link do Google Fonts
      const fontName = font.replace(/ /g, '+');
      if (!document.getElementById(`gf-${fontName}`)) {
        const link = document.createElement('link');
        link.id = `gf-${fontName}`;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css?family=${fontName}:400,700&display=swap`;
        document.head.appendChild(link);
      }
    }
  };
  // Automatyczne ładowanie wybranej czcionki Google Fonts

  // nieużywane

  // nieużywane

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'var(--spacing-md)' }}>
      <header className="mb-xl" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '0.5rem', fontWeight: 300 }}>
          {t.settings.title}
        </h1>
        <p className="text-secondary" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>{t.settings.subtitle}</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        {/* Custom Fonts */}
        <div className="card" style={{ cursor: 'default', marginBottom: 'var(--spacing-lg)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Type size={20} />
            {t.settings.customFonts || 'Niestandardowe czcionki'}
          </h3>
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
          </div>

        {/* Font family */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Type size={20} />
            {t.settings.font}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 'var(--spacing-sm)' }}>
            <button
              className={`button ${settings.fontFamily === 'serif' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('fontFamily', 'serif')}
            >
              {t.settings.serif}
            </button>
            <button
              className={`button ${settings.fontFamily === 'sans-serif' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('fontFamily', 'sans-serif')}
            >
              {t.settings.sansSerif}
            </button>
          </div>
        </div>

        {/* Theme Picker */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Palette size={20} />
            {t.settings.theme || 'Motyw aplikacji'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 'var(--spacing-sm)' }}>
            <button
              className={`button ${!settings.theme ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('theme', undefined)}
            >
              {t.editor?.defaultTheme || 'Domyślny'}
            </button>
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

        {/* Language */}
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

        {/* Line spacing */}
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


        {/* Font Size & Layout Width (Redesigned) */}
        <div className="card" style={{ cursor: 'default', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <Type size={20} />
              {t.accessibility.fontSize}
            </h3>
            <div style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {t.settings.customFontsDesc || 'Dostosuj rozmiar tekstu w aplikacji'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>A</span>
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={settings.fontSize === 'small' ? 0 : settings.fontSize === 'medium' ? 1 : settings.fontSize === 'large' ? 2 : 3}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  const sizes = ['small', 'medium', 'large', 'xlarge'] as const;
                  updateSetting('fontSize', sizes[value]);
                }}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: '1.6rem', fontWeight: 600 }}>A</span>
            </div>
            <div style={{ marginTop: 4, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              {settings.fontSize === 'small' ? t.accessibility.small :
                settings.fontSize === 'medium' ? t.accessibility.medium :
                settings.fontSize === 'large' ? t.accessibility.large :
                t.accessibility.xlarge}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <Maximize size={20} />
              {t.settings.layoutWidth}
            </h3>
            <div style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {t.settings.layoutWidth || 'Dostosuj szerokość treści aplikacji'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ width: 40, textAlign: 'center', fontSize: '0.9rem', opacity: 0.7 }}>{t.settings.narrow}</span>
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={settings.layoutWidth === 'narrow' ? 0 : settings.layoutWidth === 'medium' ? 1 : settings.layoutWidth === 'wide' ? 2 : 3}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  const widths = ['narrow', 'medium', 'wide', 'full'] as const;
                  updateSetting('layoutWidth', widths[value]);
                }}
                style={{ flex: 1 }}
              />
              <span style={{ width: 100, textAlign: 'center', fontSize: '1.35rem', fontWeight: 600 }}>{t.settings.full}</span>
            </div>
            <div style={{ marginTop: 4, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              {settings.layoutWidth === 'narrow' ? `${t.settings.narrow} (600px)` :
                settings.layoutWidth === 'medium' ? `${t.settings.medium} (900px)` :
                settings.layoutWidth === 'wide' ? `${t.settings.wide} (1200px)` :
                `${t.settings.full} (100%)`}
            </div>
          </div>
        </div>

        {/* Start view */}
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

        {/* Features */}
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

        {/* Accessibility */}
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

        {/* Backup */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <HardDrive size={20} />
            {t.settings.backup}
          </h3>
          
          {/* Auto backup section */}
          <div style={{ 
            background: 'var(--bg-secondary)', 
            borderRadius: 'var(--radius-md)', 
            padding: 'var(--spacing-md)', 
            marginBottom: 'var(--spacing-md)',
            border: '1px solid var(--border-color)'
          }}>
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
              onClick={() => downloadBackup(settings)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--spacing-md)', gap: '0.5rem' }}
            >
              <Save size={24} />
              <span style={{ fontSize: '0.75rem' }}>{t.settings.downloadBackup || 'Pobierz kopię'}</span>
            </button>
            <button 
              className="button button-secondary" 
              onClick={() => handleExport(settings)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--spacing-md)', gap: '0.5rem' }}
            >
              <Download size={24} />
              <span style={{ fontSize: '0.75rem' }}>{t.settings.export}</span>
            </button>
            <button 
              className="button button-secondary" 
              onClick={() => handleImport(updateSetting, notify)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--spacing-md)', gap: '0.5rem' }}
            >
              <Upload size={24} />
              <span style={{ fontSize: '0.75rem' }}>{t.settings.import}</span>
            </button>
          </div>

          {/* File System API section */}
          <div style={{ 
            background: 'var(--bg-secondary)', 
            borderRadius: 'var(--radius-md)', 
            padding: 'var(--spacing-md)',
            border: '1px solid var(--border-color)'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.useFileSystem || false}
                onChange={(e) => updateSetting('useFileSystem', e.target.checked)}
              />
              <div>
                <span style={{ fontWeight: 500 }}>{t.settings.saveToDevice || 'Zapisuj dane bezpośrednio na urządzeniu'}</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                  📁 {t.settings.fileSystemNote || 'Używa File System Access API (wymaga nowoczesnej przeglądarki)'}
                </p>
              </div>
            </label>
          </div>
          
          <div style={{ 
            marginTop: 'var(--spacing-md)', 
            padding: 'var(--spacing-sm) var(--spacing-md)',
            background: settings.useFileSystem ? 'rgba(76, 175, 80, 0.1)' : 'rgba(33, 150, 243, 0.1)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)'
          }}>
            💾 {settings.useFileSystem 
              ? (t.settings.storageDisk || 'Dane zapisywane bezpośrednio na dysku') 
              : (t.settings.storageLocal || 'Dane zapisywane w przeglądarce (localStorage + IndexedDB)')}
          </div>
        </div>




        {/* About */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500 }}>
            {t.settings.about}
          </h3>
          <p className="text-secondary" style={{ marginBottom: 'var(--spacing-sm)' }}>
            <strong>PoeSet</strong> - {t.settings.aboutDescription}
          </p>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
            {t.settings.version} 2.0.1
          </p>
          <p className="text-secondary" style={{ fontSize: '0.875rem', marginTop: 'var(--spacing-md)' }}>
            {t.settings.aboutText}
          </p>
        </div>
      </div>
    </div>
  </div>
  );
};
export default SettingsScreen;
