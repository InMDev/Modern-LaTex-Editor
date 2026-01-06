const DB_NAME = 'texure';
const DB_VERSION = 1;
const STORE_IMAGES = 'images';

let dbPromise = null;

const openDb = () => {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable in this environment.'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error || new Error('Failed to open IndexedDB.'));
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_IMAGES)) {
        db.createObjectStore(STORE_IMAGES, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
  });
  return dbPromise;
};

const txRequest = (req) =>
  new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('IndexedDB request failed.'));
  });

export const putImageFile = async (file) => {
  const db = await openDb();
  const id = (globalThis.crypto?.randomUUID?.() || `img_${Date.now()}_${Math.random().toString(16).slice(2)}`);
  const tx = db.transaction(STORE_IMAGES, 'readwrite');
  const store = tx.objectStore(STORE_IMAGES);
  const record = {
    id,
    blob: file,
    name: file?.name || '',
    type: file?.type || '',
    lastModified: file?.lastModified || Date.now(),
  };
  await txRequest(store.put(record));
  return { id, record };
};

export const getImageRecord = async (id) => {
  const db = await openDb();
  const tx = db.transaction(STORE_IMAGES, 'readonly');
  const store = tx.objectStore(STORE_IMAGES);
  return await txRequest(store.get(id));
};

export const deleteImage = async (id) => {
  const db = await openDb();
  const tx = db.transaction(STORE_IMAGES, 'readwrite');
  const store = tx.objectStore(STORE_IMAGES);
  await txRequest(store.delete(id));
};

