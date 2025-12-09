import React, { useState } from 'react';
import { format } from 'date-fns';
import { pl, enUS } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import type { Poem } from '../../types';
import { getPoems, getJournalByDate, saveJournal } from '../../utils/storage';
import PoemEditor from '../PoemEditor/PoemEditor';
import { useLanguage } from '../../i18n/useLanguage';

const JournalScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');
  const dateLocale = language === 'pl' ? pl : enUS;

  const todayPoems = React.useMemo(() => {
    const allPoems = getPoems();
    return allPoems.filter(p => p.date.startsWith(today));
  }, [today]);

  const handlePoemSaved = (poem: Poem) => {
    const journal = getJournalByDate(today) || { date: today, poemIds: [] };
    if (!journal.poemIds.includes(poem.id)) {
      journal.poemIds.push(poem.id);
      saveJournal(journal);
    }
    
    setIsEditorOpen(false);
  };

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <header style={{ marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 300 }}>
          {format(new Date(), 'd MMMM yyyy', { locale: dateLocale })}
        </h1>
        <p className="text-secondary">{t.journal.subtitle}</p>
      </header>

      <button 
        className="button button-primary mb-lg"
        onClick={() => setIsEditorOpen(true)}
      >
        <Plus size={20} />
        {t.journal.newPoem}
      </button>

      {todayPoems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p className="text-secondary">
            {t.journal.noPoems}
          </p>
          <p className="text-secondary" style={{ marginTop: '0.5rem' }}>
            {t.journal.startWriting}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {todayPoems.map(poem => (
            <div key={poem.id} className="card">
              <h3 style={{ marginBottom: '0.5rem', fontWeight: 500 }}>
                {poem.title || t.editor.untitled}
              </h3>
              <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                {format(new Date(poem.createdAt), 'HH:mm')}
              </p>
              <p style={{ 
                whiteSpace: 'pre-wrap', 
                lineHeight: 1.6,
                maxHeight: '150px',
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
                  {poem.tags.map(tag => (
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
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isEditorOpen && (
        <PoemEditor
          onSave={handlePoemSaved}
          onClose={() => setIsEditorOpen(false)}
          initialDate={today}
        />
      )}
    </div>
  );
};

export default JournalScreen;
