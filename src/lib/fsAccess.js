export const isFileSystemAccessSupported = () => {
  return typeof window !== 'undefined' && typeof window.showDirectoryPicker === 'function';
};

export const isOpenFilePickerSupported = () => {
  // @ts-ignore
  return typeof window !== 'undefined' && typeof window.showOpenFilePicker === 'function';
};

export const pickDirectory = async ({ mode = 'readwrite' } = {}) => {
  if (!isFileSystemAccessSupported()) {
    throw new Error('File System Access API not supported in this browser/context.');
  }
  // @ts-ignore
  return await window.showDirectoryPicker({ mode });
};

export const pickTexFile = async () => {
  if (!isOpenFilePickerSupported()) {
    throw new Error('File picker not supported in this browser/context.');
  }
  // @ts-ignore
  const handles = await window.showOpenFilePicker({
    multiple: false,
    types: [
      {
        description: 'LaTeX / Text',
        accept: {
          'text/plain': ['.tex', '.txt'],
          'application/x-tex': ['.tex'],
        },
      },
    ],
  });
  return handles?.[0] || null;
};

export const listDirectoryFilesRecursive = async (dirHandle, { maxFiles = 5000 } = {}) => {
  const out = [];
  const walk = async (handle, prefix) => {
    // @ts-ignore
    for await (const [name, child] of handle.entries()) {
      if (name === '.DS_Store') continue;
      const path = prefix ? `${prefix}/${name}` : name;
      if (child.kind === 'file') {
        out.push({ path, handle: child });
        if (out.length >= maxFiles) return;
      } else if (child.kind === 'directory') {
        await walk(child, path);
        if (out.length >= maxFiles) return;
      }
    }
  };
  await walk(dirHandle, '');
  return out;
};

export const readFileText = async (fileHandle) => {
  const file = await fileHandle.getFile();
  return await file.text();
};

export const writeFileText = async (fileHandle, text) => {
  // Some browsers gate by permissions; attempt politely.
  try {
    // @ts-ignore
    if (typeof fileHandle.requestPermission === 'function') {
      // @ts-ignore
      await fileHandle.requestPermission({ mode: 'readwrite' });
    }
  } catch { /* ignore */ }

  const writable = await fileHandle.createWritable();
  await writable.write(text);
  await writable.close();
};
