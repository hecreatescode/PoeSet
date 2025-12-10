import React, { useState, useMemo } from 'react';
import { X, Edit, Trash2, Download } from 'lucide-react';
import type { Collection, Poem } from '../../types';
import { deleteCollection, getPoems } from '../../utils/storage';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import CollectionEditor from '../CollectionEditor/CollectionEditor';
import PoemViewer from '../PoemViewer/PoemViewer';
import Modal from '../Modal/Modal';
import { useLanguage } from '../../i18n/useLanguage';

interface CollectionViewerProps {
  collection: Collection;
  onClose: () => void;
  onUpdate: () => void;
}

const CollectionViewer: React.FC<CollectionViewerProps> = ({ collection, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { t } = useLanguage();

  const poems = useMemo(() => {
    const allPoems = getPoems();
    return allPoems.filter(p => collection.poemIds.includes(p.id));
  }, [collection.poemIds]);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteCollection(collection.id);
    onUpdate();
    onClose();
  };
  const handleExport = () => {
    const text = `${collection.name}\n${collection.description ? collection.description + '\n' : ''}\n${'='.repeat(50)}\n\n` +
      poems.map(p => `${p.title || 'Bez tytułu'}\n\n${p.content}\n\n${format(new Date(p.date), 'd MMMM yyyy', { locale: pl })}\n\n${'---'}\n\n`).join('');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${collection.name}.txt`;
    a.click();
  };

  const handleCollectionUpdated = () => {
    setIsEditing(false);
    onUpdate();
  };

  const handlePoemUpdated = () => {
    onUpdate();
    setSelectedPoem(null);
  };

  if (isEditing) {
    return (
      <CollectionEditor
        collection={collection}
        onSave={handleCollectionUpdated}
        onClose={() => setIsEditing(false)}
      />
    );
  }

  if (selectedPoem) {
    return (
      <PoemViewer
        poem={selectedPoem}
        onClose={() => setSelectedPoem(null)}
        onUpdate={handlePoemUpdated}
      />
    );
  }

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
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="button button-secondary"
            onClick={handleExport}
            style={{ padding: '0.5rem' }}
          >
            <Download size={20} />
          </button>
          <button 
            className="button button-secondary"
            onClick={() => setIsEditing(true)}
            style={{ padding: '0.5rem' }}
          >
            <Edit size={20} />
          </button>
          <button 
            className="button button-secondary"
            onClick={handleDelete}
            style={{ padding: '0.5rem', color: '#dc2626' }}
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: 'var(--spacing-xl)',
        overflow: 'auto',
      }}>
        <div style={{ 
          borderLeft: `4px solid ${collection.color}`,
          paddingLeft: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)',
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 400 }}>
            {collection.name}
          </h1>
          {collection.description && (
            <p className="text-secondary" style={{ fontSize: '1rem' }}>
              {collection.description}
            </p>
          )}
          <p className="text-secondary" style={{ fontSize: '0.875rem', marginTop: 'var(--spacing-md)' }}>
            {poems.length} {poems.length === 1 ? 'wiersz' : 'wierszy'}
          </p>
        </div>

        {poems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p className="text-secondary">
              Ten zbiór nie zawiera jeszcze żadnych wierszy.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {poems.map(poem => (
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t.collections.deleteCollection || 'Usuń zbiór'}
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
        <p>{t.collections.deleteConfirm || 'Czy na pewno chcesz usunąć ten zbiór? Wiersze w nim zawarte nie zostaną usunięte.'}</p>
      </Modal>
    </div>
  );
};

export default CollectionViewer;
