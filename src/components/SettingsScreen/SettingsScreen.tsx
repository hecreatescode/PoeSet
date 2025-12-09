import React, { useState, useEffect } from 'react';
import { Sun, FileText, Download, Upload, Type, AlignLeft } from 'lucide-react';
import type { Settings } from '../../types';
import { getSettings, saveSettings, exportAllData, importAllData } from '../../utils/storage';

const SettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(getSettings());

  const applySettings = React.useCallback((newSettings: Settings) => {
    document.body.setAttribute('data-theme', newSettings.theme);
    document.body.classList.remove('font-serif', 'font-sans');
    document.body.classList.add(`font-${newSettings.fontFamily}`);
    document.body.classList.remove('line-spacing-compact', 'line-spacing-normal', 'line-spacing-relaxed');
    document.body.classList.add(`line-spacing-${newSettings.lineSpacing}`);
  }, []);

  useEffect(() => {
    applySettings(settings);
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

  return (
    <div>
      <header className="mb-xl">
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 300 }}>
          Ustawienia
        </h1>
        <p className="text-secondary">Personalizuj swoją aplikację</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        {/* Theme */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Sun size={20} />
            Motyw
          </h3>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <button
              className={`button ${settings.theme === 'light' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('theme', 'light')}
            >
              Jasny
            </button>
            <button
              className={`button ${settings.theme === 'dark' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('theme', 'dark')}
            >
              Ciemny
            </button>
            <button
              className={`button ${settings.theme === 'sepia' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('theme', 'sepia')}
            >
              Sepia
            </button>
          </div>
        </div>

        {/* Font family */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Type size={20} />
            Czcionka
          </h3>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <button
              className={`button ${settings.fontFamily === 'serif' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('fontFamily', 'serif')}
            >
              Serif
            </button>
            <button
              className={`button ${settings.fontFamily === 'sans-serif' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('fontFamily', 'sans-serif')}
            >
              Sans-serif
            </button>
          </div>
        </div>

        {/* Line spacing */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <AlignLeft size={20} />
            Odstępy między wersami
          </h3>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <button
              className={`button ${settings.lineSpacing === 'compact' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('lineSpacing', 'compact')}
            >
              Kompaktowe
            </button>
            <button
              className={`button ${settings.lineSpacing === 'normal' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('lineSpacing', 'normal')}
            >
              Normalne
            </button>
            <button
              className={`button ${settings.lineSpacing === 'relaxed' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('lineSpacing', 'relaxed')}
            >
              Przestronne
            </button>
          </div>
        </div>

        {/* Start view */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <FileText size={20} />
            Widok startowy
          </h3>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <button
              className={`button ${settings.startView === 'journal' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('startView', 'journal')}
            >
              Dziennik
            </button>
            <button
              className={`button ${settings.startView === 'poems' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => updateSetting('startView', 'poems')}
            >
              Wiersze
            </button>
          </div>
        </div>

        {/* Backup */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Download size={20} />
            Kopia zapasowa
          </h3>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <button className="button button-primary" onClick={handleExport}>
              <Download size={18} />
              Eksportuj dane
            </button>
            <button className="button button-secondary" onClick={handleImport}>
              <Upload size={18} />
              Importuj dane
            </button>
          </div>
        </div>

        {/* About */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500 }}>
            O aplikacji
          </h3>
          <p className="text-secondary" style={{ marginBottom: 'var(--spacing-sm)' }}>
            <strong>PoeSet</strong> - Twój cyfrowy dziennik poetycki
          </p>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
            Wersja 1.0.0
          </p>
          <p className="text-secondary" style={{ fontSize: '0.875rem', marginTop: 'var(--spacing-md)' }}>
            Stwórz, organizuj i analizuj swoją poezję w minimalistycznym, eleganckim środowisku.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
