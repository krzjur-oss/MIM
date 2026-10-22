import { Chapter, StudentProgress, Student, QuizQuestion } from './types';
import { DEFAULT_CHAPTERS } from './defaultChapters';

// ============================================================================
// Storage Error Listener Registry (e.g. QuotaExceededError Toast)
// ============================================================================
type StorageErrorListener = (message: string) => void;
const errorListeners = new Set<StorageErrorListener>();

export const onStorageError = (listener: StorageErrorListener): (() => void) => {
  errorListeners.add(listener);
  return () => {
    errorListeners.delete(listener);
  };
};

export const notifyStorageError = (message: string): void => {
  errorListeners.forEach((listener) => {
    try {
      listener(message);
    } catch (e) {
      console.error('[storage] Error in storage error listener:', e);
    }
  });
};

const isQuotaExceeded = (e: unknown): boolean => {
  if (!(e instanceof Error)) return false;
  const err = e as { code?: number; name?: string };
  return (
    err.name === 'QuotaExceededError' ||
    err.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    err.code === 22 ||
    err.code === 1014
  );
};

// ============================================================================
// IndexedDB Persistence Layer (for chapters and educational databases)
// ============================================================================
const DB_NAME = 'mim_multibook_idb';
const DB_VERSION = 1;
const STORE_NAME = 'keyval';

let dbPromise: Promise<IDBDatabase> | null = null;

export const resetIDB = (): void => {
  dbPromise = null;
};

export const getIDB = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise;
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.reject(new Error('IndexedDB not supported in this environment'));
  }
  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    try {
      const req = window.indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => {
        dbPromise = null;
        reject(req.error || new Error('Failed to open IndexedDB'));
      };
    } catch (err) {
      dbPromise = null;
      reject(err);
    }
  });
  return dbPromise;
};

export const idbSet = async (key: string, value: unknown): Promise<boolean> => {
  const db = await getIDB();
  return new Promise<boolean>((resolve, reject) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);

      let reqOk = false;
      req.onsuccess = () => {
        reqOk = true;
      };
      req.onerror = () => {
        reject(req.error || new Error(`IndexedDB put failed for key: ${key}`));
      };

      tx.oncomplete = () => {
        if (reqOk) {
          resolve(true);
        } else {
          reject(new Error(`Transaction completed without put success for key: ${key}`));
        }
      };
      tx.onerror = () => {
        reject(tx.error || new Error(`IndexedDB transaction error for key: ${key}`));
      };
      tx.onabort = () => {
        reject(tx.error || new Error(`IndexedDB transaction aborted for key: ${key}`));
      };
    } catch (err) {
      reject(err);
    }
  });
};

