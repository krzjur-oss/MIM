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
// Safe LocalStorage Get / Set / Remove
// ============================================================================

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

export const safeSet = <T>(key: string, value: T): boolean => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);

    // Also persist large datasets to IndexedDB asynchronously as an offline mirror/backup
    if (key === 'multibook_chapters' || key === 'multibook_chapter_gallery_images') {
      idbSet(key, value).catch(() => {});
    }
    return true;
  } catch (e) {
    if (isQuotaExceeded(e)) {
      console.error(`[storage] QuotaExceededError dla klucza "${key}":`, e);
      notifyStorageError('Brak miejsca w pamięci przeglądarki, wykonaj kopię zapasową');
      // Attempt to save exclusively to IndexedDB if localStorage quota exceeded
      idbSet(key, value).catch(() => {});
    } else {
      console.error(`[storage] Błąd zapisu klucza "${key}" do localStorage:`, e);
    }
    return false;
  }
};

export const safeRemove = (key: string): void => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.removeItem(key);
    idbDelete(key).catch(() => {});
  } catch (e) {
    console.warn(`[storage] Błąd usuwania klucza "${key}":`, e);
  }
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
