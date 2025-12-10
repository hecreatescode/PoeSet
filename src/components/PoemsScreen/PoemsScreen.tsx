import React, { useState, useMemo, useRef } from 'react';
import { Search, Filter, CheckSquare, Trash2, FolderPlus } from 'lucide-react';
import type { Poem, MoodType } from '../../types';
import { getPoems, deletePoem, addPoemToCollection, getCollections, getSettings } from '../../utils/storage';
import { format } from 'date-fns';
import { pl, enUS } from 'date-fns/locale';
import PoemViewer from '../PoemViewer/PoemViewer';
import { useLanguage } from '../../i18n/useLanguage';
import Tooltip from '../Tooltip/Tooltip';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { MarkdownParser } from '../../utils/markdown';

const POEMS_PER_PAGE = 20;

const PoemsScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const dateLocale = language === 'pl' ? pl : enUS;
  const [poems, setPoems] = useState<Poem[]>(() => getPoems());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  const settings = getSettings();
  const [displayCount, setDisplayCount] = useState(POEMS_PER_PAGE);
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [minLength, setMinLength] = useState('');
  const [maxLength, setMaxLength] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodType | ''>('');
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedPoemIds, setSelectedPoemIds] = useState<Set<string>>(new Set());
  const [showBulkCollectionDialog, setShowBulkCollectionDialog] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'f',
      ctrlKey: true,
      callback: () => searchInputRef.current?.focus(),
      description: 'Search (Ctrl+F)',
    },
    {
      key: 'Escape',
      callback: () => selectedPoem && setSelectedPoem(null),
      description: 'Close (Esc)',
    },
  ]);

  const filteredPoems = useMemo(() => {
    let filtered = [...poems];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(p => p.date >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(p => p.date <= dateTo + 'T23:59:59');
    }

    // Length filter
    if (minLength) {
      filtered = filtered.filter(p => p.content.length >= parseInt(minLength));
    }
    if (maxLength) {
      filtered = filtered.filter(p => p.content.length <= parseInt(maxLength));
    }

    // Mood filter
    if (selectedMood) {
      filtered = filtered.filter(p => p.mood === selectedMood);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [poems, searchQuery, sortBy, dateFrom, dateTo, minLength, maxLength, selectedMood]);

  const displayedPoems = useMemo(() => 
    filteredPoems.slice(0, displayCount),
    [filteredPoems, displayCount]
  );

  const hasMore = displayCount < filteredPoems.length;

  const handlePoemUpdated = () => {
    const allPoems = getPoems();
    setPoems(allPoems);
    setSelectedPoem(null);
  };

  const handleToggleBulkMode = () => {
    setBulkMode(!bulkMode);
    setSelectedPoemIds(new Set());
  };

  const handleTogglePoemSelection = (poemId: string) => {
    const newSelection = new Set(selectedPoemIds);
    if (newSelection.has(poemId)) {
      newSelection.delete(poemId);
    } else {
      newSelection.add(poemId);
    }
    setSelectedPoemIds(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedPoemIds.size === displayedPoems.length) {
      setSelectedPoemIds(new Set());
    } else {
      setSelectedPoemIds(new Set(displayedPoems.map(p => p.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedPoemIds.size === 0) return;
    
    const count = selectedPoemIds.size;
    if (confirm(`Czy na pewno chcesz usunąć ${count} ${count === 1 ? 'wiersz' : 'wierszy'}?`)) {
      selectedPoemIds.forEach(id => deletePoem(id));
      const allPoems = getPoems();
      setPoems(allPoems);
      setSelectedPoemIds(new Set());
      setBulkMode(false);
    }
  };

  const handleBulkAddToCollection = (collectionId: string) => {
    selectedPoemIds.forEach(poemId => {
      addPoemToCollection(poemId, collectionId);
    });
    const allPoems = getPoems();
    setPoems(allPoems);
    setSelectedPoemIds(new Set());
    setShowBulkCollectionDialog(false);
    setBulkMode(false);
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + POEMS_PER_PAGE);
  };

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <header style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 300 }}>
            {t.poems.title}
          </h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {bulkMode && selectedPoemIds.size > 0 && (
              <>
                <button
                  className="button button-secondary"
                  onClick={() => setShowBulkCollectionDialog(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <FolderPlus size={18} />
                  Dodaj do kolekcji ({selectedPoemIds.size})
                </button>
                <button
                  className="button button-secondary"
                  onClick={handleBulkDelete}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}
                >
                  <Trash2 size={18} />
                  Usuń ({selectedPoemIds.size})
                </button>
              </>
            )}
            <button
              className={`button ${bulkMode ? 'button-primary' : 'button-secondary'}`}
              onClick={handleToggleBulkMode}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <CheckSquare size={18} />
              {bulkMode ? 'Anuluj' : 'Zaznacz'}
            </button>
          </div>
        </div>
        <p className="text-secondary">{t.poems.subtitle}</p>
      </header>

      {/* Search and filters */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div style={{ position: 'relative', marginBottom: 'var(--spacing-md)' }}>
          <Search 
            size={20} 
            style={{ 
              position: 'absolute', 
              left: '1rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              opacity: 0.5 
            }} 
          />
          <input
            ref={searchInputRef}
            type="text"
            className="input"
            placeholder={t.poems.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '3rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className={`button ${sortBy === 'newest' ? 'button-primary' : 'button-secondary'}`}
            onClick={() => setSortBy('newest')}
            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
          >
            {t.poems.newest}
          </button>
          <button 
            className={`button ${sortBy === 'oldest' ? 'button-primary' : 'button-secondary'}`}
            onClick={() => setSortBy('oldest')}
            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
          >
            {t.poems.oldest}
          </button>
          <button 
            className={`button ${sortBy === 'alphabetical' ? 'button-primary' : 'button-secondary'}`}
            onClick={() => setSortBy('alphabetical')}
            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
          >
            {t.poems.alphabetical}
          </button>
          <button 
            className={`button button-secondary`}
            onClick={() => setShowFilters(!showFilters)}
            style={{ 
              fontSize: '0.875rem', 
              padding: '0.5rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Filter size={16} />
            {t.poems.filters}
          </button>
        </div>

        {/* Advanced filters panel */}
        {showFilters && (
          <div style={{ 
            marginTop: 'var(--spacing-md)',
            padding: 'var(--spacing-md)',
            border: '1px solid var(--border-color)',
            borderRadius: '0.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-md)'
          }}>
            {/* Date range */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                marginBottom: '0.5rem',
                opacity: 0.7
              }}>
                {t.poems.dateFrom}
              </label>
              <input
                type="date"
                className="input"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                style={{ fontSize: '0.875rem' }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                marginBottom: '0.5rem',
                opacity: 0.7
              }}>
                {t.poems.dateTo}
              </label>
              <input
                type="date"
                className="input"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                style={{ fontSize: '0.875rem' }}
              />
            </div>

            {/* Length range */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                marginBottom: '0.5rem',
                opacity: 0.7
              }}>
                {t.poems.minLength}
              </label>
              <input
                type="number"
                className="input"
                placeholder="0"
                value={minLength}
                onChange={(e) => setMinLength(e.target.value)}
                style={{ fontSize: '0.875rem' }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                marginBottom: '0.5rem',
                opacity: 0.7
              }}>
                {t.poems.maxLength}
              </label>
              <input
                type="number"
                className="input"
                placeholder="∞"
                value={maxLength}
                onChange={(e) => setMaxLength(e.target.value)}
                style={{ fontSize: '0.875rem' }}
              />
            </div>

            {/* Mood selector */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                marginBottom: '0.5rem',
                opacity: 0.7
              }}>
                {t.poems.mood}
              </label>
              <select
                className="input"
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value as MoodType | '')}
                style={{ fontSize: '0.875rem' }}
              >
                <option value="">{t.poems.allMoods}</option>
                <option value="happy">{t.mood.happy}</option>
                <option value="sad">{t.mood.sad}</option>
                <option value="neutral">{t.mood.neutral}</option>
                <option value="inspired">{t.mood.inspired}</option>
                <option value="melancholic">{t.mood.melancholic}</option>
                <option value="excited">{t.mood.excited}</option>
                <option value="calm">{t.mood.calm}</option>
                <option value="anxious">{t.mood.anxious}</option>
              </select>
            </div>

            {/* Clear button */}
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                className="button button-secondary"
                onClick={() => {
                  setDateFrom('');
                  setDateTo('');
                  setMinLength('');
                  setMaxLength('');
                  setSelectedMood('');
                }}
                style={{ fontSize: '0.875rem', width: '100%' }}
              >
                {t.poems.clearFilters}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Poems list */}
      {filteredPoems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p className="text-secondary">
            {searchQuery ? t.poems.noResults : t.poems.noPoems}
          </p>
        </div>
      ) : (
        <>
          <p className="text-secondary mb-md" style={{ fontSize: '0.875rem' }}>
            {filteredPoems.length} {filteredPoems.length === 1 ? t.poems.countSingular : t.poems.count}
            {displayedPoems.length < filteredPoems.length && (
              <span> ({t.poems.shown} {displayedPoems.length})</span>
            )}
          </p>
          {bulkMode && displayedPoems.length > 0 && (
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedPoemIds.size === displayedPoems.length && displayedPoems.length > 0}
                  onChange={handleSelectAll}
                  style={{ width: '18px', height: '18px' }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                  Zaznacz wszystkie ({displayedPoems.length})
                </span>
              </label>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {displayedPoems.map(poem => (
              <Tooltip
                key={poem.id}
                content={
                  <div className="tooltip-content-preview">
                    <strong>{poem.title || t.editor.untitled}</strong>
                    <br />
                    {poem.content.substring(0, 200)}
                    {poem.content.length > 200 && '...'}
                  </div>
                }
                delay={800}
              >
                <div 
                  className="card"
                  onClick={() => !bulkMode && setSelectedPoem(poem)}
                  style={{ 
                    cursor: bulkMode ? 'default' : 'pointer',
                    display: 'flex',
                    gap: '1rem',
                  }}
                >
                  {bulkMode && (
                    <div style={{ paddingTop: '0.25rem' }}>
                      <input
                        type="checkbox"
                        checked={selectedPoemIds.has(poem.id)}
                        onChange={() => handleTogglePoemSelection(poem.id)}
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                      />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: '0.5rem', fontWeight: 500 }}>
                      {poem.title || t.editor.untitled}
                    </h3>
                  <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                    {format(new Date(poem.date), 'd MMMM yyyy', { locale: dateLocale })}
                  </p>
                {settings.enableMarkdown ? (
                  <div 
                    className="markdown-preview"
                    style={{ 
                      lineHeight: 1.6,
                      maxHeight: '100px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    dangerouslySetInnerHTML={{ __html: MarkdownParser.parse(poem.content.substring(0, 200) + (poem.content.length > 200 ? '...' : '')) }}
                  />
                ) : (
                  <p style={{ 
                    whiteSpace: 'pre-wrap', 
                    lineHeight: 1.6,
                    maxHeight: '100px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {poem.content}
                  </p>
                )}
                {poem.tags.length > 0 && (
                  <div style={{ 
                    marginTop: '1rem', 
                    display: 'flex', 
                    gap: '0.5rem', 
                    flexWrap: 'wrap' 
                  }}>
                    {poem.tags.slice(0, 3).map(tag => (
                      <span 
                        key={tag}
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--light-border)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    {poem.tags.length > 3 && (
                      <span 
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--light-border)',
                        }}
                      >
                        +{poem.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
                  </div>
                </div>
              </Tooltip>
            ))}
          </div>
          
          {hasMore && (
            <button 
              className="button button-secondary"
              onClick={handleLoadMore}
              style={{ 
                marginTop: 'var(--spacing-lg)', 
                width: '100%' 
              }}
            >
              {t.poems.loadMore} ({filteredPoems.length - displayCount} {t.poems.remaining})
            </button>
          )}
        </>
      )}

      {selectedPoem && (
        <PoemViewer
          poem={selectedPoem}
          onClose={() => setSelectedPoem(null)}
          onUpdate={handlePoemUpdated}
        />
      )}

      {/* Bulk Collection Dialog */}
      {showBulkCollectionDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'var(--bg-primary)',
            padding: '2rem',
            borderRadius: '1rem',
            maxWidth: '400px',
            width: '90%',
          }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>
              Dodaj do kolekcji
            </h2>
            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Wybierz kolekcję, do której chcesz dodać zaznaczone wiersze ({selectedPoemIds.size})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {getCollections().map(collection => (
                <button
                  key={collection.id}
                  className="button button-secondary"
                  onClick={() => handleBulkAddToCollection(collection.id)}
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                >
                  {collection.name}
                </button>
              ))}
            </div>
            <button
              className="button button-secondary"
              onClick={() => setShowBulkCollectionDialog(false)}
              style={{ width: '100%' }}
            >
              Anuluj
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoemsScreen;
