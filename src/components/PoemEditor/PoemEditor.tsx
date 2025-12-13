import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { X, Save, Tag, Calendar, Eye, EyeOff, Smile, Lock, Mic, MicOff, Bold, Italic, Underline, Plus, Palette } from 'lucide-react';
import type { Poem, MoodType, Theme } from '../../types';
import { DEFAULT_MOODS } from '../../types';
import { savePoem, getSettings, getPoems, saveSettings } from '../../utils/storage';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useLanguage } from '../../i18n/useLanguage';
import { MarkdownParser } from '../../utils/markdown';
import { EncryptionService } from '../../utils/encryption';

// Declare types for SpeechRecognition API
interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition: SpeechRecognitionConstructor;
    SpeechRecognition: SpeechRecognitionConstructor;
  }
}

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
  const [mood, setMood] = useState<MoodType | undefined>(poem?.mood);
  const [showTagInput, setShowTagInput] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [showAddMoodInput, setShowAddMoodInput] = useState(false);
  const [newMoodInput, setNewMoodInput] = useState('');
  const [autoSaved, setAutoSaved] = useState(false);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(poem?.isEncrypted || false);
  const [showEncryptDialog, setShowEncryptDialog] = useState(false);
  const [encryptionPassword, setEncryptionPassword] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const autoSaveTimerRef = useRef<number | null>(null);
  const poemIdRef = useRef<string>(poem?.id || '');
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const [settings, setSettingsState] = useState(getSettings());
  const { t } = useLanguage();
  const recognitionSupported = useMemo(() => 
    'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    []
  );

  // Funkcja dodawania niestandardowego nastroju
  const handleAddCustomMood = () => {
    const mood = newMoodInput.trim();
    if (!mood) return;
    
    const currentMoods = settings.customMoods || [];
    if (currentMoods.includes(mood) || DEFAULT_MOODS.includes(mood as typeof DEFAULT_MOODS[number])) {
      return;
    }
    
    const newCustomMoods = [...currentMoods, mood];
    const newSettings = { ...settings, customMoods: newCustomMoods };
    saveSettings(newSettings);
    setSettingsState(newSettings);
    setMood(mood);
    setNewMoodInput('');
    setShowAddMoodInput(false);
  };

  // Tag suggestions
  const tagSuggestions = useMemo(() => {
    if (!tagInput) return [];
    
    const allPoems = getPoems();
    const allTags = new Set<string>();
    
    allPoems.forEach(p => {
      p.tags.forEach(tag => allTags.add(tag));
    });

    return Array.from(allTags)
      .filter(tag => 
        tag.toLowerCase().includes(tagInput.toLowerCase()) && 
        !tags.includes(tag)
      )
      .slice(0, 5);
  }, [tagInput, tags]);

  // Initialize poemId if not provided
  useEffect(() => {
    if (!poemIdRef.current) {
      poemIdRef.current = `poem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  }, []);

  // Initialize Web Speech API
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window.webkitSpeechRecognition || window.SpeechRecognition) as SpeechRecognitionConstructor;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = settings.language === 'pl' ? 'pl-PL' : 'en-US';
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          }
        }
        
        if (finalTranscript) {
          setContent(prev => prev + finalTranscript);
        }
      };
      
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        if (isRecording) {
          recognition.start(); // Restart if still recording
        }
      };
      
      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [settings.language, isRecording]);

  const toggleRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  }, [isRecording]);

  // Auto-save funkcja co 3 sekundy
  useEffect(() => {
    if (!content.trim()) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = window.setTimeout(() => {
      const now = new Date().toISOString();
      const poemData: Poem = {
        id: poemIdRef.current,
        title: title.trim() || 'Bez tytułu',
        content: content.trim(),
        date: `${date}T${new Date().toISOString().split('T')[1]}`,
        tags,
        mood,
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
  }, [title, content, tags, mood, date, poem]);

  const handleSave = useCallback(() => {
    if (!content.trim()) return;
    const now = new Date().toISOString();
    const poemData: Poem = {
      id: poemIdRef.current,
      title: title.trim() || 'Bez tytułu',
      content: content.trim(),
      date: `${date}T${new Date().toISOString().split('T')[1]}`,
      tags,
      mood,
      collectionIds: poem?.collectionIds || [],
      createdAt: poem?.createdAt || now,
      updatedAt: now,
    };

    savePoem(poemData);
    onSave(poemData);
  }, [content, title, date, tags, mood, poem, onSave]);

  const handleAddTag = (tagToAdd?: string) => {
    const tag = (tagToAdd || tagInput).trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleFormatText = (formatType: 'bold' | 'italic' | 'underline') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    if (!selectedText) return;

    let formattedText = '';
    switch (formatType) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + formattedText.length);
    }, 0);
  };

  const handleEncrypt = async () => {
    if (!encryptionPassword.trim()) return;
    
    try {
      const encryptedContent = await EncryptionService.encrypt(content, encryptionPassword);
      setContent(encryptedContent);
      setIsEncrypted(true);
      setShowEncryptDialog(false);
      setEncryptionPassword('');
    } catch {
      alert('Błąd szyfrowania');
    }
  };

  const handleDecrypt = async () => {
    if (!encryptionPassword.trim()) return;
    
    try {
      const decryptedContent = await EncryptionService.decrypt(content, encryptionPassword);
      setContent(decryptedContent);
      setIsEncrypted(false);
      setShowEncryptDialog(false);
      setEncryptionPassword('');
    } catch {
      alert('Nieправидłowe hasło');
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 's',
      ctrlKey: true,
      callback: handleSave,
      description: 'Save (Ctrl+S)',
    },
    {
      key: 'Escape',
      callback: onClose,
      description: 'Close (Esc)',
    },
  ]);

  return (
    <div style={{
      position: 'fixed',
      background: 'var(--bg-primary)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      border: '2px solid var(--accent-color)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      borderRadius: '1.5rem',
      margin: '2vw',
      overflow: 'hidden',
      maxWidth: '700px',
      maxHeight: '95vh',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    }}>
      {/* Header */}
      <div style={{
        padding: 'var(--spacing-md)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--bg-secondary)',
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
          {settings.enableMarkdown && (
            <button 
              className="button button-secondary"
              onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
              style={{ padding: '0.5rem' }}
              title={showMarkdownPreview ? 'Ukryj podgląd' : 'Pokaż podgląd Markdown'}
            >
              {showMarkdownPreview ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
          {recognitionSupported && (
            <button 
              className={`button ${isRecording ? 'button-primary' : 'button-secondary'}`}
              onClick={toggleRecording}
              style={{ padding: '0.5rem' }}
              title={isRecording ? 'Zatrzymaj dyktowanie' : 'Rozpocznij dyktowanie'}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          )}
          <button 
            className="button button-secondary"
            onClick={() => setShowTagInput(!showTagInput)}
            style={{ padding: '0.5rem' }}
          >
            <Tag size={20} />
          </button>
          <button 
            className={`button ${isEncrypted ? 'button-primary' : 'button-secondary'}`}
            onClick={() => setShowEncryptDialog(true)}
            style={{ padding: '0.5rem' }}
            title={isEncrypted ? 'Wiersz zaszyfrowany' : 'Zaszyfruj wiersz'}
          >
            <Lock size={20} />
          </button>
          <button 
            className={`button ${showMoodPicker ? 'button-primary' : 'button-secondary'}`}
            onClick={() => setShowMoodPicker(!showMoodPicker)}
            style={{ padding: '0.5rem' }}
            title="Nastrój wiersza"
          >
            <Smile size={20} />
          </button>
          {/* Przycisk wyboru motywu usunięty */}
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
          position: 'relative',
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                className="input"
                placeholder="Dodaj tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                style={{ padding: '0.5rem', width: '100%' }}
              />
              
              {/* Tag suggestions dropdown */}
              {tagSuggestions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '0.25rem',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  zIndex: 1000,
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}>
                  {tagSuggestions.map(suggestion => (
                    <div
                      key={suggestion}
                      onClick={() => handleAddTag(suggestion)}
                      style={{
                        padding: '0.75rem',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--border-color)',
                        fontSize: '0.875rem',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--bg-secondary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button 
              className="button button-primary"
              onClick={() => handleAddTag()}
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

      {/* Mood Picker */}
      {showMoodPicker && (
        <div style={{
          padding: 'var(--spacing-md)',
          borderBottom: '1px solid var(--light-border)',
        }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            marginBottom: '0.5rem',
            opacity: 0.7
          }}>
            {t.filters.mood}
          </label>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '0.5rem' 
          }}>
            <button
              className={`button ${!mood ? 'button-primary' : 'button-secondary'}`}
              onClick={() => setMood(undefined)}
              style={{ fontSize: '0.875rem' }}
            >
              {t.poems.allMoods}
            </button>
            {DEFAULT_MOODS.map(moodType => (
              <button
                key={moodType}
                className={`button ${mood === moodType ? 'button-primary' : 'button-secondary'}`}
                onClick={() => setMood(moodType)}
                style={{ fontSize: '0.875rem' }}
              >
                {t.mood[moodType]}
              </button>
            ))}
            {(settings.customMoods || []).map(customMood => (
              <button
                key={customMood}
                className={`button ${mood === customMood ? 'button-primary' : 'button-secondary'}`}
                onClick={() => setMood(customMood)}
                style={{ fontSize: '0.875rem' }}
              >
                {customMood}
              </button>
            ))}
          </div>
          
          {/* Add custom mood section */}
          <div style={{ marginTop: 'var(--spacing-md)', borderTop: '1px solid var(--light-border)', paddingTop: 'var(--spacing-md)' }}>
            {!showAddMoodInput ? (
              <button
                className="button button-secondary"
                onClick={() => setShowAddMoodInput(true)}
                style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Plus size={16} />
                {t.editor?.addCustomMood || 'Dodaj własny nastrój'}
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="input"
                  value={newMoodInput}
                  onChange={(e) => setNewMoodInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomMood()}
                  placeholder={t.editor?.moodPlaceholder || 'Nazwa nastroju...'}
                  style={{ flex: 1, padding: '0.5rem' }}
                  autoFocus
                />
                <button
                  className="button button-primary"
                  onClick={handleAddCustomMood}
                  disabled={!newMoodInput.trim()}
                  style={{ padding: '0.5rem' }}
                >
                  <Plus size={18} />
                </button>
                <button
                  className="button button-secondary"
                  onClick={() => { setShowAddMoodInput(false); setNewMoodInput(''); }}
                  style={{ padding: '0.5rem' }}
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Picker motywu usunięty */}

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

      {/* Encryption Dialog */}
      {showEncryptDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
        onClick={() => setShowEncryptDialog(false)}
        >
          <div 
            style={{
              background: 'var(--bg-primary)',
              padding: 'var(--spacing-lg)',
              borderRadius: '0.5rem',
              maxWidth: '400px',
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>
              {isEncrypted ? 'Odszyfruj wiersz' : 'Zaszyfruj wiersz'}
            </h3>
            <input
              type="password"
              className="input"
              placeholder="Hasło"
              value={encryptionPassword}
              onChange={(e) => setEncryptionPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (isEncrypted ? handleDecrypt() : handleEncrypt())}
              style={{ marginBottom: 'var(--spacing-md)' }}
            />
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <button
                className="button button-primary"
                onClick={isEncrypted ? handleDecrypt : handleEncrypt}
                style={{ flex: 1 }}
              >
                {isEncrypted ? 'Odszyfruj' : 'Zaszyfruj'}
              </button>
              <button
                className="button button-secondary"
                onClick={() => {
                  setShowEncryptDialog(false);
                  setEncryptionPassword('');
                }}
                style={{ flex: 1 }}
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <div style={{
        flex: 1,
        padding: 'var(--spacing-xl)',
        overflow: 'auto',
        display: showMarkdownPreview && settings.enableMarkdown ? 'grid' : 'block',
        gridTemplateColumns: showMarkdownPreview && settings.enableMarkdown ? '1fr 1fr' : '1fr',
        gap: 'var(--spacing-lg)',
      }}>
        <div>
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
          
          {/* Formatting toolbar */}
          <div style={{
            display: 'flex',
            gap: '0.25rem',
            marginBottom: 'var(--spacing-md)',
            paddingBottom: 'var(--spacing-sm)',
            borderBottom: '1px solid var(--light-border)',
          }}>
            <button
              className="button button-secondary"
              onClick={() => handleFormatText('bold')}
              style={{ padding: '0.5rem', fontSize: '0.875rem' }}
              title="Pogrubienie (zaznacz tekst)"
            >
              <Bold size={16} />
            </button>
            <button
              className="button button-secondary"
              onClick={() => handleFormatText('italic')}
              style={{ padding: '0.5rem', fontSize: '0.875rem' }}
              title="Kursywa (zaznacz tekst)"
            >
              <Italic size={16} />
            </button>
            <button
              className="button button-secondary"
              onClick={() => handleFormatText('underline')}
              style={{ padding: '0.5rem', fontSize: '0.875rem' }}
              title="Podkreślenie (zaznacz tekst)"
            >
              <Underline size={16} />
            </button>
            <span style={{ 
              fontSize: '0.75rem', 
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              marginLeft: '0.5rem'
            }}>
              Zaznacz tekst i kliknij aby sformatować
            </span>
          </div>

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
        
        {showMarkdownPreview && settings.enableMarkdown && (
          <div style={{
            borderLeft: '2px solid var(--light-border)',
            paddingLeft: 'var(--spacing-lg)',
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 500, 
              marginBottom: 'var(--spacing-lg)',
              opacity: 0.7
            }}>
              {title || 'Bez tytułu'}
            </h3>
            <div 
              className="markdown-preview"
              style={{
                fontSize: '1.125rem',
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
              }}
              dangerouslySetInnerHTML={{ __html: MarkdownParser.parse(content) }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PoemEditor;
