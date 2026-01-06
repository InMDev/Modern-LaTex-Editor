import { describe, it, expect, vi } from 'vitest';
import {
  isFileSystemAccessSupported,
  isOpenFilePickerSupported,
  pickDirectory,
  pickTexFile,
  listDirectoryFilesRecursive,
  readFileText,
  writeFileText,
} from '../../src/lib/fsAccess';

const makeDir = (entries) => ({
  kind: 'directory',
  async *entries() {
    for (const [name, child] of entries) yield [name, child];
  },
});

describe('fsAccess', () => {
  it('detects File System Access support', () => {
    const original = window.showDirectoryPicker;
    try {
      // @ts-ignore
      delete window.showDirectoryPicker;
      expect(isFileSystemAccessSupported()).toBe(false);
      // @ts-ignore
      window.showDirectoryPicker = () => {};
      expect(isFileSystemAccessSupported()).toBe(true);
    } finally {
      window.showDirectoryPicker = original;
    }
  });

  it('detects open file picker support', () => {
    const original = window.showOpenFilePicker;
    try {
      // @ts-ignore
      delete window.showOpenFilePicker;
      expect(isOpenFilePickerSupported()).toBe(false);
      // @ts-ignore
      window.showOpenFilePicker = () => {};
      expect(isOpenFilePickerSupported()).toBe(true);
    } finally {
      window.showOpenFilePicker = original;
    }
  });

  it('pickDirectory throws when unsupported and passes mode when supported', async () => {
    const original = window.showDirectoryPicker;
    try {
      // @ts-ignore
      delete window.showDirectoryPicker;
      await expect(pickDirectory()).rejects.toThrow(/not supported/i);

      const showDirectoryPicker = vi.fn(async (opts) => ({ kind: 'directory', opts }));
      // @ts-ignore
      window.showDirectoryPicker = showDirectoryPicker;
      const dir = await pickDirectory({ mode: 'readwrite' });
      expect(showDirectoryPicker).toHaveBeenCalledWith({ mode: 'readwrite' });
      expect(dir.kind).toBe('directory');
    } finally {
      window.showDirectoryPicker = original;
    }
  });

  it('pickTexFile throws when unsupported and returns the first handle when supported', async () => {
    const original = window.showOpenFilePicker;
    try {
      // @ts-ignore
      delete window.showOpenFilePicker;
      await expect(pickTexFile()).rejects.toThrow(/not supported/i);

      const handle = { kind: 'file', name: 'a.tex' };
      const showOpenFilePicker = vi.fn(async () => [handle]);
      // @ts-ignore
      window.showOpenFilePicker = showOpenFilePicker;
      const out = await pickTexFile();
      expect(out).toBe(handle);
      expect(showOpenFilePicker).toHaveBeenCalledWith(
        expect.objectContaining({
          multiple: false,
          types: expect.any(Array),
        })
      );
    } finally {
      window.showOpenFilePicker = original;
    }
  });

  it('pickTexFile returns null when no handle is selected', async () => {
    const original = window.showOpenFilePicker;
    try {
      // @ts-ignore
      window.showOpenFilePicker = vi.fn(async () => []);
      expect(await pickTexFile()).toBeNull();
      // @ts-ignore
      window.showOpenFilePicker = vi.fn(async () => undefined);
      expect(await pickTexFile()).toBeNull();
    } finally {
      window.showOpenFilePicker = original;
    }
  });

  it('listDirectoryFilesRecursive walks directories, skips .DS_Store, and enforces maxFiles', async () => {
    const fileA = { kind: 'file', id: 'a' };
    const fileB = { kind: 'file', id: 'b' };
    const dir = makeDir([
      ['.DS_Store', { kind: 'file' }],
      ['a.tex', fileA],
      ['sub', makeDir([['b.txt', fileB]])],
    ]);

    const found = await listDirectoryFilesRecursive(dir);
    expect(found.map((f) => f.path).sort()).toEqual(['a.tex', 'sub/b.txt'].sort());
    expect(found.find((f) => f.path === 'a.tex')?.handle).toBe(fileA);

    const limited = await listDirectoryFilesRecursive(dir, { maxFiles: 1 });
    expect(limited.length).toBe(1);
  });

  it('listDirectoryFilesRecursive stops after hitting maxFiles inside a nested directory', async () => {
    const dir = makeDir([
      ['sub', makeDir([['a.tex', { kind: 'file' }], ['b.tex', { kind: 'file' }]])],
      ['c.tex', { kind: 'file' }],
    ]);

    const found = await listDirectoryFilesRecursive(dir, { maxFiles: 1 });
    expect(found).toEqual([{ path: 'sub/a.tex', handle: expect.any(Object) }]);
  });

  it('listDirectoryFilesRecursive ignores unknown handle kinds', async () => {
    const dir = makeDir([
      ['a.tex', { kind: 'file' }],
      ['weird', { kind: 'unknown' }],
    ]);
    const found = await listDirectoryFilesRecursive(dir);
    expect(found.map((f) => f.path)).toEqual(['a.tex']);
  });

  it('readFileText reads text from a file handle', async () => {
    const fileHandle = {
      async getFile() {
        return { async text() { return 'hello'; } };
      },
    };
    expect(await readFileText(fileHandle)).toBe('hello');
  });

  it('writeFileText requests permission when available and always writes/close', async () => {
    const writable = { write: vi.fn(async () => {}), close: vi.fn(async () => {}) };
    const fileHandle = {
      requestPermission: vi.fn(async () => 'granted'),
      createWritable: vi.fn(async () => writable),
    };

    await writeFileText(fileHandle, 'x');
    expect(fileHandle.requestPermission).toHaveBeenCalledWith({ mode: 'readwrite' });
    expect(fileHandle.createWritable).toHaveBeenCalledTimes(1);
    expect(writable.write).toHaveBeenCalledWith('x');
    expect(writable.close).toHaveBeenCalledTimes(1);
  });

  it('writeFileText ignores permission errors', async () => {
    const writable = { write: vi.fn(async () => {}), close: vi.fn(async () => {}) };
    const fileHandle = {
      requestPermission: vi.fn(async () => { throw new Error('nope'); }),
      createWritable: vi.fn(async () => writable),
    };

    await writeFileText(fileHandle, 'y');
    expect(fileHandle.createWritable).toHaveBeenCalledTimes(1);
    expect(writable.write).toHaveBeenCalledWith('y');
    expect(writable.close).toHaveBeenCalledTimes(1);
  });

  it('writeFileText works when requestPermission is unavailable', async () => {
    const writable = { write: vi.fn(async () => {}), close: vi.fn(async () => {}) };
    const fileHandle = {
      createWritable: vi.fn(async () => writable),
    };

    await writeFileText(fileHandle, 'z');
    expect(fileHandle.createWritable).toHaveBeenCalledTimes(1);
    expect(writable.write).toHaveBeenCalledWith('z');
    expect(writable.close).toHaveBeenCalledTimes(1);
  });
});
