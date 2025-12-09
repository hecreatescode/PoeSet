import React, { useState } from 'react';
import { X, Edit, Trash2, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import type { Poem } from '../../types';
import { deletePoem } from '../../utils/storage';
import PoemEditor from '../PoemEditor/PoemEditor';

interface PoemViewerProps {
  poem: Poem;
  onClose: () => void;
  onUpdate: () => void;
}

const PoemViewer: React.FC<PoemViewerProps> = ({ poem, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showUI, setShowUI] = useState(false);

  const handleDelete = () => {
    if (confirm('Czy na pewno chcesz usunąć ten wiersz?')) {
      deletePoem(poem.id);
      onUpdate();
      onClose();
    }
  };

  const handleShare = () => {
    const text = `${poem.title}\n\n${poem.content}\n\n${format(new Date(poem.date), 'd MMMM yyyy', { locale: pl })}`;
    
    if (navigator.share) {
      navigator.share({
        title: poem.title || 'Wiersz',
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Wiersz skopiowany do schowka!');
    }
  };

  const handlePoemUpdated = () => {
    setIsEditing(false);
    onUpdate();
  };

  if (isEditing) {
    return (
      <PoemEditor
        poem={poem}
        onSave={handlePoemUpdated}
        onClose={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'var(--light-bg)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={() => setShowUI(!showUI)}
    >
      {/* Header - shows on tap */}
      {showUI && (
        <div style={{
          padding: 'var(--spacing-md)',
          borderBottom: '1px solid var(--light-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--light-bg)',
        }}>
          <button 
            className="button button-secondary"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            style={{ padding: '0.5rem' }}
          >
            <X size={20} />
          </button>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="button button-secondary"
              onClick={(e) => { e.stopPropagation(); handleShare(); }}
              style={{ padding: '0.5rem' }}
            >
              <Share2 size={20} />
            </button>
            <button 
              className="button button-secondary"
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              style={{ padding: '0.5rem' }}
            >
              <Edit size={20} />
            </button>
            <button 
              className="button button-secondary"
              onClick={(e) => { e.stopPropagation(); handleDelete(); }}
              style={{ padding: '0.5rem', color: '#dc2626' }}
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Poem content */}
      <div style={{
        flex: 1,
        padding: 'var(--spacing-xl)',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        maxWidth: '700px',
        margin: '0 auto',
        width: '100%',
      }}>
        {poem.title && (
          <h1 className="font-serif" style={{ 
            fontSize: '2rem', 
            marginBottom: 'var(--spacing-lg)',
            fontWeight: 400,
            textAlign: 'center',
          }}>
            {poem.title}
          </h1>
        )}
        
        <p className="font-serif" style={{ 
          fontSize: '1.125rem',
          lineHeight: 1.8,
          whiteSpace: 'pre-wrap',
          marginBottom: 'var(--spacing-xl)',
        }}>
          {poem.content}
        </p>

        <div style={{ marginTop: 'auto' }}>
          <p className="text-secondary" style={{ 
            fontSize: '0.875rem',
            textAlign: 'center',
            marginBottom: 'var(--spacing-md)',
          }}>
            {format(new Date(poem.date), 'd MMMM yyyy', { locale: pl })}
          </p>

          {poem.tags.length > 0 && (
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              flexWrap: 'wrap',
              justifyContent: 'center',
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
      </div>
    </div>
  );
};

export default PoemViewer;
