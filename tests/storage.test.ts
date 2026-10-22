// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import 'fake-indexeddb/auto';
import {
  getIDB,
  idbSet,
  idbGet,
  idbDelete,
  resetIDB,
  silentMigrateToIndexedDB,
  onStorageError,
  mergeWithDefaults,
  normalizeChapter,
  normalizeProgress,
  normalizeStudent,
  normalizeRealization,
  normalizeRealizations,
  normalizeClassChapters,
  normalizeGallery,
  safeGetAsync
} from '../src/storage';
import { Chapter } from '../src/types';

describe('IndexedDB Storage Layer (storage.ts)', () => {
  beforeEach(() => {
    resetIDB();
    localStorage.clear();
  });

  afterEach(() => {
    resetIDB();
    vi.restoreAllMocks();
  });

  it('zwraca błąd / odrzuca Promise gdy brak window.indexedDB', async () => {
    const originalIDB = window.indexedDB;
    // Symulacja braku wsparcia IndexedDB
    Object.defineProperty(window, 'indexedDB', { value: undefined, configurable: true, writable: true });
    resetIDB();

    await expect(idbSet('key_no_idb', { test: 123 })).rejects.toThrow();

    // Przywróć IndexedDB
    Object.defineProperty(window, 'indexedDB', { value: originalIDB, configurable: true, writable: true });
    resetIDB();
  });

  it('poprawnie zapisuje i odczytuje dane w IndexedDB (sukces)', async () => {
    const testData = { title: 'Lekcja testowa', chaptersCount: 42 };
    const success = await idbSet('test_success_key', testData);
    expect(success).toBe(true);

    const retrieved = await idbGet<typeof testData>('test_success_key');
    expect(retrieved).toEqual(testData);

    const deleted = await idbDelete('test_success_key');
    expect(deleted).toBe(true);

    const afterDelete = await idbGet('test_success_key');
    expect(afterDelete).toBeNull();
  });

  it('odrzuca Promise gdy operacja put zgłosi błąd (błąd put)', async () => {
    const db = await getIDB();
    vi.spyOn(db, 'transaction').mockImplementation(() => {
      throw new DOMException('Simulated quota exceeded during write', 'QuotaExceededError');
    });

    await expect(idbSet('error_key', { failed: true })).rejects.toThrow();
  });

  it('silentMigrateToIndexedDB usuwa klucz z localStorage WYŁĄCZNIE po udanym zapisie i weryfikacji', async () => {
    const chaptersData = [{ id: 'ch-1', title: 'Lekcja 1', content: 'Tekst' }];
    localStorage.setItem('multibook_chapters', JSON.stringify(chaptersData));

    const result = await silentMigrateToIndexedDB();
    expect(result.migrated).toBe(true);
    expect(result.keysMigrated).toContain('multibook_chapters');

    // Zweryfikuj, że dane są w IndexedDB
    const fromIDB = await idbGet('multibook_chapters');
    expect(fromIDB).toEqual(chaptersData);

    // Zweryfikuj, że klucz został usunięty z localStorage po udanej weryfikacji
    expect(localStorage.getItem('multibook_chapters')).toBeNull();
  });

  it('silentMigrateToIndexedDB pozostawia dane w localStorage w przypadku błędu zapisu', async () => {
    const errorListener = vi.fn();
    const unsub = onStorageError(errorListener);

    const progressData = { completedChapters: ['ch-1'], chapterNotes: {} };
    localStorage.setItem('multibook_progress', JSON.stringify(progressData));

    // Symulacja błędu IndexedDB (brak lub awaria)
    Object.defineProperty(window, 'indexedDB', { value: undefined, configurable: true, writable: true });
    resetIDB();

    const result = await silentMigrateToIndexedDB();
    expect(result.keysMigrated).not.toContain('multibook_progress');

    // Klucz MUSI pozostać w localStorage w razie błędu!
    expect(localStorage.getItem('multibook_progress')).not.toBeNull();
    expect(errorListener).toHaveBeenCalled();

    unsub();
  });
});