export const idbGet = async <T>(key: string): Promise<T | null> => {
  try {
    const db = await getIDB();
    return await new Promise<T | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve((req.result as T) ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('[storage] IndexedDB get warning for key:', key, e);
    return null;
  }
};

export const idbDelete = async (key: string): Promise<boolean> => {
  try {
    const db = await getIDB();
    return await new Promise<boolean>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => {};
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } catch (e) {
    console.warn('[storage] IndexedDB delete warning for key:', key, e);
    return false;
  }
};

// ============================================================================
// Storage Metrics & Diagnostics Interface
// ============================================================================
export interface StorageItemMetric {
  key: string;
  label: string;
  bytes: number;
  formatted: string;
}

export interface StorageMetrics {
  usedBytes: number;
  formattedUsed: string;
  estimatedQuotaBytes: number;
  formattedQuota: string;
  usagePercent: number;
  isNearQuota: boolean;
  hasQuotaExceeded: boolean;
  items: StorageItemMetric[];
  hasIndexedDB: boolean;
  localStorageUsedBytes: number;
  formattedLocalStorageUsed: string;
  idbUsedBytes: number;
  formattedIdbUsed: string;
  deviceQuotaBytes: number;
  formattedDeviceQuota: string;
}

const FRIENDLY_KEY_LABELS: Record<string, string> = {
  multibook_chapters: 'Baza lekcji i rozdziałów (pełny podręcznik)',
  multibook_chapter_gallery_images: 'Galeria ilustracji i plansz',
  multibook_progress: 'Postępy nauki i notatki z lekcji',
  multibook_quiz_answers: 'Historia odpowiedzi w quizach',
  multibook_students: 'Profile i oceny uczniów',
  multibook_teacher_classes: 'Klasy i grupy lekcyjne',
  multibook_realizations: 'Dziennik zrealizowanych tematów',
  multibook_class_chapters: 'Przypisania rozdziałów do klas',
  multibook_theme: 'Motyw graficzny (kolorystyka)',
  multibook_fontsize: 'Rozmiar czcionki czytnika',
  multibook_lineheight: 'Interlinia czytnika',
  multibook_reading_mode: 'Tryb skupienia / czytania',
  multibook_board_mode: 'Tryb Tablicy Szkolnej (Classroom)',
  multibook_terms_and_license_accepted_v1: 'Zgoda licencyjna i regulamin',
};

export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const getStorageMetricsSync = (): StorageMetrics => {
  let localStorageUsedBytes = 0;
  const items: StorageItemMetric[] = [];

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (!key) continue;
        const val = window.localStorage.getItem(key) || '';
        const itemBytes = (key.length + val.length) * 2;
        localStorageUsedBytes += itemBytes;

        items.push({
          key,
          label: FRIENDLY_KEY_LABELS[key] || key,
          bytes: itemBytes,
          formatted: formatBytes(itemBytes),
        });
      }
    } catch (e) {
      console.warn('[storage] Błąd odczytu statystyk localStorage:', e);
    }
  }

  items.sort((a, b) => b.bytes - a.bytes);

  const estimatedQuotaBytes = 5 * 1024 * 1024; // 5 MB typical DOMStorage limit on Android
  const usagePercent = Math.min(100, Math.round((localStorageUsedBytes / estimatedQuotaBytes) * 100));

  return {
    usedBytes: localStorageUsedBytes,
    formattedUsed: formatBytes(localStorageUsedBytes),
    estimatedQuotaBytes,
    formattedQuota: '5.0 MB',
    usagePercent,
    isNearQuota: usagePercent >= 70,
    hasQuotaExceeded: usagePercent >= 98,
    items,
    hasIndexedDB: typeof window !== 'undefined' && !!window.indexedDB,
    localStorageUsedBytes,
    formattedLocalStorageUsed: formatBytes(localStorageUsedBytes),
    idbUsedBytes: 0,
    formattedIdbUsed: '0 KB',
    deviceQuotaBytes: 100 * 1024 * 1024,
    formattedDeviceQuota: '100 MB',
  };
};

export const getStorageMetrics = async (): Promise<StorageMetrics> => {
  const sync = getStorageMetricsSync();

  if (typeof navigator !== 'undefined' && navigator.storage && typeof navigator.storage.estimate === 'function') {
    try {
      const estimate = await navigator.storage.estimate();
      const quota = typeof estimate.quota === 'number' ? estimate.quota : sync.deviceQuotaBytes;
      let idbBytes = 0;

      const details = (estimate as unknown as { usageDetails?: { indexedDB?: number } }).usageDetails;
      if (details && typeof details.indexedDB === 'number') {
        idbBytes = details.indexedDB;
      } else if (typeof estimate.usage === 'number') {
        idbBytes = Math.max(0, estimate.usage - sync.localStorageUsedBytes);
      }

      return {
        ...sync,
        idbUsedBytes: idbBytes,
        formattedIdbUsed: formatBytes(idbBytes),
        deviceQuotaBytes: quota,
        formattedDeviceQuota: formatBytes(quota),
      };
    } catch (e) {
      console.warn('[storage] Błąd navigator.storage.estimate():', e);
    }
  }

  return sync;
};

// ============================================================================
// Heavy Storage Collections (Educational Database routed directly to IndexedDB)
// ============================================================================
export const HEAVY_STORAGE_KEYS = [
  'multibook_chapters',
  'multibook_chapter_gallery_images',
  'multibook_progress',
  'multibook_quiz_answers',
  'multibook_students',
  'multibook_teacher_classes',
  'multibook_realizations',
  'multibook_class_chapters',
] as const;

export type HeavyStorageKey = typeof HEAVY_STORAGE_KEYS[number];

export const isHeavyKey = (key: string): boolean => {
  return (HEAVY_STORAGE_KEYS as readonly string[]).includes(key);
};

let lastQuotaNotificationTime = 0;

export const safeGet = <T>(
  key: string,
  defaultValue: T,
  validator?: (val: unknown) => T | null
): T => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return defaultValue;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null || raw === undefined) {
      return defaultValue;
    }
    const parsed = JSON.parse(raw);
    if (validator) {
      const validated = validator(parsed);
      return validated !== null ? validated : defaultValue;
    }
    return parsed as T;
  } catch (e) {
    console.warn(`[storage] Błąd odczytu klucza "${key}" z localStorage:`, e);
    return defaultValue;
  }
};

