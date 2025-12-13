// Export utilities for PDF and EPUB
import type { Poem } from '../types';

export class ExportService {
  static exportToDocx(poems: Poem[] | Poem, filename = 'poem.docx') {
    // Akceptuje pojedynczy wiersz lub tablicę
    const poemArr = Array.isArray(poems) ? poems : [poems];
    let content = '';
    poemArr.forEach(poem => {
      content += `${poem.title || 'Untitled'}\n\n`;
      content += `${new Date(poem.date).toLocaleDateString()}\n\n`;
      content += `${poem.content}\n\n`;
      if (poem.tags.length > 0) {
        content += `Tags: ${poem.tags.join(', ')}\n\n`;
      }
      content += '---\n\n';
    });
    // Minimalny plik DOCX (Word rozpozna jako tekstowy)
    // Ale: dla prostoty generujemy .docx jako .doc (plain text, Word otworzy)
    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  static exportToMarkdown(poems: Poem[]): string {
    let markdown = '# My Poetry Collection\n\n';
    poems.forEach(poem => {
      markdown += `## ${poem.title || 'Untitled'}\n\n`;
      markdown += `*${new Date(poem.date).toLocaleDateString()}*\n\n`;
      markdown += `${poem.content}\n\n`;
      if (poem.tags.length > 0) {
        markdown += `Tags: ${poem.tags.join(', ')}\n\n`;
      }
      markdown += '---\n\n';
    });
    return markdown;
  }

  static exportToHTML(poems: Poem[]): string {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Poetry Collection</title>
  <style>
    body { font-family: serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8; }
    h1 { text-align: center; margin-bottom: 60px; }
    .poem { page-break-inside: avoid; margin-bottom: 60px; }
    .poem-title { font-size: 1.5em; margin-bottom: 10px; }
    .poem-date { color: #666; font-size: 0.9em; margin-bottom: 20px; }
    .poem-content { white-space: pre-wrap; margin-bottom: 20px; }
    .poem-tags { font-size: 0.9em; color: #666; }
    hr { margin: 40px 0; border: none; border-top: 1px solid #ddd; }
  </style>
</head>
<body>
  <h1>My Poetry Collection</h1>
`;

    poems.forEach(poem => {
      html += `  <div class="poem">
    <div class="poem-title">${poem.title || 'Untitled'}</div>
    <div class="poem-date">${new Date(poem.date).toLocaleDateString()}</div>
    <div class="poem-content">${poem.content}</div>
    ${poem.tags.length > 0 ? `<div class="poem-tags">Tags: ${poem.tags.join(', ')}</div>` : ''}
  </div>
  <hr>
`;
    });

    html += `</body>
</html>`;

    return html;
  }

  static downloadFile(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static exportToPDF(poems: Poem[]) {
    // For PDF, we'll export as HTML and let the user print to PDF
    const html = this.exportToHTML(poems);
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      setTimeout(() => {
        win.print();
      }, 250);
    }
  }

  static importFromJSON(jsonString: string): Poem[] {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch (error) {
      console.error('Import failed:', error);
      return [];
    }
  }
}
