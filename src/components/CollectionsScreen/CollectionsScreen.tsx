import React, { useState } from 'react';
import { Plus, Folder } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import type { Collection } from '../../types';
import { getCollections, saveCollection } from '../../utils/storage';
import CollectionEditor from '../CollectionEditor/CollectionEditor';
import CollectionViewer from '../CollectionViewer/CollectionViewer';
import { useLanguage } from '../../i18n/useLanguage';

const CollectionsScreen: React.FC = () => {
  const { t } = useLanguage();
  const [collections, setCollections] = useState<Collection[]>(getCollections());
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [viewingCollection, setViewingCollection] = useState<Collection | null>(null);

  const loadCollections = () => {
    const allCollections = getCollections();
    setCollections(allCollections);
  };

  const handleCollectionSaved = () => {
    loadCollections();
    setIsEditorOpen(false);
    setSelectedCollection(null);
  };

  const getPoemCount = (collectionId: string): number => {
    const collection = collections.find(c => c.id === collectionId);
    return collection?.poemIds.length || 0;
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(collections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property for each collection
    const updatedCollections = items.map((col, index) => {
      const updated = { ...col, order: index };
      saveCollection(updated);
      return updated;
    });

    setCollections(updatedCollections);
  };

  return (
    <div>
      <header className="mb-xl">
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 300 }}>
          {t.collections.title}
        </h1>
        <p className="text-secondary">{t.collections.subtitle}</p>
      </header>

      <button 
        className="button button-primary mb-lg"
        onClick={() => { setSelectedCollection(null); setIsEditorOpen(true); }}
      >
        <Plus size={20} />
        {t.collections.newCollection}
      </button>

      {collections.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <Folder size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
          <p className="text-secondary">
            {t.collections.noCollections}
          </p>
          <p className="text-secondary" style={{ marginTop: '0.5rem' }}>
            {t.collections.createFirst}
          </p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="collections">
            {(provided) => (
              <div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: 'var(--spacing-md)',
                }}
              >
                {collections.map((collection, index) => (
                  <Draggable key={collection.id} draggableId={collection.id} index={index}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="card"
                        onClick={() => setViewingCollection(collection)}
                        style={{
                          borderLeft: `4px solid ${collection.color}`,
                          opacity: snapshot.isDragging ? 0.8 : 1,
                          transform: snapshot.isDragging ? 'rotate(2deg)' : 'none',
                          ...provided.draggableProps.style,
                        }}
            >
              <h3 style={{ marginBottom: '0.5rem', fontWeight: 500 }}>
                {collection.name}
              </h3>
              {collection.description && (
                <p className="text-secondary" style={{ 
                  fontSize: '0.875rem', 
                  marginBottom: '1rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {collection.description}
                </p>
              )}
              <p className="text-secondary" style={{ fontSize: '0.75rem' }}>
                {getPoemCount(collection.id)} {getPoemCount(collection.id) === 1 ? t.collections.poemsSingular : t.collections.poems}
              </p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {isEditorOpen && (
        <CollectionEditor
          collection={selectedCollection || undefined}
          onSave={handleCollectionSaved}
          onClose={() => { setIsEditorOpen(false); setSelectedCollection(null); }}
        />
      )}

      {viewingCollection && (
        <CollectionViewer
          collection={viewingCollection}
          onClose={() => setViewingCollection(null)}
          onUpdate={loadCollections}
        />
      )}
    </div>
  );
};

export default CollectionsScreen;