const lastNotificationTimes = new Map<string, number>();

export const notifyStorageErrorThrottled = (
  errorType: string,
  message: string,
  intervalMs: number = 30000
): void => {
  const now = Date.now();
  const lastTime = lastNotificationTimes.get(errorType) || 0;
  if (now - lastTime >= intervalMs) {
    lastNotificationTimes.set(errorType, now);
    notifyStorageError(message);
  }
};

/**
 * Asynchroniczny odczyt danych: sprawdza IndexedDB oraz localStorage,
 * porównuje znaczniki czasu zapisu i wybiera nowszą wersję danych (ochrona przed utratą po awarii IDB).
 */
export const safeGetAsync = async <T>(
  key: string,
  defaultValue: T,
  validator?: (val: unknown) => T | null
): Promise<T> => {
  let idbVal: T | null = null;
  let idbTs = 0;
  let lsVal: T | null = null;
  let lsTs = 0;

  try {
    idbVal = await idbGet<T>(key);
    const tsFromIDB = await idbGet<number>(`_ts_idb_${key}`).catch(() => 0);
    if (typeof tsFromIDB === 'number') idbTs = tsFromIDB;
  } catch (e) {
    console.warn(`[storage] Ostrzeżenie przy asynchronicznym odczycie IndexedDB dla "${key}":`, e);
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null && raw !== undefined) {
        lsVal = JSON.parse(raw);
        const rawTs = window.localStorage.getItem(`_ts_ls_${key}`);
        if (rawTs) lsTs = parseInt(rawTs, 10) || 0;
      }
    } catch (e) {
      console.warn(`[storage] Ostrzeżenie przy odczycie localStorage dla "${key}":`, e);
    }
  }

  // Jeśli oba źródła istnieją, wybierz to z nowszym znacznikiem czasu
  let chosenVal: T | null = null;
  if (idbVal !== null && lsVal !== null) {
    chosenVal = lsTs > idbTs ? lsVal : idbVal;
  } else if (idbVal !== null) {
    chosenVal = idbVal;
  } else if (lsVal !== null) {
    chosenVal = lsVal;
  }

  if (chosenVal !== null) {
    if (validator) {
      const validated = validator(chosenVal);
      if (validated !== null) return validated;
    } else {
      return chosenVal;
    }
  }

  return defaultValue;
};

// Debounced write queue for high-frequency state changes (e.g. typing, drawing, rapid progress updates)
const pendingIDBWrites = new Map<string, { timer: ReturnType<typeof setTimeout>; value: unknown }>();

export const idbSetDebounced = (key: string, value: unknown, delayMs: number = 300): void => {
  const existing = pendingIDBWrites.get(key);
  if (existing) {
    clearTimeout(existing.timer);
  }
  const timer = setTimeout(async () => {
    pendingIDBWrites.delete(key);
    try {
      await idbSet(key, value);
      await idbSet(`_ts_idb_${key}`, Date.now()).catch(() => {});
      // Usuń kopię z localStorage WYŁĄCZNIE po udanym zapisie do IndexedDB
      if (typeof window !== 'undefined' && window.localStorage?.getItem(key)) {
        try {
          window.localStorage.removeItem(key);
          window.localStorage.removeItem(`_emergency_${key}`);
          window.localStorage.removeItem(`_ts_ls_${key}`);
        } catch {}
      }
    } catch (err) {
      console.warn(`[storage] Błąd debounced zapisu IndexedDB dla "${key}":`, err);
      // Awaryjny zapis kopii w localStorage (jeśli zmieści się w pamięci)
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.setItem(key, JSON.stringify(value));
          window.localStorage.setItem(`_emergency_${key}`, 'true');
          window.localStorage.setItem(`_ts_ls_${key}`, String(Date.now()));
        } catch (lsErr) {
          console.warn(`[storage] Awaryjny zapis kopii do localStorage dla "${key}" nie powiódł się:`, lsErr);
        }
      }
      const isQuota = isQuotaExceeded(err);
      const errorType = isQuota ? 'quota_exceeded' : `idb_err_${key}`;
      const msg = isQuota
        ? 'Przekroczono limit pamięci urządzenia (QuotaExceededError). Zwolnij miejsce w pamięci przeglądarki.'
        : `Błąd zapisu bazy danych IndexedDB (${key}): ${err instanceof Error ? err.message : String(err)}`;
      notifyStorageErrorThrottled(errorType, msg, 30000);
    }
  }, delayMs);
  pendingIDBWrites.set(key, { timer, value });
};