describe('mergeWithDefaults', () => {
  const sampleDefaults: Chapter[] = [
    {
      id: 'chap-1',
      title: 'Domyślna lekcja 1',
      content: 'Oryginalna treść',
      subject: 'Biologia',
      estimatedReadTime: 3,
      createdAt: 1000
    },
    {
      id: 'chap-2',
      title: 'Domyślna lekcja 2',
      content: 'Treść lekcji 2',
      subject: 'Biologia',
      estimatedReadTime: 4,
      createdAt: 1000
    }
  ];

  it('zwraca posortowane domyślne rozdziały gdy zapisane dane są puste', () => {
    const result = mergeWithDefaults([], sampleDefaults);
    expect(result.length).toBe(2);
    expect(result.map(c => c.id)).toContain('chap-1');
  });

  it('zachowuje lekcję edytowaną przez użytkownika (userEdited: true)', () => {
    const stored: Chapter[] = [
      {
        id: 'chap-1',
        title: 'Zmodyfikowany tytuł przez nauczyciela',
        content: 'Moja autorska treść lekcji',
        subject: 'Biologia',
        userEdited: true,
        estimatedReadTime: 10,
        createdAt: 2000
      }
    ];

    const result = mergeWithDefaults(stored, sampleDefaults);
    const updatedChap1 = result.find(c => c.id === 'chap-1');
    expect(updatedChap1).toBeDefined();
    expect(updatedChap1?.title).toBe('Zmodyfikowany tytuł przez nauczyciela');
    expect(updatedChap1?.content).toBe('Moja autorska treść lekcji');
    expect(updatedChap1?.userEdited).toBe(true);

    // Domyślna lekcja 2 powinna zostać dołączona
    const chap2 = result.find(c => c.id === 'chap-2');
    expect(chap2).toBeDefined();
    expect(chap2?.title).toBe('Domyślna lekcja 2');
  });

  it('aktualizuje nieedytowaną lekcję domyślną do najnowszej wersji z pliku', () => {
    const stored: Chapter[] = [
      {
        id: 'chap-1',
        title: 'Stara wersja domyślna',
        content: 'Stara treść',
        subject: 'Biologia',
        estimatedReadTime: 1,
        createdAt: 500
        // userEdited brak lub false
      }
    ];

    const result = mergeWithDefaults(stored, sampleDefaults);
    const updatedChap1 = result.find(c => c.id === 'chap-1');
    expect(updatedChap1?.title).toBe('Domyślna lekcja 1');
    expect(updatedChap1?.content).toBe('Oryginalna treść');
  });

  it('zachowuje w pełni autorskie rozdziały nauczyciela spoza defaults', () => {
    const stored: Chapter[] = [
      {
        id: 'custom-teacher-lesson',
        title: 'Ekologia w naszej szkole',
        content: 'Projekt ekologiczny',
        subject: 'Biologia',
        estimatedReadTime: 5,
        createdAt: 3000
      }
    ];

    const result = mergeWithDefaults(stored, sampleDefaults);
    expect(result.some(c => c.id === 'custom-teacher-lesson')).toBe(true);
    expect(result.length).toBe(3);
  });
});

