import { describe, it, expect, vi } from 'vitest';

const makeIndexedDb = ({
  hasImagesStore = false,
  forceUpgrade = false,
  failOpen = false,
  failOpenWithoutError = false,
  failPut = false,
  failPutWithoutError = false,
} = {}) => {
  const records = new Map();

  const makeReq = ({ result, error, triggerError = false } = {}) => {
    const req = { result, error, onsuccess: null, onerror: null };
    queueMicrotask(() => {
      if (error || triggerError) req.onerror?.();
      else req.onsuccess?.();
    });
    return req;
  };

  const store = {
    put: (record) => {
      if (failPut) return makeReq({ error: new Error('put failed') });
      if (failPutWithoutError) return makeReq({ triggerError: true });
      records.set(record.id, record);
      return makeReq({ result: record.id });
    },
    get: (id) => makeReq({ result: records.get(id) }),
    delete: (id) => {
      records.delete(id);
      return makeReq({ result: undefined });
    },
  };

  const db = {
    objectStoreNames: {
      contains: (name) => hasImagesStore && name === 'images',
    },
    createObjectStore: vi.fn(() => store),
    transaction: vi.fn(() => ({
      objectStore: vi.fn(() => store),
    })),
  };

  const indexedDB = {
    open: vi.fn(() => {
      const req = { result: db, error: null, onsuccess: null, onerror: null, onupgradeneeded: null };
      queueMicrotask(() => {
        if (forceUpgrade || !hasImagesStore) req.onupgradeneeded?.();
        if (failOpen || failOpenWithoutError) {
          req.error = failOpen ? new Error('open failed') : null;
          req.onerror?.();
        } else {
          req.onsuccess?.();
        }
      });
      return req;
    }),
  };

  return { indexedDB, db, store, records };
};

describe('idb image store', () => {
  it('rejects when IndexedDB is unavailable', async () => {
    const original = globalThis.indexedDB;
    try {
      // @ts-ignore
      delete globalThis.indexedDB;
      vi.resetModules();
      const { putImageFile } = await import('../../src/lib/idb.js');
      await expect(putImageFile({ name: 'a.png' })).rejects.toThrow(/IndexedDB unavailable/i);
    } finally {
      globalThis.indexedDB = original;
    }
  });

  it('creates the images store on upgrade when missing', async () => {
    const original = globalThis.indexedDB;
    const mock = makeIndexedDb({ hasImagesStore: false });
    globalThis.indexedDB = mock.indexedDB;

    try {
      vi.resetModules();
      const { putImageFile, getImageRecord, deleteImage } = await import('../../src/lib/idb.js');

      const file = { name: 'a.png', type: 'image/png', lastModified: 123 };
      const { id, record } = await putImageFile(file);
      expect(typeof id).toBe('string');
      expect(record.id).toBe(id);
      expect(record.name).toBe('a.png');
      expect(record.type).toBe('image/png');
      expect(record.lastModified).toBe(123);
      expect(mock.db.createObjectStore).toHaveBeenCalledWith('images', { keyPath: 'id' });

      const stored = await getImageRecord(id);
      expect(stored?.id).toBe(id);
      await deleteImage(id);
      expect(await getImageRecord(id)).toBeUndefined();
    } finally {
      globalThis.indexedDB = original;
    }
  });

  it('does not recreate the store when it already exists', async () => {
    const original = globalThis.indexedDB;
    const mock = makeIndexedDb({ hasImagesStore: true });
    globalThis.indexedDB = mock.indexedDB;

    try {
      vi.resetModules();
      const { putImageFile } = await import('../../src/lib/idb.js');
      const { id } = await putImageFile({ name: 'b.png' });
      expect(typeof id).toBe('string');
      expect(mock.db.createObjectStore).not.toHaveBeenCalled();
    } finally {
      globalThis.indexedDB = original;
    }
  });

  it('handles upgrades when the store already exists', async () => {
    const original = globalThis.indexedDB;
    const mock = makeIndexedDb({ hasImagesStore: true, forceUpgrade: true });
    globalThis.indexedDB = mock.indexedDB;
    try {
      vi.resetModules();
      const { putImageFile } = await import('../../src/lib/idb.js');
      await putImageFile({ name: 'c.png' });
      expect(mock.db.createObjectStore).not.toHaveBeenCalled();
    } finally {
      globalThis.indexedDB = original;
    }
  });

  it('reuses the same open() promise across operations', async () => {
    const original = globalThis.indexedDB;
    const mock = makeIndexedDb({ hasImagesStore: true });
    globalThis.indexedDB = mock.indexedDB;
    try {
      vi.resetModules();
      const { putImageFile } = await import('../../src/lib/idb.js');
      await putImageFile({ name: 'a.png' });
      await putImageFile({ name: 'b.png' });
      expect(mock.indexedDB.open).toHaveBeenCalledTimes(1);
    } finally {
      globalThis.indexedDB = original;
    }
  });

  it('falls back to time-based ids when crypto.randomUUID is unavailable', async () => {
    const original = globalThis.indexedDB;
    const mock = makeIndexedDb({ hasImagesStore: true });
    globalThis.indexedDB = mock.indexedDB;

    const originalRandomUUID = globalThis.crypto?.randomUUID;
    const originalNow = Date.now;
    const originalRandom = Math.random;

    try {
      if (globalThis.crypto) globalThis.crypto.randomUUID = undefined;
      Date.now = () => 1700000000000;
      Math.random = () => 0.5;

      vi.resetModules();
      const { putImageFile } = await import('../../src/lib/idb.js');
      const { id, record } = await putImageFile();
      expect(id).toMatch(/^img_1700000000000_/);
      expect(record.name).toBe('');
      expect(record.type).toBe('');
    } finally {
      if (globalThis.crypto) globalThis.crypto.randomUUID = originalRandomUUID;
      Date.now = originalNow;
      Math.random = originalRandom;
      globalThis.indexedDB = original;
    }
  });

  it('surfaces open errors and request errors', async () => {
    const original = globalThis.indexedDB;
    try {
      const mockOpenFail = makeIndexedDb({ failOpen: true });
      globalThis.indexedDB = mockOpenFail.indexedDB;
      vi.resetModules();
      const { putImageFile } = await import('../../src/lib/idb.js');
      await expect(putImageFile({ name: 'x.png' })).rejects.toThrow(/open/i);

      const mockOpenFailNoErr = makeIndexedDb({ failOpenWithoutError: true });
      globalThis.indexedDB = mockOpenFailNoErr.indexedDB;
      vi.resetModules();
      const { putImageFile: openFailNoErr } = await import('../../src/lib/idb.js');
      await expect(openFailNoErr({ name: 'z.png' })).rejects.toThrow(/Failed to open IndexedDB/i);

      const mockPutFail = makeIndexedDb({ hasImagesStore: true, failPut: true });
      globalThis.indexedDB = mockPutFail.indexedDB;
      vi.resetModules();
      const { putImageFile: putFail } = await import('../../src/lib/idb.js');
      await expect(putFail({ name: 'y.png' })).rejects.toThrow(/request failed|put failed/i);

      const mockPutFailNoErr = makeIndexedDb({ hasImagesStore: true, failPutWithoutError: true });
      globalThis.indexedDB = mockPutFailNoErr.indexedDB;
      vi.resetModules();
      const { putImageFile: putFailNoErr } = await import('../../src/lib/idb.js');
      await expect(putFailNoErr({ name: 'w.png' })).rejects.toThrow(/IndexedDB request failed/i);
    } finally {
      globalThis.indexedDB = original;
    }
  });
});