export const flushPendingWrites = async (): Promise<void> => {
  const entries = Array.from(pendingIDBWrites.entries());
  pendingIDBWrites.clear();
  await Promise.all(
    entries.map(async ([key, item]) => {
      clearTimeout(item.timer);
      try {
        await idbSet(key, item.value);
        await idbSet(`_ts_idb_${key}`, Date.now()).catch(() => {});
        if (typeof window !== 'undefined' && window.localStorage?.getItem(key)) {
          try {
            window.localStorage.removeItem(key);
            window.localStorage.removeItem(`_emergency_${key}`);
            window.localStorage.removeItem(`_ts_ls_${key}`);
          } catch {}
        }
      } catch (err) {
        console.warn(`[storage] Błąd flush zapisu IndexedDB dla "${key}":`, err);
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            window.localStorage.setItem(key, JSON.stringify(item.value));
            window.localStorage.setItem(`_emergency_${key}`, 'true');
            window.localStorage.setItem(`_ts_ls_${key}`, String(Date.now()));
          } catch {}
        }
        const isQuota = isQuotaExceeded(err);
        const errorType = isQuota ? 'quota_exceeded' : `idb_err_${key}`;
        const msg = isQuota
          ? 'Przekroczono limit pamięci urządzenia (QuotaExceededError).'
          : `Błąd zapisu bazy danych (${key}): ${err instanceof Error ? err.message : String(err)}`;
        notifyStorageErrorThrottled(errorType, msg, 30000);
      }
    })
  );
};

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    void flushPendingWrites();
  });
  window.addEventListener('pagehide', () => {
    void flushPendingWrites();
  });
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        void flushPendingWrites();
      }
    });
  }

  // Wywołaj navigator.storage.persist() przy starcie dla trwałego zachowania danych
  if (typeof navigator !== 'undefined' && navigator.storage && typeof navigator.storage.persist === 'function') {
    navigator.storage.persist().then((persisted) => {
      console.info(`[storage] Trwałość magazynu (storage.persist): ${persisted ? 'uzyskana' : 'standardowa'}`);
    }).catch((err) => {
      console.warn('[storage] Błąd navigator.storage.persist():', err);
    });
  }
}

/**
 * Główna funkcja zapisu danych:
 * - Ciężkie bazy danych (rozdziały, postępy, zdjęcia, quizy, uczniowie) zapisuje do IndexedDB.
 * - Nie usuwa kopii z localStorage, dopóki zapis do IndexedDB nie zakończył się sukcesem.
 * - Błędy IndexedDB zgłasza przez notifyStorageError.
 * - Lekkie ustawienia interfejsu (motyw, rozmiar czcionki) zapisuje w localStorage dla natychmiastowego startu bez migotania.
 */
export const safeSet = <T>(key: string, value: T): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  // 1. Obszerne zbiory danych edukacyjnych -> buforowany zapis do IndexedDB
  if (isHeavyKey(key)) {
    idbSetDebounced(key, value, 250);
    // Kopia z localStorage zostanie usunięta dopiero po potwierdzonym sukcesie w idbSetDebounced!
    return true;
  }

  // 2. Lekkie ustawienia interfejsu -> zapis do localStorage
  if (!window.localStorage) {
    return false;
  }

  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (e) {
    if (isQuotaExceeded(e)) {
      console.warn(`[storage] QuotaExceededError dla klucza "${key}" - uruchamiam samonaprawę:`, e);

      // Samonaprawa: ewakuacja wszystkich ciężkich kluczy z localStorage do IndexedDB
      try {
        for (const heavyKey of HEAVY_STORAGE_KEYS) {
          const rawHeavy = window.localStorage.getItem(heavyKey);
          if (rawHeavy) {
            try {
              idbSet(heavyKey, JSON.parse(rawHeavy)).catch(() => {});
            } catch {}
            window.localStorage.removeItem(heavyKey);
          }
        }

        const serialized = JSON.stringify(value);
        window.localStorage.setItem(key, serialized);
        console.info(`[storage] Samonaprawa udana: klucz "${key}" zapisany po ewakuacji ciężkich danych.`);
        return true;
      } catch (retryErr) {
        console.warn(`[storage] Zapis do localStorage nie powiódł się po samonaprawie:`, retryErr);
        // Ostateczny fallback: zabezpiecz dane w bazie IndexedDB
        idbSet(key, value).catch(() => {});

        const now = Date.now();
        if (now - lastQuotaNotificationTime > 30000) {
          lastQuotaNotificationTime = now;
          notifyStorageError('Pamięć podręczna urządzenia jest pełna. Dane zabezpieczono w lokalnej bazie IndexedDB.');
        }
      }
    } else {
      console.error(`[storage] Błąd zapisu klucza "${key}" do localStorage:`, e);
      notifyStorageError(`Błąd zapisu ustawień "${key}": ${e instanceof Error ? e.message : String(e)}`);
    }
    return false;
  }
};

