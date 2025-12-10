import React, { useState } from 'react';
import { X, Plus, Trash2, FileText } from 'lucide-react';
import type { PoemTemplate } from '../../types';
import { getTemplates, saveTemplate, deleteTemplate } from '../../utils/storage';

interface TemplatesScreenProps {
  onBack: () => void;
  onUseTemplate?: (template: PoemTemplate) => void;
}

const TemplatesScreen: React.FC<TemplatesScreenProps> = ({ onBack, onUseTemplate }) => {
  const [templates, setTemplates] = useState<PoemTemplate[]>(getTemplates());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    structure: '',
    example: '',
  });

  const loadTemplates = () => {
    setTemplates(getTemplates());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.structure.trim()) return;

    const templateId = editingId || `template_${crypto.randomUUID()}`;
    const template: PoemTemplate = {
      id: templateId,
      name: formData.name.trim(),
      structure: formData.structure.trim(),
      example: formData.example.trim(),
      isCustom: true,
    };

    saveTemplate(template);
    loadTemplates();
    resetForm();
  };

  const handleEdit = (template: PoemTemplate) => {
    setFormData({
      name: template.name,
      structure: template.structure,
      example: template.example || '',
    });
    setEditingId(template.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Czy na pewno chcesz usunąć ten szablon?')) {
      deleteTemplate(id);
      loadTemplates();
    }
  };

  const resetForm = () => {
    setFormData({ name: '', structure: '', example: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'var(--bg-primary)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--spacing-lg)',
        borderBottom: '1px solid var(--light-border)',
        background: 'var(--bg-secondary)',
      }}>
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 600,
          margin: 0,
          color: 'var(--text-primary)'
        }}>
          Szablony
        </h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="button button-primary"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={20} />
            {showForm ? 'Anuluj' : 'Nowy szablon'}
          </button>
          <button 
            className="button button-secondary"
            onClick={onBack}
            style={{ padding: '0.5rem' }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--light-border)',
          background: 'var(--bg-card)',
        }}>
          <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: 500,
                color: 'var(--text-primary)'
              }}>
                Nazwa szablonu *
              </label>
              <input
                type="text"
                className="input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="np. Sonet, Haiku, Limerick..."
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: 500,
                color: 'var(--text-primary)'
              }}>
                Struktura *
              </label>
              <textarea
                className="input"
                value={formData.structure}
                onChange={(e) => setFormData({ ...formData, structure: e.target.value })}
                placeholder="Opisz strukturę wiersza (ilość zwrotek, wersów, rym, metrykę...)"
                rows={4}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: 500,
                color: 'var(--text-primary)'
              }}>
                Przykład (opcjonalnie)
              </label>
              <textarea
                className="input"
                value={formData.example}
                onChange={(e) => setFormData({ ...formData, example: e.target.value })}
                placeholder="Dodaj przykładowy wiersz w tym stylu..."
                rows={6}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="button button-primary">
                {editingId ? 'Zapisz zmiany' : 'Dodaj szablon'}
              </button>
              <button 
                type="button" 
                className="button button-secondary"
                onClick={resetForm}
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Templates List */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: 'var(--spacing-lg)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: 'var(--spacing-md)',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {templates.map(template => (
            <div
              key={template.id}
              className="card"
              style={{
                padding: 'var(--spacing-md)',
                cursor: onUseTemplate ? 'pointer' : 'default',
                transition: 'all 0.2s',
              }}
              onClick={() => onUseTemplate && onUseTemplate(template)}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={20} style={{ color: 'var(--accent-color)' }} />
                  <h3 style={{ 
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    margin: 0,
                    color: 'var(--text-primary)'
                  }}>
                    {template.name}
                  </h3>
                </div>
                {template.isCustom && (
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      className="button button-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(template);
                      }}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}
                    >
                      Edytuj
                    </button>
                    <button
                      className="button button-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(template.id);
                      }}
                      style={{ padding: '0.25rem 0.5rem' }}
                      title="Usuń szablon"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '0.75rem',
                whiteSpace: 'pre-wrap',
              }}>
                {template.structure}
              </div>

              {template.example && (
                <div style={{
                  marginTop: '0.75rem',
                  padding: '0.75rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '0.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  fontStyle: 'italic',
                  whiteSpace: 'pre-wrap',
                  borderLeft: '3px solid var(--accent-color)',
                }}>
                  {template.example}
                </div>
              )}
            </div>
          ))}
        </div>

        {templates.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'var(--text-secondary)',
          }}>
            <FileText size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p>Brak szablonów. Dodaj pierwszy szablon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesScreen;
