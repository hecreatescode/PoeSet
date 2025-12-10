import React, { useState } from 'react';
import { X, Edit, Trash2, Share2, History, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import type { Poem } from '../../types';
import { deletePoem, savePoem, getSettings } from '../../utils/storage';
import PoemEditor from '../PoemEditor/PoemEditor';
import Modal from '../Modal/Modal';
import { useLanguage } from '../../i18n/useLanguage';
import { MarkdownParser } from '../../utils/markdown';

interface PoemViewerProps {
  poem: Poem;
  onClose: () => void;
  onUpdate: () => void;
}

const PoemViewer: React.FC<PoemViewerProps> = ({ poem, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showUI, setShowUI] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const { t } = useLanguage();
  const settings = getSettings();

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deletePoem(poem.id);
    onUpdate();
    onClose();
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

  const handleDuplicate = () => {
    const now = new Date().toISOString();
    const duplicatedPoem: Poem = {
      ...poem,
      id: `poem_${Date.now()}`,
      title: `${poem.title} (kopia)`,
      createdAt: now,
      updatedAt: now,
      date: now,
      versions: undefined,
    };
    
    savePoem(duplicatedPoem);
    onUpdate();
    alert('Wiersz zduplikowany!');
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
            {poem.versions && poem.versions.length > 0 && (
              <button 
                className="button button-secondary"
                onClick={(e) => { e.stopPropagation(); setShowVersionHistory(!showVersionHistory); }}
                style={{ padding: '0.5rem' }}
                title={t.viewer.versionHistory}
              >
                <History size={20} />
              </button>
            )}
            <button 
              className="button button-secondary"
              onClick={(e) => { e.stopPropagation(); handleShare(); }}
              style={{ padding: '0.5rem' }}
            >
              <Share2 size={20} />
            </button>
            <button 
              className="button button-secondary"
              onClick={(e) => { e.stopPropagation(); handleDuplicate(); }}
              style={{ padding: '0.5rem' }}
              title="Duplikuj wiersz"
            >
              <Copy size={20} />
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
        
        {settings.enableMarkdown ? (
          <div 
            className="font-serif markdown-preview" 
            style={{ 
              fontSize: '1.125rem',
              lineHeight: 1.8,
              marginBottom: 'var(--spacing-xl)',
            }}
            dangerouslySetInnerHTML={{ __html: MarkdownParser.parse(poem.content) }}
          />
        ) : (
          <p className="font-serif" style={{ 
            fontSize: '1.125rem',
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
            marginBottom: 'var(--spacing-xl)',
          }}>
            {poem.content}
          </p>
        )}

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

      {/* Version History Panel */}
      {showVersionHistory && poem.versions && poem.versions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--bg-primary)',
          zIndex: 10,
          overflowY: 'auto',
          padding: 'var(--spacing-lg)',
        }}>
          <div style={{ 
            maxWidth: '800px', 
            margin: '0 auto',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--spacing-lg)',
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 300 }}>
                {t.viewer.versionHistory}
              </h2>
              <button
                className="button button-secondary"
                onClick={() => setShowVersionHistory(false)}
                style={{ padding: '0.5rem' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {/* Current version */}
              <div style={{
                padding: 'var(--spacing-md)',
                border: '2px solid var(--primary)',
                borderRadius: '0.5rem',
                background: 'var(--bg-secondary)',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--spacing-sm)',
                }}>
                  <div>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: 600,
                      color: 'var(--primary)',
                    }}>
                      {t.viewer.currentVersion}
                    </span>
                    <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.25rem' }}>
                      {format(new Date(poem.updatedAt), 'd MMM yyyy, HH:mm', { locale: pl })}
                    </p>
                  </div>
                </div>
                <p style={{ 
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                }}>
                  {poem.content}
                </p>
              </div>

              {/* Previous versions */}
              {poem.versions.map((version, index) => (
                <div 
                  key={version.id}
                  style={{
                    padding: 'var(--spacing-md)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.5rem',
                    background: 'var(--bg-secondary)',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--spacing-sm)',
                  }}>
                    <div>
                      <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                        {t.viewer.version} {poem.versions!.length - index}
                      </span>
                      <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.25rem' }}>
                        {format(new Date(version.timestamp), 'd MMM yyyy, HH:mm', { locale: pl })}
                      </p>
                    </div>
                    <button
                      className="button button-secondary"
                      onClick={() => {
                        const updatedPoem = {
                          ...poem,
                          content: version.content,
                          updatedAt: new Date().toISOString(),
                        };
                        savePoem(updatedPoem);
                        onUpdate();
                        setShowVersionHistory(false);
                      }}
                      style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
                    >
                      {t.viewer.restore}
                    </button>
                  </div>
                  <p style={{ 
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6,
                  }}>
                    {version.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t.editor.deletePoem || 'Usuń wiersz'}
        footer={
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end' }}>
            <button 
              className="button button-secondary" 
              onClick={() => setShowDeleteModal(false)}
            >
              {t.editor.cancel || 'Anuluj'}
            </button>
            <button 
              className="button button-primary" 
              onClick={confirmDelete}
              style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }}
            >
              {t.editor.delete || 'Usuń'}
            </button>
          </div>
        }
      >
        <p>{t.editor.deleteConfirm || 'Czy na pewno chcesz usunąć ten wiersz? Ta operacja jest nieodwracalna.'}</p>
      </Modal>
    </div>
  );
};

export default PoemViewer;
