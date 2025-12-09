import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import type { Poem } from '../../types';
import { getPoems } from '../../utils/storage';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import PoemViewer from '../PoemViewer/PoemViewer';

const PoemsScreen: React.FC = () => {
  const [poems, setPoems] = useState<Poem[]>(() => getPoems());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');

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
  }, [poems, searchQuery, sortBy]);

  const handlePoemUpdated = () => {
    const allPoems = getPoems();
    setPoems(allPoems);
    setSelectedPoem(null);
  };

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <header style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 300 }}>
          Wiersze
        </h1>
        <p className="text-secondary">Twoja biblioteka twórczości</p>
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
            type="text"
            className="input"
            placeholder="Szukaj wierszy..."
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
            Najnowsze
          </button>
          <button 
            className={`button ${sortBy === 'oldest' ? 'button-primary' : 'button-secondary'}`}
            onClick={() => setSortBy('oldest')}
            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
          >
            Najstarsze
          </button>
          <button 
            className={`button ${sortBy === 'alphabetical' ? 'button-primary' : 'button-secondary'}`}
            onClick={() => setSortBy('alphabetical')}
            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
          >
            Alfabetycznie
          </button>
        </div>
      </div>

      {/* Poems list */}
      {filteredPoems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p className="text-secondary">
            {searchQuery ? 'Nie znaleziono wierszy.' : 'Nie masz jeszcze żadnych wierszy.'}
          </p>
        </div>
      ) : (
        <>
          <p className="text-secondary mb-md" style={{ fontSize: '0.875rem' }}>
            {filteredPoems.length} {filteredPoems.length === 1 ? 'wiersz' : 'wierszy'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {filteredPoems.map(poem => (
              <div 
                key={poem.id} 
                className="card"
                onClick={() => setSelectedPoem(poem)}
              >
                <h3 style={{ marginBottom: '0.5rem', fontWeight: 500 }}>
                  {poem.title || 'Bez tytułu'}
                </h3>
                <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {format(new Date(poem.date), 'd MMMM yyyy', { locale: pl })}
                </p>
                <p style={{ 
                  whiteSpace: 'pre-wrap', 
                  lineHeight: 1.6,
                  maxHeight: '100px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {poem.content}
                </p>
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
            ))}
          </div>
        </>
      )}

      {selectedPoem && (
        <PoemViewer
          poem={selectedPoem}
          onClose={() => setSelectedPoem(null)}
          onUpdate={handlePoemUpdated}
        />
      )}
    </div>
  );
};

export default PoemsScreen;