export const safeRemove = (key: string): void => {
  if (typeof window === 'undefined') return;
  try {
    if (window.localStorage) {
      window.localStorage.removeItem(key);
    }
    idbDelete(key).catch(() => {});
  } catch (e) {
    console.warn(`[storage] Błąd usuwania klucza "${key}":`, e);
  }
};

/**
 * Cicha automatyczna migracja przy uruchomieniu (dla ekranów interaktywnych Android i tabletów):
 * Przenosi dotychczasowe dane z ciasnego localStorage do bazy IndexedDB.
 * Usuwa klucz z localStorage WYŁĄCZNIE po udanym zapisie i odczycie kontrolnym (idbGet + porównanie JSON).
 * Przy porażce zostawia dane w localStorage i pokazuje ostrzeżenie.
 */
export const silentMigrateToIndexedDB = async (): Promise<{
  migrated: boolean;
  freedBytes: number;
  keysMigrated: string[];
}> => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { migrated: false, freedBytes: 0, keysMigrated: [] };
  }

  let totalFreedChars = 0;
  const keysMigrated: string[] = [];

  for (const key of HEAVY_STORAGE_KEYS) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        // 1. Zapisz w IndexedDB
        const writeSuccess = await idbSet(key, parsed);
        if (!writeSuccess) {
          throw new Error(`idbSet returned false dla klucza "${key}"`);
        }

        // 2. Odczyt kontrolny z IndexedDB
        const readBack = await idbGet(key);
        if (readBack === null || readBack === undefined) {
          throw new Error(`Odczyt kontrolny z IndexedDB zwrócił pustą wartość dla "${key}"`);
        }

        // 3. Porównanie sumy kontrolnej JSON
        const originalJson = JSON.stringify(parsed);
        const readBackJson = JSON.stringify(readBack);
        if (originalJson !== readBackJson) {
          throw new Error(`Niezgodność danych kontrolnych po zapisie do IndexedDB dla "${key}"`);
        }

        // 4. Sukces: usuń z localStorage WYŁĄCZNIE po pełnej weryfikacji
        window.localStorage.removeItem(key);
        totalFreedChars += key.length + raw.length;
        keysMigrated.push(key);
        console.info(`[storage-migration] Pomyślnie i bezpiecznie zmigrowano "${key}" do IndexedDB.`);
      }
    } catch (e) {
      console.warn(`[storage-migration] Błąd podczas migracji klucza "${key}":`, e);
      // Przy porażce zostaw dane w localStorage i powiadom użytkownika
      notifyStorageError(
        `Ostrzeżenie: Błąd migracji bazy dla "${key}". Dane zachowano bezpiecznie w pamięci podręcznej.`
      );
    }
  }

  // Oznacz zakończenie migracji w pamięci podręcznej
  try {
    window.localStorage.setItem('multibook_migrated_to_idb_v1', 'true');
  } catch {}

  const freedBytes = totalFreedChars * 2;
  return {
    migrated: keysMigrated.length > 0,
    freedBytes,
    keysMigrated,
  };
};

const ROMAN_NUMERALS: Record<string, number> = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
  VI: 6,
  VII: 7,
  VIII: 8,
  IX: 9,
  X: 10,
};

const getGroupOrder = (groupName: string): number => {
  if (!groupName) return 999;
  if (groupName === 'Wprowadzenie') return -1;
  if (groupName.startsWith('Rozdział ')) {
    const match = groupName.match(/^Rozdział\s+([I|V|X]+)/i);
    if (match && match[1]) {
      const roman = match[1].toUpperCase();
      if (ROMAN_NUMERALS[roman] !== undefined) {
        return ROMAN_NUMERALS[roman];
      }
    }
  }
  return 999;
};

