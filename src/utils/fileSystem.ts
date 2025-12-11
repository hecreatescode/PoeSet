// File System Access API utility
// For modern browsers that support the File System Access API

// Extend Window interface for File System Access API
declare global {
  interface Window {
    showSaveFilePicker?: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
    showOpenFilePicker?: (options?: OpenFilePickerOptions) => Promise<FileSystemFileHandle[]>;
  }
}

interface SaveFilePickerOptions {
  types?: FilePickerAcceptType[];
  suggestedName?: string;
}

interface OpenFilePickerOptions {
  types?: FilePickerAcceptType[];
  multiple?: boolean;
}

interface FilePickerAcceptType {
  description?: string;
  accept: Record<string, string[]>;
}

export interface FileSystemHandle {
  handle: FileSystemFileHandle | null;
  supported: boolean;
}

let fileHandle: FileSystemFileHandle | null = null;

// Check if File System Access API is supported
export const isFileSystemSupported = (): boolean => {
  return 'showSaveFilePicker' in window;
};

// Request file handle from user
export const requestFileHandle = async (): Promise<FileSystemFileHandle | null> => {
  if (!isFileSystemSupported() || !window.showSaveFilePicker) {
    console.warn('File System Access API is not supported');
    return null;
  }

  try {
    const handle = await window.showSaveFilePicker({
      types: [
        {
          description: 'PoeSet Data',
          accept: {
            'application/json': ['.json'],
          },
        },
      ],
      suggestedName: 'poeset-data.json',
    });

    fileHandle = handle;
    return handle;
  } catch (err) {
    console.error('Error requesting file handle:', err);
    return null;
  }
};

// Save data to file
export const saveToFile = async (data: string): Promise<boolean> => {
  if (!fileHandle) {
    console.warn('No file handle available. Call requestFileHandle() first.');
    return false;
  }

  try {
    const writable = await fileHandle.createWritable();
    await writable.write(data);
    await writable.close();
    return true;
  } catch (err) {
    console.error('Error writing to file:', err);
    return false;
  }
};

// Auto-save wrapper
export const autoSave = async (getData: () => string): Promise<boolean> => {
  if (!fileHandle) {
    // If no handle, try to get one
    const handle = await requestFileHandle();
    if (!handle) {
      // Fallback to localStorage
      console.log('Falling back to localStorage');
      return false;
    }
  }

  const data = getData();
  return await saveToFile(data);
};

// Load data from file
export const loadFromFile = async (): Promise<string | null> => {
  if (!isFileSystemSupported() || !window.showOpenFilePicker) {
    return null;
  }

  try {
    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'PoeSet Data',
          accept: {
            'application/json': ['.json'],
          },
        },
      ],
      multiple: false,
    });

    const file = await handle.getFile();
    const contents = await file.text();
    
    // Store the handle for future saves
    fileHandle = handle;
    
    return contents;
  } catch (err) {
    console.error('Error loading from file:', err);
    return null;
  }
};

// Get current file handle status
export const getFileHandle = (): FileSystemFileHandle | null => {
  return fileHandle;
};

// Clear file handle
export const clearFileHandle = (): void => {
  fileHandle = null;
};

// Export all data to device file
export const exportToDevice = async (data: object): Promise<boolean> => {
  const jsonString = JSON.stringify(data, null, 2);
  
  if (isFileSystemSupported()) {
    const handle = await requestFileHandle();
    if (handle) {
      return await saveToFile(jsonString);
    }
  }
  
  // Fallback: download as blob
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'poeset-data.json';
  a.click();
  URL.revokeObjectURL(url);
  
  return true;
};
