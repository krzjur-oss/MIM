import { Chapter, StudentProgress, Student, QuizQuestion } from './types';

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
// IndexedDB Persistence Layer (for chapters and gallery images)
// ============================================================================
const DB_NAME = 'mim_multibook_idb';
const DB_VERSION = 1;
const STORE_NAME = 'keyval';

let dbPromise: Promise<IDBDatabase> | null = null;

const getIDB = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise;
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.reject(new Error('IndexedDB not supported in this environment'));
  }
  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
};

export const idbSet = async (key: string, value: unknown): Promise<void> => {
  try {
    const db = await getIDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('[storage] IndexedDB put warning for key:', key, e);
  }
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

export const idbDelete = async (key: string): Promise<void> => {
  try {
    const db = await getIDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('[storage] IndexedDB delete warning for key:', key, e);
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
  multibook_terms_and_license_accepted_v1: 'Zgoda licencyjna i regulamin',
};

export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const getStorageMetrics = (): StorageMetrics => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return {
      usedBytes: 0,
      formattedUsed: '0 KB',
      estimatedQuotaBytes: 5 * 1024 * 1024,
      formattedQuota: '5.0 MB',
      usagePercent: 0,
      isNearQuota: false,
      hasQuotaExceeded: false,
      items: [],
      hasIndexedDB: typeof window !== 'undefined' && !!window.indexedDB,
    };
  }

  let totalChars = 0;
  const items: StorageItemMetric[] = [];

  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key) continue;
      const val = window.localStorage.getItem(key) || '';
      // In JS strings, each UTF-16 character occupies 2 bytes in browser storage memory
      const itemBytes = (key.length + val.length) * 2;
      totalChars += key.length + val.length;

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

  items.sort((a, b) => b.bytes - a.bytes);

  const usedBytes = totalChars * 2;
  const estimatedQuotaBytes = 5 * 1024 * 1024; // 5 MB typical DOMStorage limit on Android
  const usagePercent = Math.min(100, Math.round((usedBytes / estimatedQuotaBytes) * 100));

  return {
    usedBytes,
    formattedUsed: formatBytes(usedBytes),
    estimatedQuotaBytes,
    formattedQuota: '5.0 MB',
    usagePercent,
    isNearQuota: usagePercent >= 70,
    hasQuotaExceeded: usagePercent >= 98,
    items,
    hasIndexedDB: typeof window !== 'undefined' && !!window.indexedDB,
  };
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

/**
 * Asynchroniczny odczyt danych: sprawdza najpierw wysokopojemną bazę IndexedDB,
 * a w przypadku jej braku (np. przed migracją) sięga po fallback do localStorage.
 */
export const safeGetAsync = async <T>(
  key: string,
  defaultValue: T,
  validator?: (val: unknown) => T | null
): Promise<T> => {
  try {
    const idbVal = await idbGet<T>(key);
    if (idbVal !== null && idbVal !== undefined) {
      if (validator) {
        const validated = validator(idbVal);
        if (validated !== null) return validated;
      } else {
        return idbVal;
      }
    }
  } catch (e) {
    console.warn(`[storage] Ostrzeżenie przy asynchronicznym odczycie IndexedDB dla "${key}":`, e);
  }

  return safeGet(key, defaultValue, validator);
};

// Debounced write queue for high-frequency state changes (e.g. typing, drawing, rapid progress updates)
const pendingIDBWrites = new Map<string, { timer: ReturnType<typeof setTimeout>; value: unknown }>();

export const idbSetDebounced = (key: string, value: unknown, delayMs: number = 300): void => {
  const existing = pendingIDBWrites.get(key);
  if (existing) {
    clearTimeout(existing.timer);
  }
  const timer = setTimeout(() => {
    pendingIDBWrites.delete(key);
    idbSet(key, value).catch((err) => {
      console.warn(`[storage] Błąd debounced zapisu IndexedDB dla "${key}":`, err);
    });
  }, delayMs);
  pendingIDBWrites.set(key, { timer, value });
};

export const flushPendingWrites = async (): Promise<void> => {
  const promises: Promise<void>[] = [];
  pendingIDBWrites.forEach((item, key) => {
    clearTimeout(item.timer);
    promises.push(idbSet(key, item.value));
  });
  pendingIDBWrites.clear();
  await Promise.all(promises);
};

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    void flushPendingWrites();
  });
}

/**
 * Główna funkcja zapisu danych:
 * - Ciężkie bazy danych (rozdziały, postępy, zdjęcia, quizy, uczniowie) zapisuje bezpośrednio do IndexedDB (100% offline, brak limitu 5MB).
 * - Stosuje buforowanie zapisu (debouncing), by odciążyć pamięć flash i procesor na tabletach/tablicach.
 * - Usuwa je jednocześnie z localStorage, aby wyeliminować błędy QuotaExceededError na ekranach Android i tabletach.
 * - Lekkie ustawienia interfejsu (motyw, rozmiar czcionki) zapisuje w localStorage dla natychmiastowego startu bez migotania.
 */
export const safeSet = <T>(key: string, value: T): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  // 1. Obszerne zbiory danych edukacyjnych -> buforowany zapis do IndexedDB
  if (isHeavyKey(key)) {
    idbSetDebounced(key, value, 250);

    // Uwalniamy ciasny localStorage z ciężkich danych
    if (window.localStorage) {
      try {
        if (window.localStorage.getItem(key)) {
          window.localStorage.removeItem(key);
        }
      } catch {}
    }
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
 * Przenosi dotychczasowe dane z ciasnego localStorage (limit 5MB) do bazy IndexedDB (brak limitu)
 * i natychmiast czyści stary localStorage, trwale eliminując komunikaty o przepełnionej pamięci.
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
        // Bezpiecznie zapisz w IndexedDB
        await idbSet(key, parsed);
        // Zwolnij z localStorage
        window.localStorage.removeItem(key);
        totalFreedChars += key.length + raw.length;
        keysMigrated.push(key);
        console.info(`[storage-migration] Pomyślnie zmigrowano "${key}" do IndexedDB i zwolniono localStorage.`);
      }
    } catch (e) {
      console.warn(`[storage-migration] Błąd podczas migracji klucza "${key}":`, e);
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
