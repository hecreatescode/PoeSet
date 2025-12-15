import React, { useState, useRef } from 'react';
import { X, Save } from 'lucide-react';
import type { Collection, Poem } from '../../types';
import { saveCollection, getPoems } from '../../utils/storage';
import './CollectionEditor.css';


interface CollectionEditorProps {
  collection?: Collection;
  onSave: () => void;
  onClose: () => void;
}

const COLORS = [
  '#2c2c2c', '#dc2626', '#ea580c', '#d97706', 
  '#65a30d', '#16a34a', '#0891b2', '#2563eb', 
  '#7c3aed', '#c026d3', '#db2777', '#8d6e63'
];

const CollectionEditor: React.FC<CollectionEditorProps> = ({ collection, onSave, onClose }) => {
  const [name, setName] = useState(collection?.name || '');
  const [description, setDescription] = useState(collection?.description || '');
  const [color, setColor] = useState(collection?.color || COLORS[0]);
  const [customColor, setCustomColor] = useState('');
  const [selectedPoemIds, setSelectedPoemIds] = useState<string[]>(collection?.poemIds || []);
  const [allPoems] = useState<Poem[]>(() => getPoems());
  const [coverImage, setCoverImage] = useState<string | undefined>(collection?.coverImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!name.trim()) return;
    const collectionData: Collection = {
      id: collection?.id || `collection_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      color: customColor || color,
      poemIds: selectedPoemIds,
      createdAt: collection?.createdAt || new Date().toISOString(),
      ...(coverImage ? { coverImage } : {}),
    };
    saveCollection(collectionData);
    onSave();
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCoverImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const togglePoem = (poemId: string) => {
    setSelectedPoemIds(prev => 
      prev.includes(poemId) 
        ? prev.filter(id => id !== poemId)
        : [...prev, poemId]
    );
  };

  return (
    <div className="collection-editor" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'var(--light-bg)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: 'var(--spacing-md)',
        borderBottom: '1px solid var(--light-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <button 
          className="button button-secondary"
          onClick={onClose}
          style={{ padding: '0.5rem' }}
        >
          <X size={20} />
        </button>
        <h2 style={{ fontWeight: 600, fontSize: '1.25rem', margin: 0 }}>Edytor kolekcji</h2>
        <button 
          className="button button-primary"
          onClick={handleSave}
          disabled={!name.trim()}
        >
          <Save size={20} />
          Zapisz
        </button>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        gap: '2rem',
        padding: 'var(--spacing-xl)',
        overflow: 'auto',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}>
        {/* Dane kolekcji */}
        <div style={{
          minWidth: 320,
          maxWidth: 400,
          background: 'var(--bg-primary)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
              Okładka zbioru
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleCoverChange}
              />
              <button
                type="button"
                className="button button-secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                {coverImage ? 'Zmień okładkę' : 'Dodaj okładkę'}
              </button>
              {coverImage && (
                <img src={coverImage} alt="Okładka" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--light-border)' }} />
              )}
            </div>
          </div>
          <div>
            <input
              type="text"
              className="input"
              placeholder="Nazwa zbioru"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: 'var(--spacing-md)' }}
            />
            <textarea
              className="input"
              placeholder="Opis (opcjonalny)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ minHeight: '100px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
              Kolor zbioru
            </label>
            <div className="color-picker">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`color-btn${color === c && !customColor ? ' selected' : ''}`}
                  onClick={() => { setColor(c); setCustomColor(''); }}
                  style={{ background: c }}
                  aria-label={`Wybierz kolor ${c}`}
                />
              ))}
              <input
                type="color"
                value={customColor || color}
                onChange={e => { setCustomColor(e.target.value); setColor(e.target.value); }}
                style={{ width: 44, height: 44, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 'var(--radius-md)' }}
                aria-label="Wybierz własny kolor"
              />
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Możesz wybrać jeden z predefiniowanych kolorów lub ustawić własny.
            </div>
          </div>
        </div>

        {/* Wybór wierszy */}
        <div className="poem-list" style={{
          flex: 1,
          minWidth: 320,
          maxWidth: 600,
          background: 'var(--bg-primary)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <label style={{ fontWeight: 500, fontSize: '1.1rem' }}>
              Wybierz wiersze ({selectedPoemIds.length})
            </label>
            {allPoems.length > 0 && (
              <button
                className="button button-secondary"
                type="button"
                onClick={() => {
                  if (selectedPoemIds.length === allPoems.length) {
                    setSelectedPoemIds([]);
                  } else {
                    setSelectedPoemIds(allPoems.map(p => p.id));
                  }
                }}
                style={{ fontSize: '0.9rem', padding: '0.25rem 1rem' }}
              >
                {selectedPoemIds.length === allPoems.length ? 'Odznacz wszystkie' : 'Zaznacz wszystkie'}
              </button>
            )}
          </div>
          {allPoems.length === 0 ? (
            <p className="text-secondary">Nie masz jeszcze żadnych wierszy.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {allPoems.map(poem => (
                <label 
                  key={poem.id}
                  className={selectedPoemIds.includes(poem.id) ? 'selected' : ''}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1rem',
                    border: '1px solid var(--light-border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'background 0.2s, box-shadow 0.2s',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedPoemIds.includes(poem.id)}
                    onChange={() => togglePoem(poem.id)}
                    style={{ width: '18px', height: '18px', marginTop: 2 }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 500, marginBottom: 4 }}>{poem.title || 'Bez tytułu'}</p>
                    <p className="text-secondary" style={{ fontSize: '0.9rem', margin: 0, opacity: 0.8 }}>
                      {poem.content.substring(0, 70)}{poem.content.length > 70 ? '...' : ''}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionEditor;
