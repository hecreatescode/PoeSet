import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Tag, Calendar } from 'lucide-react';
import type { Poem } from '../../types';
import { savePoem } from '../../utils/storage';

interface PoemEditorProps {
  poem?: Poem;
  onSave: (poem: Poem) => void;
  onClose: () => void;
  initialDate?: string;
}

const PoemEditor: React.FC<PoemEditorProps> = ({ poem, onSave, onClose, initialDate }) => {
  const [title, setTitle] = useState(poem?.title || '');
  const [content, setContent] = useState(poem?.content || '');
  const [tags, setTags] = useState<string[]>(poem?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [date, setDate] = useState(poem?.date.split('T')[0] || initialDate || new Date().toISOString().split('T')[0]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const autoSaveTimerRef = useRef<number | null>(null);

  // Auto-save funkcja co 3 sekundy
  useEffect(() => {
    if (!content.trim()) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = window.setTimeout(() => {
      const now = new Date().toISOString();
      const poemData: Poem = {
        id: poem?.id || `poem_${Date.now()}`,
        title: title.trim() || 'Bez tytułu',
        content: content.trim(),
        date: `${date}T${new Date().toISOString().split('T')[1]}`,
        tags,
        collectionIds: poem?.collectionIds || [],
        createdAt: poem?.createdAt || now,
        updatedAt: now,
      };
      savePoem(poemData);
      setAutoSaved(true);
      setTimeout(() => setAutoSaved(false), 2000);
    }, 3000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [title, content, tags, date, poem]);

  const handleSave = () => {
    if (!content.trim()) return;

    const now = new Date().toISOString();
    const poemData: Poem = {
      id: poem?.id || `poem_${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      date: `${date}T${new Date().toISOString().split('T')[1]}`,
      tags,
      collectionIds: poem?.collectionIds || [],
      createdAt: poem?.createdAt || now,
      updatedAt: now,
    };

    savePoem(poemData);
    onSave(poemData);
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div style={{
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
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {autoSaved && (
            <span style={{ 
              fontSize: '0.75rem', 
              color: 'var(--text-secondary)',
              marginRight: '0.5rem'
            }}>
              ✓ Zapisano
            </span>
          )}
          <button 
            className="button button-secondary"
            onClick={() => setShowTagInput(!showTagInput)}
            style={{ padding: '0.5rem' }}
          >
            <Tag size={20} />
          </button>
          <button 
            className="button button-secondary"
            onClick={() => setShowDatePicker(!showDatePicker)}
            style={{ padding: '0.5rem' }}
          >
            <Calendar size={20} />
          </button>
          <button 
            className="button button-primary"
            onClick={handleSave}
            disabled={!content.trim()}
          >
            <Save size={20} />
            Zapisz
          </button>
        </div>
      </div>

      {/* Tag Input */}
      {showTagInput && (
        <div style={{
          padding: 'var(--spacing-md)',
          borderBottom: '1px solid var(--light-border)',
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              className="input"
              placeholder="Dodaj tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              style={{ padding: '0.5rem', flex: 1 }}
            />
            <button 
              className="button button-primary"
              onClick={handleAddTag}
            >
              Dodaj
            </button>
          </div>
          {tags.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {tags.map(tag => (
                <span 
                  key={tag}
                  style={{
                    fontSize: '0.875rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--light-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag} <X size={14} />
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Date Picker */}
      {showDatePicker && (
        <div style={{
          padding: 'var(--spacing-md)',
          borderBottom: '1px solid var(--light-border)',
        }}>
          <input
            type="date"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ padding: '0.5rem' }}
          />
        </div>
      )}

      {/* Editor */}
      <div style={{
        flex: 1,
        padding: 'var(--spacing-xl)',
        overflow: 'auto',
      }}>
        <input
          type="text"
          className="input font-serif"
          placeholder="Tytuł (opcjonalny)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            fontSize: '1.5rem',
            fontWeight: 500,
            marginBottom: 'var(--spacing-lg)',
            border: 'none',
            padding: '0',
          }}
        />
        <textarea
          className="input textarea font-serif"
          placeholder="Zacznij pisać wiersz..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            border: 'none',
            padding: '0',
            fontSize: '1.125rem',
            lineHeight: 1.8,
            minHeight: '400px',
          }}
          autoFocus
        />
      </div>
    </div>
  );
};

export default PoemEditor;
