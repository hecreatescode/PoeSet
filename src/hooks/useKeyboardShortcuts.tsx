// Global keyboard shortcuts handler
import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  callback: (e: KeyboardEvent) => void;
  description?: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrlKey === undefined || e.ctrlKey === shortcut.ctrlKey;
        const shiftMatch = shortcut.shiftKey === undefined || e.shiftKey === shortcut.shiftKey;
        const altMatch = shortcut.altKey === undefined || e.altKey === shortcut.altKey;
        const metaMatch = shortcut.metaKey === undefined || e.metaKey === shortcut.metaKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
          // Don't trigger shortcuts when typing in inputs
          const target = e.target as HTMLElement;
          if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            // Allow Escape to work in inputs
            if (e.key !== 'Escape') {
              continue;
            }
          }

          e.preventDefault();
          shortcut.callback(e);
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

// Common shortcuts
export const createCommonShortcuts = (actions: {
  onNew?: () => void;
  onSave?: () => void;
  onClose?: () => void;
  onSearch?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}): KeyboardShortcut[] => {
  const shortcuts: KeyboardShortcut[] = [];

  if (actions.onNew) {
    shortcuts.push({
      key: 'n',
      ctrlKey: true,
      callback: actions.onNew,
      description: 'New poem (Ctrl+N)',
    });
  }

  if (actions.onSave) {
    shortcuts.push({
      key: 's',
      ctrlKey: true,
      callback: actions.onSave,
      description: 'Save (Ctrl+S)',
    });
  }

  if (actions.onClose) {
    shortcuts.push({
      key: 'Escape',
      callback: actions.onClose,
      description: 'Close (Esc)',
    });
  }

  if (actions.onSearch) {
    shortcuts.push({
      key: 'f',
      ctrlKey: true,
      callback: actions.onSearch,
      description: 'Search (Ctrl+F)',
    });
  }

  if (actions.onDelete) {
    shortcuts.push({
      key: 'Delete',
      ctrlKey: true,
      callback: actions.onDelete,
      description: 'Delete (Ctrl+Del)',
    });
  }

  if (actions.onEdit) {
    shortcuts.push({
      key: 'e',
      ctrlKey: true,
      callback: actions.onEdit,
      description: 'Edit (Ctrl+E)',
    });
  }

  return shortcuts;
};