// ============================================================================
// Rozdziały i synchronizacja z domyślnym zbiorem DEFAULT_CHAPTERS
// ============================================================================
export const sortChapters = (list: Chapter[]): Chapter[] => {
  return [...list].sort((a, b) => {
    // 1. Wstęp zawsze pierwszy
    if (a.id === 'intro-multibook') return -1;
    if (b.id === 'intro-multibook') return 1;

    // 2. Przedmiot
    const subA = a.subject || '';
    const subB = b.subject || '';
    if (subA !== subB) {
      if (subA === 'Podręcznik / Instrukcja') return -1;
      if (subB === 'Podręcznik / Instrukcja') return 1;
      return subA.localeCompare(subB);
    }

    // 3. Typ szkoły
    const typeA = a.schoolType || '';
    const typeB = b.schoolType || '';
    if (typeA !== typeB) {
      return typeA.localeCompare(typeB);
    }

    // 4. Klasa
    const gradeA = a.grade || '';
    const gradeB = b.grade || '';
    if (gradeA !== gradeB) {
      return gradeA.localeCompare(gradeB);
    }

    // 5. Grupa rozdziału
    const grA = a.chapterGroup || '';
    const grB = b.chapterGroup || '';
    if (grA !== grB) {
      const ordA = getGroupOrder(grA);
      const ordB = getGroupOrder(grB);
      if (ordA !== ordB) {
        return ordA - ordB;
      }
      return grA.localeCompare(grB);
    }

    // 6. Numer lekcji
    if (a.lessonNumber !== undefined && b.lessonNumber !== undefined) {
      return a.lessonNumber - b.lessonNumber;
    }

    return (a.title || '').localeCompare(b.title || '');
  });
};

/**
 * Jednolita funkcja synchronizacji bazy rozdziałów z DEFAULT_CHAPTERS:
 * Nadpisuje nieedytowane lekcje domyślne najnowszą wersją, zachowuje lekcje edytowane przez użytkownika (userEdited: true)
 * oraz wszelkie własne rozdziały dodane przez nauczyciela.
 */
export const mergeWithDefaults = (
  storedChapters: Chapter[],
  defaults: Chapter[] = DEFAULT_CHAPTERS
): Chapter[] => {
  if (!storedChapters || storedChapters.length === 0) {
    return sortChapters(defaults);
  }

  const synced = [...storedChapters];
  defaults.forEach((defaultCh) => {
    const index = synced.findIndex((c) => c.id === defaultCh.id);
    if (index === -1) {
      synced.push(defaultCh);
    } else {
      // Jeśli lekcja była edytowana przez użytkownika, zachowaj jego treść i metadane
      if (synced[index].userEdited) {
        synced[index] = {
          ...defaultCh,
          ...synced[index],
          userEdited: true,
        };
      } else {
        // Nieedytowana przez użytkownika — zaktualizuj do najnowszej wersji z pliku kodowego
        synced[index] = {
          ...synced[index],
          ...defaultCh,
        };
      }
    }
  });

  return sortChapters(synced);
};

/**
 * Ręczna optymalizacja pamięci wywoływana z poziomu interfejsu (StorageManagerModal):
 * Przenosi wszystkie ciężkie bazy do IndexedDB i uwalnia pamięć przeglądarki.
 */
export const optimizeStorage = async (): Promise<{ freedBytes: number; formattedFreed: string }> => {
  const result = await silentMigrateToIndexedDB();
  return {
    freedBytes: result.freedBytes,
    formattedFreed: formatBytes(result.freedBytes),
  };
};

/**
 * Czyści historię odpowiedzi z quizów, zwalniając pamięć przed nową lekcją.
 */
export const clearQuizHistoryStorage = (): void => {
  safeRemove('multibook_quiz_answers');
};

// ============================================================================
// Data Normalization and Validation Functions
// ============================================================================

const cleanStringRecord = (rec: unknown): Record<string, string> => {
  if (!rec || typeof rec !== 'object') return {};
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(rec as Record<string, unknown>)) {
    if (typeof k === 'string' && typeof v === 'string') {
      result[k] = v;
    }
  }
  return result;
};