describe('Normalizatory danych (storage.ts)', () => {
  it('normalizeChapter: odrzuca obiekty bez id, title lub content i uzupełnia brakujące pola', () => {
    expect(normalizeChapter(null)).toBeNull();
    expect(normalizeChapter({})).toBeNull();
    expect(normalizeChapter({ id: 'ch-1' })).toBeNull();
    expect(normalizeChapter({ id: 'ch-1', title: 'Tytuł' })).toBeNull();

    const validRaw = {
      id: 'ch-ok',
      title: 'Lekcja poprawna',
      content: 'Dłuższa treść do nauki...',
      lessonNumber: 1
    };

    const normalized = normalizeChapter(validRaw);
    expect(normalized).not.toBeNull();
    expect(normalized?.id).toBe('ch-ok');
    expect(normalized?.subject).toBe('Ogólny');
    expect(normalized?.schoolType).toBe('Szkoła Podstawowa');
    expect(normalized?.grade).toBe('Klasa 1');
    expect(normalized?.estimatedReadTime).toBeGreaterThanOrEqual(1);
  });

  it('normalizeProgress: naprawia brakujące lub uszkodzone pola postępu', () => {
    const corrupt = {
      completedChapters: 'nie tablica',
      bookmarkedChapters: [123, null, 'ch-1', '  '],
      chapterNotes: { 'ch-1': 'Notatka', 'ch-2': 456 },
      quizAttempts: { 'ch-1': { correct: 'dwa', total: -1 } }
    };

    const norm = normalizeProgress(corrupt);
    expect(Array.isArray(norm.completedChapters)).toBe(true);
    expect(norm.completedChapters).toEqual([]);
    expect(norm.bookmarkedChapters).toEqual(['ch-1']);
    expect(norm.chapterNotes).toEqual({ 'ch-1': 'Notatka' });
    expect(norm.quizAttempts?.['ch-1']).toEqual({ correct: 0, total: 1 });
  });

  it('normalizeStudent: odrzuca wpisy bez id lub name i normalizuje listy', () => {
    expect(normalizeStudent(null)).toBeNull();
    expect(normalizeStudent({ id: 's-1' })).toBeNull();
    expect(normalizeStudent({ name: 'Jan Kowalski' })).toBeNull();

    const validStudent = {
      id: 's-1',
      name: 'Anna Nowak',
      className: 'Klasa 4A',
      completedChapters: ['ch-1', 456],
      chapterNotes: { 'ch-1': 'Notatka uczennicy' },
      quizAttempts: { 'ch-1': { correct: 3, total: 4 } }
    };

    const norm = normalizeStudent(validStudent);
    expect(norm).not.toBeNull();
    expect(norm?.name).toBe('Anna Nowak');
    expect(norm?.completedChapters).toEqual(['ch-1']);
  });

  it('normalizeRealization i normalizeRealizations: filtrują niepoprawne wpisy', () => {
    expect(normalizeRealization(null)).toBeNull();
    expect(normalizeRealization({ className: '4A' })).toBeNull();
    expect(normalizeRealization({ className: '4A', chapterId: 'ch-1', timestamp: -5 })).toBeNull();

    const valid = { className: 'Klasa 4A', chapterId: 'ch-1', timestamp: 1700000000 };
    expect(normalizeRealization(valid)).toEqual(valid);

    const list = [valid, null, { className: 'Bad' }, { className: '4B', chapterId: 'ch-2', timestamp: 1700000500 }];
    const normList = normalizeRealizations(list);
    expect(normList.length).toBe(2);
  });

  it('normalizeClassChapters i normalizeGallery: normalizują mapy danych', () => {
    const rawClassCh = {
      'Klasa 4A': ['ch-1', 123, '  ch-2  '],
      '': ['ch-invalid'],
      'Klasa 5B': null
    };
    const normClassCh = normalizeClassChapters(rawClassCh);
    expect(normClassCh['Klasa 4A']).toEqual(['ch-1', 'ch-2']);
    expect(normClassCh['']).toBeUndefined();

    const rawGallery = {
      'ch-1': ['https://example.com/photo.jpg', 999, '  https://example.com/2.png  ']
    };
    const normGal = normalizeGallery(rawGallery);
    expect(normGal['ch-1']).toEqual(['https://example.com/photo.jpg', 'https://example.com/2.png']);
  });
});

describe('Odporność na uszkodzone dane i import backupu', () => {
  it('safeGetAsync: przy uszkodzonym IndexedDB sięga po kopię z localStorage', async () => {
    // Symulacja: w localStorage jest nowsza kopia awaryjna
    const emergencyChapters = [{ id: 'ch-saved', title: 'Lekcja z awaryjnego zapisu', content: 'Treść' }];
    localStorage.setItem('multibook_chapters', JSON.stringify(emergencyChapters));
    localStorage.setItem('_ts_ls_multibook_chapters', String(Date.now()));

    // Symulacja błędu IndexedDB
    Object.defineProperty(window, 'indexedDB', { value: undefined, configurable: true, writable: true });
    resetIDB();

    const result = await safeGetAsync('multibook_chapters', [], (raw) => {
      if (!Array.isArray(raw)) return null;
      return raw.map(normalizeChapter).filter((c): c is Chapter => c !== null);
    });

    expect(result.length).toBe(1);
    expect(result[0].id).toBe('ch-saved');
  });

  it('bezpiecznie przetwarza niekompletny backup z brakującymi polami', () => {
    const partialBackup = {
      version: '1.0',
      // brak students, brak realizations, brak settings
      chapters: [
        { id: 'ch-backup-1', title: 'Backup 1', content: 'Treść 1' }
      ],
      progress: {
        completedChapters: ['ch-backup-1']
      }
    };

    const normChapters = (partialBackup.chapters || []).map(normalizeChapter).filter(Boolean);
    const normProgress = normalizeProgress(partialBackup.progress);
    const normRealizations = normalizeRealizations((partialBackup as any).realizations);
    const normGallery = normalizeGallery((partialBackup as any).chapterGalleryImages);

    expect(normChapters.length).toBe(1);
    expect(normProgress.completedChapters).toEqual(['ch-backup-1']);
    expect(normRealizations).toEqual([]);
    expect(normGallery).toEqual({});
  });
});
