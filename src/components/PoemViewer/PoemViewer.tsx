import React, { useState, useRef } from 'react';
import { X, Edit, Trash2, Share2, History, Copy, Image, Download } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import type { Poem, Theme } from '../../types';
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const poemContentRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const settings = getSettings();

  // Get theme colors for image generation
  const getThemeColors = (theme: Theme) => {
    const themes: Record<Theme, { bg: string; text: string; accent: string; secondary: string }> = {
      light: { bg: '#f9f7f4', text: '#1a1a1a', accent: '#2c2c2c', secondary: '#666666' },
      dark: { bg: '#0f1419', text: '#f0ede6', accent: '#d4af37', secondary: '#a8a29e' },
      sepia: { bg: '#f4ecd8', text: '#3e2723', accent: '#8d6e63', secondary: '#6d4c41' },
      midnight: { bg: '#0a0e1a', text: '#e0e6f0', accent: '#7aa2f7', secondary: '#8b95a8' },
      forest: { bg: '#1a2f1a', text: '#e8f5e8', accent: '#90ee90', secondary: '#a8c5a8' },
      ocean: { bg: '#e8f4ff', text: '#1a3a5a', accent: '#2196f3', secondary: '#5a7a9a' },
      rose: { bg: '#ffe8f0', text: '#4a1f2e', accent: '#c44569', secondary: '#8a5060' },
    };
    return themes[theme] || themes.light;
  };

  // Generate poem as image
  const generatePoemImage = async () => {
    setIsGeneratingImage(true);
    
    const theme = poem.theme || settings.theme;
    const colors = getThemeColors(theme);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsGeneratingImage(false);
      return;
    }

    // Calculate canvas size based on content
    const padding = 80;
    const maxWidth = 800;
    const lineHeight = 32;
    const titleHeight = poem.title ? 60 : 0;
    const dateHeight = 40;
    
    // Word wrap function
    const wrapText = (text: string, maxW: number): string[] => {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      
      ctx.font = '18px Georgia, serif';
      
      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxW && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }
      return lines;
    };

    // Process content lines
    ctx.font = '18px Georgia, serif';
    const contentLines: string[] = [];
    const rawLines = poem.content.split('\n');
    for (const line of rawLines) {
      if (line.trim() === '') {
        contentLines.push('');
      } else {
        const wrapped = wrapText(line, maxWidth - padding * 2);
        contentLines.push(...wrapped);
      }
    }

    const contentHeight = contentLines.length * lineHeight;
    const totalHeight = padding * 2 + titleHeight + contentHeight + dateHeight + 40;

    canvas.width = maxWidth;
    canvas.height = totalHeight;

    // Draw background
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw decorative border
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    let yPos = padding;

    // Draw title
    if (poem.title) {
      ctx.fillStyle = colors.text;
      ctx.font = 'bold 28px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(poem.title, canvas.width / 2, yPos + 30);
      yPos += titleHeight;
    }

    // Draw content
    ctx.fillStyle = colors.text;
    ctx.font = '18px Georgia, serif';
    ctx.textAlign = 'center';
    
    for (const line of contentLines) {
      ctx.fillText(line, canvas.width / 2, yPos + lineHeight);
      yPos += lineHeight;
    }

    // Draw date
    yPos += 20;
    ctx.fillStyle = colors.secondary;
    ctx.font = '14px Georgia, serif';
    ctx.fillText(format(new Date(poem.date), 'd MMMM yyyy', { locale: pl }), canvas.width / 2, yPos);

    // Draw watermark
    ctx.fillStyle = colors.accent;
    ctx.font = '12px Georgia, serif';
    ctx.fillText('PoeSet', canvas.width / 2, canvas.height - 30);

    // Convert to blob and download/share
    canvas.toBlob(async (blob) => {
      if (!blob) {
        setIsGeneratingImage(false);
        return;
      }

      const file = new File([blob], `${poem.title || 'wiersz'}.png`, { type: 'image/png' });

      // Try to share using Web Share API
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: poem.title || 'Wiersz',
            text: 'Mój wiersz z PoeSet',
          });
        } catch (err) {
          // User cancelled or error - fall back to download
          downloadImage(blob);
        }
      } else {
        // Fall back to download
        downloadImage(blob);
      }
      
      setIsGeneratingImage(false);
      setShowShareModal(false);
    }, 'image/png');
  };

  const downloadImage = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${poem.title || 'wiersz'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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

  // Get viewer theme based on poem or app settings
  const viewerTheme = poem.theme || settings.theme;
  const themeColors = getThemeColors(viewerTheme);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: poem.theme ? themeColors.bg : 'var(--bg-primary)',
        color: poem.theme ? themeColors.text : 'var(--text-primary)',
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
          borderBottom: `1px solid ${poem.theme ? themeColors.accent + '40' : 'var(--border-color)'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: poem.theme ? themeColors.bg : 'var(--bg-primary)',
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
              onClick={(e) => { e.stopPropagation(); setShowShareModal(true); }}
              style={{ padding: '0.5rem' }}
              title={t.share?.title || 'Udostępnij'}
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

      {/* Share Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={t.share?.title || 'Udostępnij'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {t.share?.subtitle || 'Wybierz sposób udostępniania wiersza'}
          </p>
          
          <button
            className="button button-primary"
            onClick={() => generatePoemImage()}
            disabled={isGeneratingImage}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <Image size={20} />
            {isGeneratingImage 
              ? (t.common?.loading || 'Generowanie...') 
              : (t.share?.generateImage || 'Pobierz jako obraz PNG')}
          </button>
          
          <button
            className="button button-secondary"
            onClick={() => {
              handleShare();
              setShowShareModal(false);
            }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <Share2 size={20} />
            {t.share?.copyLink || 'Kopiuj tekst wiersza'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PoemViewer;