const cleanQuizAttempts = (
  raw: unknown
): Record<string, { correct: number; total: number; timestamp?: number }> => {
  if (!raw || typeof raw !== 'object') return {};
  const result: Record<string, { correct: number; total: number; timestamp?: number }> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (v && typeof v === 'object') {
      const att = v as Record<string, unknown>;
      const correct = typeof att.correct === 'number' ? att.correct : 0;
      const total = typeof att.total === 'number' && att.total > 0 ? att.total : 1;
      const timestamp = typeof att.timestamp === 'number' ? att.timestamp : undefined;
      result[k] = { correct, total, ...(timestamp ? { timestamp } : {}) };
    }
  }
  return result;
};

export const normalizeQuizQuestion = (raw: unknown): QuizQuestion | null => {
  if (!raw || typeof raw !== 'object') return null;
  const q = raw as Record<string, unknown>;
  const id = typeof q.id === 'string' && q.id.trim() ? q.id.trim() : null;
  const question = typeof q.question === 'string' && q.question.trim() ? q.question.trim() : null;
  if (!id || !question) return null;

  const rawOptions = Array.isArray(q.options) ? q.options : [];
  const options = rawOptions
    .map((o) => (typeof o === 'string' ? o.trim() : ''))
    .filter((o) => o.length > 0);
  if (options.length === 0) return null;

  let correctAnswer = typeof q.correctAnswer === 'number' ? Math.floor(q.correctAnswer) : 0;
  if (correctAnswer < 0 || correctAnswer >= options.length) {
    correctAnswer = 0;
  }

  const explanation =
    typeof q.explanation === 'string' && q.explanation.trim() ? q.explanation.trim() : undefined;

  return {
    id,
    question,
    options,
    correctAnswer,
    ...(explanation ? { explanation } : {})
  };
};

/**
 * Normalizes a chapter object. Rejects items missing id, title, or content.
 * Fills in default values for missing optional fields.
 */
export const normalizeChapter = (raw: unknown): Chapter | null => {
  if (!raw || typeof raw !== 'object') return null;
  const ch = raw as Record<string, unknown>;

  const id = typeof ch.id === 'string' && ch.id.trim() ? ch.id.trim() : null;
  const title = typeof ch.title === 'string' && ch.title.trim() ? ch.title.trim() : null;
  const content = typeof ch.content === 'string' && ch.content.trim() ? ch.content.trim() : null;

  // Strict requirement: reject elements without id, title, or content
  if (!id || !title || !content) {
    return null;
  }

  const subject =
    typeof ch.subject === 'string' && ch.subject.trim() ? ch.subject.trim() : 'Ogólny';
  const schoolType =
    typeof ch.schoolType === 'string' && ch.schoolType.trim()
      ? ch.schoolType.trim()
      : 'Szkoła Podstawowa';
  const grade = typeof ch.grade === 'string' && ch.grade.trim() ? ch.grade.trim() : 'Klasa 1';
  const chapterGroup =
    typeof ch.chapterGroup === 'string' && ch.chapterGroup.trim()
      ? ch.chapterGroup.trim()
      : subject;
  const educationLevel =
    typeof ch.educationLevel === 'string' && ch.educationLevel.trim()
      ? ch.educationLevel.trim()
      : 'Ogólny';

  const estimatedReadTime =
    typeof ch.estimatedReadTime === 'number' && ch.estimatedReadTime > 0
      ? ch.estimatedReadTime
      : Math.max(1, Math.ceil(content.length / 800));

  const isDefault = Boolean(ch.isDefault);
  const isProtected = Boolean(ch.isProtected);
  const userEdited = Boolean(ch.userEdited);

  const createdAt =
    typeof ch.createdAt === 'number' && Number.isFinite(ch.createdAt) ? ch.createdAt : Date.now();

  const lessonNumber =
    typeof ch.lessonNumber === 'number' && Number.isFinite(ch.lessonNumber)
      ? ch.lessonNumber
      : undefined;

  let quizzes: QuizQuestion[] | undefined = undefined;
  if (Array.isArray(ch.quizzes)) {
    const validQuizzes = ch.quizzes
      .map(normalizeQuizQuestion)
      .filter((q): q is QuizQuestion => q !== null);
    if (validQuizzes.length > 0) {
      quizzes = validQuizzes;
    }
  }

  return {
    id,
    title,
    content,
    subject,
    schoolType,
    grade,
    chapterGroup,
    educationLevel,
    estimatedReadTime,
    isDefault,
    isProtected,
    userEdited,
    createdAt,
    quizzes,
    lessonNumber
  };
};

