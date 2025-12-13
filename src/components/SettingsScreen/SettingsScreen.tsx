import React, { useState, useEffect } from 'react';
import { FileText, Download, Upload, Type, AlignLeft, Layout, Palette, Eye, Maximize, Languages, Smile, Plus, X, Save, HardDrive } from 'lucide-react';
import type { Settings } from '../../types';
import { getSettings, saveSettings, exportAllData, importAllData, downloadBackup, startAutoBackup, stopAutoBackup } from '../../utils/storage';
import { useLanguage } from '../../i18n/useLanguage';
import { DEFAULT_MOODS } from '../../types';

const SettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(getSettings());
  const { language, setLanguage, t } = useLanguage();
  const [newFont, setNewFont] = useState('');

  const applySettings = React.useCallback((newSettings: Settings) => {
    document.body.setAttribute('data-theme', newSettings.theme);
    document.body.classList.remove('font-serif', 'font-sans');
    document.body.classList.add(`font-${newSettings.fontFamily}`);
    document.body.classList.remove('line-spacing-compact', 'line-spacing-normal', 'line-spacing-relaxed');
    document.body.classList.add(`line-spacing-${newSettings.lineSpacing}`);
    
    // Font size
    document.body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large', 'font-size-xlarge');
    document.body.classList.add(`font-size-${newSettings.fontSize}`);
    
    // Layout width
    document.body.classList.remove('layout-width-narrow', 'layout-width-medium', 'layout-width-wide', 'layout-width-full');
    document.body.classList.add(`layout-width-${newSettings.layoutWidth}`);
    
    // Accessibility
    if (newSettings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    if (newSettings.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }, []);

  useEffect(() => {
    applySettings(settings);
    
    // Load custom fonts
    const customFonts = settings.customFonts || [];
        {/* Font Size & Layout Width */}
        <div className="card" style={{ cursor: 'default', marginBottom: 'var(--spacing-lg)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Type size={20} />
            {t.settings.fontSize || 'Rozmiar czcionki'}
          </h3>
          <input
            type="range"
            min={0}
            max={3}
            value={['small','medium','large','xlarge'].indexOf(settings.fontSize)}
            onChange={e => {
              const idx = parseInt(e.target.value, 10);
              updateSetting('fontSize', ['small','medium','large','xlarge'][idx]);
            }}
            style={{ width: '100%' }}
          />
          <div style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '1.2em' }}>
            {t.settings[settings.fontSize] || settings.fontSize}
          </div>
        </div>
        <div className="card" style={{ cursor: 'default', marginBottom: 'var(--spacing-lg)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Layout size={20} />
            {t.settings.layoutWidth || 'Szerokość układu'}
          </h3>
          <input
            type="range"
            min={0}
            max={3}
            value={['narrow','medium','wide','full'].indexOf(settings.layoutWidth)}
            onChange={e => {
              const idx = parseInt(e.target.value, 10);
              updateSetting('layoutWidth', ['narrow','medium','wide','full'][idx]);
            }}
            style={{ width: '100%' }}
          />
          <div style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '1.2em' }}>
            {t.settings[settings.layoutWidth] || settings.layoutWidth}
          </div>
        </div>
    const currentFonts = settings.customFonts || [];
    if (currentFonts.includes(font)) {
      alert('Ta czcionka jest już dodana!');
      return;
    }
    
    // Load Google Font dynamically
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    const newCustomFonts = [...currentFonts, font];
    updateSetting('customFonts', newCustomFonts);
    setNewFont('');
  };

  const handleRemoveCustomFont = (font: string) => {
    const currentFonts = settings.customFonts || [];
    const newCustomFonts = currentFonts.filter(f => f !== font);
    updateSetting('customFonts', newCustomFonts);
    
    // If this was the selected font, reset to default
    if (settings.selectedCustomFont === font) {
      updateSetting('selectedCustomFont', undefined);
      document.body.style.fontFamily = '';
    }
  };

  const handleSelectCustomFont = (font: string | undefined) => {
    updateSetting('selectedCustomFont', font);
    if (font) {
      document.body.style.fontFamily = `"${font}", ${settings.fontFamily}`;
    } else {
      document.body.style.fontFamily = '';
    }
  };

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
            {t.settings.customFonts || 'Niestandardowe czcionki (Google Fonts)'}
          </h3>
          <form onSubmit={e => { e.preventDefault(); if (newFont.trim()) { handleAddCustomFont(newFont.trim()); } }} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="text"
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
            {(settings.customFonts || []).map(font => (
              <div key={font} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: `'${font}', ${settings.fontFamily}` }}>
                <input
                  type="radio"
                  checked={settings.selectedCustomFont === font}
                  onChange={() => handleSelectCustomFont(font)}
                  name="customFontSelect"
                  style={{ accentColor: 'var(--accent-color)' }}
                />
                <span>{font}</span>
                <button onClick={() => handleRemoveCustomFont(font)} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', marginLeft: 'auto' }} title={t.settings.removeFont || 'Usuń czcionkę'}>
                  <X size={16} />
                </button>
              </div>
            ))}
            {settings.selectedCustomFont && (
              <button onClick={() => handleSelectCustomFont(undefined)} className="button button-secondary" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>
                {t.settings.resetFont || 'Przywróć domyślną czcionkę'}
              </button>
            )}
          </div>
        </div>
        {/* Theme */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Palette size={20} />
            {t.settings.theme}
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
            gap: 'var(--spacing-sm)'
          }}>
            <button
              className={`button ${settings.theme === 'light' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('theme', 'light')}
            >
              {t.themes.light}
            </button>
            <button
              className={`button ${settings.theme === 'dark' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('theme', 'dark')}
            >
              {t.themes.dark}
            </button>
            <button
              className={`button ${settings.theme === 'sepia' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('theme', 'sepia')}
            >
              {t.themes.sepia}
            </button>
            <button
              className={`button ${settings.theme === 'midnight' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('theme', 'midnight')}
            >
              {t.themes.midnight}
            </button>
            <button
              className={`button ${settings.theme === 'forest' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('theme', 'forest')}
            >
              {t.themes.forest}
            </button>
            <button
              className={`button ${settings.theme === 'ocean' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('theme', 'ocean')}
            >
              {t.themes.ocean}
            </button>
            <button
              className={`button ${settings.theme === 'rose' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('theme', 'rose')}
            >
              {t.themes.rose}
            </button>
          </div>
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

        {/* Font Size */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Type size={20} />
            {t.accessibility.fontSize}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div className="slider-current-value">
              {settings.fontSize === 'small' ? t.accessibility.small : 
               settings.fontSize === 'medium' ? t.accessibility.medium : 
               settings.fontSize === 'large' ? t.accessibility.large : 
               t.accessibility.xlarge}
            </div>
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
              style={{ width: '100%' }}
            />
            <div className="slider-labels" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>A</span>
              <span style={{ fontSize: '1.1rem', opacity: 0.8 }}>A</span>
              <span style={{ fontSize: '1.35rem', opacity: 0.9 }}>A</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 600 }}>A</span>
            </div>
          </div>
        </div>

        {/* Layout Width */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Maximize size={20} />
            {t.settings.layoutWidth}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div className="slider-current-value">
              {settings.layoutWidth === 'narrow' ? `${t.settings.narrow} (600px)` : 
               settings.layoutWidth === 'medium' ? `${t.settings.medium} (900px)` : 
               settings.layoutWidth === 'wide' ? `${t.settings.wide} (1200px)` : 
               `${t.settings.full} (100%)`}
            </div>
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
              style={{ width: '100%' }}
            />
            <div className="slider-labels" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ width: 40, textAlign: 'center', fontSize: '0.9rem', opacity: 0.7 }}>{t.settings.narrow}</span>
              <span style={{ width: 60, textAlign: 'center', fontSize: '1.1rem', opacity: 0.8 }}>{t.settings.medium}</span>
              <span style={{ width: 80, textAlign: 'center', fontSize: '1.25rem', opacity: 0.9 }}>{t.settings.wide}</span>
              <span style={{ width: 100, textAlign: 'center', fontSize: '1.35rem', fontWeight: 600 }}>{t.settings.full}</span>
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
              onClick={() => downloadBackup()}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--spacing-md)', gap: '0.5rem' }}
            >
              <Save size={24} />
              <span style={{ fontSize: '0.75rem' }}>{t.settings.downloadBackup || 'Pobierz kopię'}</span>
            </button>
            <button 
              className="button button-secondary" 
              onClick={handleExport}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--spacing-md)', gap: '0.5rem' }}
            >
              <Download size={24} />
              <span style={{ fontSize: '0.75rem' }}>{t.settings.export}</span>
            </button>
            <button 
              className="button button-secondary" 
              onClick={handleImport}
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

        {/* Custom Google Fonts */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Type size={20} />
            Niestandardowe czcionki Google
          </h3>
          
          <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-md)' }}>
            Dodaj czcionki z Google Fonts (np. "Roboto", "Playfair Display", "Lora")
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: 'var(--spacing-md)' }}>
            <input
              type="text"
              className="input"
              value={newFont}
              onChange={(e) => setNewFont(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomFont()}
              placeholder="Nazwa czcionki Google..."
              style={{ flex: 1 }}
            />
            <button 
              className="button button-primary"
              onClick={handleAddCustomFont}
              disabled={!newFont.trim()}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus size={18} />
              Dodaj
            </button>
          </div>

          {(settings.customFonts || []).length > 0 && (
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                Dostępne czcionki:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
                <button
                  className={`button ${!settings.selectedCustomFont ? 'button-primary' : 'button-secondary'}`}
                  onClick={() => handleSelectCustomFont(undefined)}
                  style={{ fontSize: '0.875rem' }}
                >
                  Domyślna
                </button>
                {(settings.customFonts || []).map(font => (
                  <div key={font} style={{ position: 'relative' }}>
                    <button
                      className={`button ${settings.selectedCustomFont === font ? 'button-primary' : 'button-secondary'}`}
                      onClick={() => handleSelectCustomFont(font)}
                      style={{ width: '100%', fontSize: '0.875rem', fontFamily: `"${font}", ${settings.fontFamily}` }}
                    >
                      {font}
                    </button>
                    <button
                      onClick={() => handleRemoveCustomFont(font)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: 'var(--accent-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                      }}
                      title="Usuń"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Custom Moods */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Smile size={20} />
            {t.settings.customMoods || 'Niestandardowe nastroje'}
          </h3>
          
          <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-md)' }}>
            {t.settings.defaultMoodsNote || 'Domyślne nastroje'}: {DEFAULT_MOODS.map(m => t.mood[m]).join(', ')}
          </p>

          <div style={{ 
            background: 'var(--bg-secondary)', 
            borderRadius: 'var(--radius-md)', 
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-md)',
            border: '1px solid var(--border-color)'
          }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
              💡 {settings.language === 'pl' 
                ? 'Możesz dodawać niestandardowe nastroje bezpośrednio podczas edycji wiersza, klikając ikonę nastroju.' 
                : 'You can add custom moods directly while editing a poem by clicking the mood icon.'}
            </p>
          </div>

          {(settings.customMoods || []).length > 0 && (
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                {t.settings.yourMoods || 'Twoje nastroje'}:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(settings.customMoods || []).map(mood => (
                  <div
                    key={mood}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      background: 'var(--accent-color)',
                      color: 'white',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.875rem',
                    }}
                  >
                    <span>{mood}</span>
                    <button
                      onClick={() => handleRemoveCustomMood(mood)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title={settings.language === 'pl' ? 'Usuń' : 'Remove'}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {(settings.customMoods || []).length === 0 && (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              {settings.language === 'pl' 
                ? 'Nie masz jeszcze żadnych niestandardowych nastrojów.' 
                : 'You don\'t have any custom moods yet.'}
            </p>
          )}
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
  );
};

export default SettingsScreen;
