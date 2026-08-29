import type { SavedSession } from './model';

const DATABASE = 'dialog-only-switch';
const STORE = 'sessions';
const CURRENT = 'current';

export type SessionNamespace = 'real' | 'demo';

function sessionKey(namespace: SessionNamespace): string {
  // Demo data deliberately has a distinct key. It can never be restored into
  // the person's normal session by accident.
  return namespace === 'demo' ? 'demo:current' : CURRENT;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open browser storage.'));
  });
}

export async function loadSession(namespace: SessionNamespace = 'real'): Promise<SavedSession | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, 'readonly');
    const request = transaction.objectStore(STORE).get(sessionKey(namespace));
    request.onsuccess = () => resolve((request.result as SavedSession | undefined) ?? null);
    request.onerror = () => reject(request.error ?? new Error('Could not read the saved session.'));
    transaction.oncomplete = () => db.close();
  });
}

export async function saveSession(session: SavedSession, namespace: SessionNamespace = 'real'): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, 'readwrite');
    transaction.objectStore(STORE).put(session, sessionKey(namespace));
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not save this session.'));
  });
}

export async function clearSession(namespace: SessionNamespace = 'real'): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, 'readwrite');
    transaction.objectStore(STORE).delete(sessionKey(namespace));
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not clear this session.'));
  });
}