/**
 * Normalizes user progress object. Ensures valid arrays and records.
 */
export const normalizeProgress = (raw: unknown): StudentProgress => {
  if (!raw || typeof raw !== 'object') {
    return {
      completedChapters: [],
      bookmarkedChapters: [],
      chapterNotes: {},
      quizAttempts: {}
    };
  }
  const p = raw as Record<string, unknown>;

  const completedChapters = Array.isArray(p.completedChapters)
    ? p.completedChapters.filter((id): id is string => typeof id === 'string' && id.trim().length > 0)
    : [];

  const bookmarkedChapters = Array.isArray(p.bookmarkedChapters)
    ? p.bookmarkedChapters.filter((id): id is string => typeof id === 'string' && id.trim().length > 0)
    : [];

  const chapterNotes = cleanStringRecord(p.chapterNotes);
  const quizAttempts = cleanQuizAttempts(p.quizAttempts);

  return {
    completedChapters,
    bookmarkedChapters,
    chapterNotes,
    quizAttempts
  };
};

/**
 * Normalizes a student profile. Rejects students without id or name.
 */
export const normalizeStudent = (raw: unknown): Student | null => {
  if (!raw || typeof raw !== 'object') return null;
  const s = raw as Record<string, unknown>;

  const id = typeof s.id === 'string' && s.id.trim() ? s.id.trim() : null;
  const name = typeof s.name === 'string' && s.name.trim() ? s.name.trim() : null;

  if (!id || !name) return null;

  const className =
    typeof s.className === 'string' && s.className.trim() ? s.className.trim() : 'Klasa 1A';

  const completedChapters = Array.isArray(s.completedChapters)
    ? s.completedChapters.filter((c): c is string => typeof c === 'string' && c.trim().length > 0)
    : [];

  const bookmarkedChapters = Array.isArray(s.bookmarkedChapters)
    ? s.bookmarkedChapters.filter((c): c is string => typeof c === 'string' && c.trim().length > 0)
    : [];

  const chapterNotes = cleanStringRecord(s.chapterNotes);
  const quizAttempts = cleanQuizAttempts(s.quizAttempts);

  const teacherRemarks =
    typeof s.teacherRemarks === 'string' ? s.teacherRemarks : undefined;

  return {
    id,
    name,
    className,
    completedChapters,
    bookmarkedChapters,
    chapterNotes,
    quizAttempts,
    teacherRemarks
  };
};

export interface LessonRealization {
  className: string;
  chapterId: string;
  timestamp: number;
}

/**
 * Normalizuje pojedynczy wpis realizacji lekcji w kalendarzu.
 */
export const normalizeRealization = (raw: unknown): LessonRealization | null => {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const className = typeof r.className === 'string' && r.className.trim() ? r.className.trim() : null;
  const chapterId = typeof r.chapterId === 'string' && r.chapterId.trim() ? r.chapterId.trim() : null;
  const timestamp = typeof r.timestamp === 'number' && Number.isFinite(r.timestamp) && r.timestamp > 0 ? r.timestamp : null;
  if (!className || !chapterId || !timestamp) return null;
  return { className, chapterId, timestamp };
};

/**
 * Normalizuje tablicę realizacji lekcji w kalendarzu.
 */
export const normalizeRealizations = (raw: unknown): LessonRealization[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeRealization).filter((r): r is LessonRealization => r !== null);
};

/**
 * Normalizuje mapę przypisania rozdziałów do klas (klasa -> lista ID lekcji).
 */
export const normalizeClassChapters = (raw: unknown): Record<string, string[]> => {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const result: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const cleanKey = typeof k === 'string' ? k.trim() : '';
    if (!cleanKey) continue;
    if (Array.isArray(v)) {
      result[cleanKey] = v
        .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        .map((item) => item.trim());
    }
  }
  return result;
};

/**
 * Normalizuje galerię zdjęć użytkownika (ID rozdziału -> lista URL zdjęć).
 */
export const normalizeGallery = (raw: unknown): Record<string, string[]> => {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const result: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const cleanKey = typeof k === 'string' ? k.trim() : '';
    if (!cleanKey) continue;
    if (Array.isArray(v)) {
      result[cleanKey] = v
        .filter((url): url is string => typeof url === 'string' && url.trim().length > 0)
        .map((url) => url.trim());
    }
  }
  return result;
};

