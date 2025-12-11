import React, { useState, useEffect } from 'react';
import { FileText, Download, Upload, Type, AlignLeft, Layout, Palette, Eye, Maximize, Languages, Smile, Plus, X, Save, HardDrive } from 'lucide-react';
import type { Settings } from '../../types';
import { getSettings, saveSettings, exportAllData, importAllData, downloadBackup, startAutoBackup, stopAutoBackup } from '../../utils/storage';
import { useLanguage } from '../../i18n/useLanguage';
import { DEFAULT_MOODS } from '../../types';

const SettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(getSettings());
  const { language, setLanguage, t } = useLanguage();
  const [newMood, setNewMood] = useState('');
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
    customFonts.forEach(font => {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}&display=swap`;
      link.rel = 'stylesheet';
      if (!document.querySelector(`link[href="${link.href}"]`)) {
        document.head.appendChild(link);
      }
    });
    
    // Apply selected custom font
    if (settings.selectedCustomFont) {
      document.body.style.fontFamily = `"${settings.selectedCustomFont}", ${settings.fontFamily}`;
    }
    
    // Handle auto-backup
    if (settings.autoBackup) {
      startAutoBackup(settings.autoBackupInterval || 30);
    } else {
      stopAutoBackup();
    }
    
    return () => {
      stopAutoBackup();
    };
  }, [settings, applySettings]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poeset-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target?.result as string;
          if (importAllData(data)) {
            alert('Dane zostały zaimportowane!');
            window.location.reload();
          } else {
            alert('Błąd importu danych.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleAddCustomMood = () => {
    const mood = newMood.trim();
    if (!mood) return;
    
    const currentMoods = settings.customMoods || [];
    if (currentMoods.includes(mood)) {
      alert('Ten nastrój już istnieje!');
      return;
    }
    
    const newCustomMoods = [...currentMoods, mood];
    updateSetting('customMoods', newCustomMoods);
    setNewMood('');
  };

  const handleRemoveCustomMood = (mood: string) => {
    const currentMoods = settings.customMoods || [];
    const newCustomMoods = currentMoods.filter(m => m !== mood);
    updateSetting('customMoods', newCustomMoods);
  };

  const handleAddCustomFont = () => {
    const font = newFont.trim();
    if (!font) return;
    
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
          
          <p style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>
            Standardowe:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
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

          <div style={{ marginTop: 'var(--spacing-md)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>
              Czcionki Google Fonts:
            </p>
            <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)' }}>
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
              <div>
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
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <button
              className={`button ${settings.fontSize === 'small' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('fontSize', 'small')}
            >
              {t.accessibility.small}
            </button>
            <button
              className={`button ${settings.fontSize === 'medium' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('fontSize', 'medium')}
            >
              {t.accessibility.medium}
            </button>
            <button
              className={`button ${settings.fontSize === 'large' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('fontSize', 'large')}
            >
              {t.accessibility.large}
            </button>
            <button
              className={`button ${settings.fontSize === 'xlarge' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('fontSize', 'xlarge')}
            >
              {t.accessibility.xlarge}
            </button>
          </div>
        </div>

        {/* Layout Width */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Maximize size={20} />
            {t.settings.layoutWidth}
          </h3>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <button
              className={`button ${settings.layoutWidth === 'narrow' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('layoutWidth', 'narrow')}
            >
              {t.settings.narrow}
            </button>
            <button
              className={`button ${settings.layoutWidth === 'medium' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('layoutWidth', 'medium')}
            >
              {t.accessibility.medium}
            </button>
            <button
              className={`button ${settings.layoutWidth === 'wide' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('layoutWidth', 'wide')}
            >
              {t.settings.wide}
            </button>
            <button
              className={`button ${settings.layoutWidth === 'full' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('layoutWidth', 'full')}
            >
              {t.settings.full}
            </button>
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
          
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer', marginBottom: 'var(--spacing-sm)' }}>
              <input
                type="checkbox"
                checked={settings.autoBackup || false}
                onChange={(e) => updateSetting('autoBackup', e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <span>Automatyczne kopie zapasowe</span>
            </label>
            
            {settings.autoBackup && (
              <div style={{ marginLeft: '26px', marginTop: '0.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                  Częstotliwość (minuty):
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={settings.autoBackupInterval || 30}
                  onChange={(e) => updateSetting('autoBackupInterval', parseInt(e.target.value) || 30)}
                  className="input"
                  style={{ width: '100px' }}
                />
              </div>
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 'var(--spacing-sm)' }}>
            <button className="button button-primary" onClick={() => downloadBackup()}>
              <Save size={18} />
              Pobierz kopię
            </button>
            <button className="button button-secondary" onClick={handleExport}>
              <Download size={18} />
              {t.settings.export}
            </button>
            <button className="button button-secondary" onClick={handleImport}>
              <Upload size={18} />
              {t.settings.import}
            </button>
          </div>

          <div style={{ marginTop: 'var(--spacing-md)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--border-color)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer', marginBottom: 'var(--spacing-sm)' }}>
              <input
                type="checkbox"
                checked={settings.useFileSystem || false}
                onChange={(e) => updateSetting('useFileSystem', e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <span>Zapisuj dane bezpośrednio na urządzeniu</span>
            </label>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginLeft: '26px' }}>
              📁 Używa File System Access API (wymaga nowoczesnej przeglądarki)
            </p>
          </div>
          
          <p style={{ marginTop: 'var(--spacing-sm)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            💾 {settings.useFileSystem ? 'Dane zapisywane bezpośrednio na dysku' : 'Dane zapisywane w przeglądarce (localStorage + IndexedDB)'}
          </p>
        </div>

        {/* Custom Moods */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Smile size={20} />
            Niestandardowe nastroje
          </h3>
          
          <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-md)' }}>
            Domyślne nastroje: {DEFAULT_MOODS.join(', ')}
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: 'var(--spacing-md)' }}>
            <input
              type="text"
              className="input"
              value={newMood}
              onChange={(e) => setNewMood(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomMood()}
              placeholder="Dodaj własny nastrój..."
              style={{ flex: 1 }}
            />
            <button 
              className="button button-primary"
              onClick={handleAddCustomMood}
              disabled={!newMood.trim()}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus size={18} />
              Dodaj
            </button>
          </div>

          {(settings.customMoods || []).length > 0 && (
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                Twoje nastroje:
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
                      title="Usuń"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
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
            {t.settings.version} 1.0.3
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
