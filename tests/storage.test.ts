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
  onStorageError
} from '../src/storage';

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
