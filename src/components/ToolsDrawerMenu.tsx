import React from 'react';
import {
  X,
  Tv,
  FileText,
  Maximize2,
  Minimize2,
  HelpCircle,
  Plus,
  Edit3,
  Download,
  Upload,
  Database,
  ShieldCheck,
  RotateCcw,
  Check,
  Wrench,
  Eye,
  Settings,
  HardDrive
} from 'lucide-react';
import { ThemeType } from '../types';
import { useFocusTrap } from '../hooks/useFocusTrap';

export interface ToolsDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  // Section 1: Narzędzia dydaktyczne
  isDrawingModeActive: boolean;
  onToggleDrawing: () => void;
  isNotesOpen: boolean;
  onToggleNotes: () => void;
  isContentFullscreen: boolean;
  onToggleFullscreen: () => void;
  hasQuiz: boolean;
  showQuiz: boolean;
  onToggleQuiz: () => void;
  // Section 2: Czytnik i dostępność
  fontSize: number;
  onSetFontSize: (val: number | ((prev: number) => number)) => void;
  lineHeight: 'normal' | 'relaxed' | 'loose';
  onSetLineHeight: (val: 'normal' | 'relaxed' | 'loose') => void;
  theme: ThemeType;
  onSetTheme: (thm: ThemeType) => void;
  // Section 3: Dane i lekcje
  onAddNewChapter: () => void;
  onEditCurrentChapter: () => void;
  isChapterEditable: boolean;
  onExportBackup: () => void;
  onImportBackup: () => void;
  onOpenStorageManager: () => void;
  // Section 4: System i pomoc
  onOpenTerms: () => void;
  onResetDatabase: () => void;
}

export const ToolsDrawerMenu: React.FC<ToolsDrawerMenuProps> = ({
  isOpen,
  onClose,
  isDrawingModeActive,
  onToggleDrawing,
  isNotesOpen,
  onToggleNotes,
  isContentFullscreen,
  onToggleFullscreen,
  hasQuiz,
  showQuiz,
  onToggleQuiz,
  fontSize,
  onSetFontSize,
  lineHeight,
  onSetLineHeight,
  theme,
  onSetTheme,
  onAddNewChapter,
  onEditCurrentChapter,
  isChapterEditable,
  onExportBackup,
  onImportBackup,
  onOpenStorageManager,
  onOpenTerms,
  onResetDatabase,
}) => {
  const containerRef = useFocusTrap<HTMLDivElement>({
    isOpen,
    onEscape: onClose,
  });

  if (!isOpen) return null;

  const themesList: { id: ThemeType; label: string; desc: string; previewClass: string }[] = [
    { id: 'light', label: 'Jasny', desc: 'Dzienny podręcznik (AAA)', previewClass: 'bg-white border-slate-300 text-slate-900' },
    { id: 'dark', label: 'Ciemny', desc: 'Wyciszający nocny (AAA)', previewClass: 'bg-slate-900 border-slate-700 text-slate-100' },
    { id: 'board', label: 'Tablica', desc: 'Ekran szkolny & projektor', previewClass: 'bg-[#041f14] border-emerald-500 text-white' },
    { id: 'sepia', label: 'Sepia', desc: 'Ciepły pergamin do czytania', previewClass: 'bg-[#f4ecdf] border-[#cabaa3] text-stone-900' },
    { id: 'blue', label: 'Arktyczny', desc: 'Chłodny błękit i stal', previewClass: 'bg-[#101c2e] border-sky-400 text-sky-100' },
    { id: 'dyslexic', label: 'Dysleksja', desc: 'Krem bezodblaskowy (AAA)', previewClass: 'bg-[#fffde8] border-amber-300 text-stone-900' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tools-menu-title"
        className="w-full sm:w-[440px] max-w-full h-full bg-[var(--bg-surface)] text-[var(--text-primary)] border-l border-[var(--border-subtle)] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Drawer */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface-elevated)] shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[var(--accent-subtle)] text-[var(--accent-primary)] rounded-xl border border-[var(--accent-border)]">
              <Settings className="w-5 h-5" />
            </span>
            <div>
              <h2 id="tools-menu-title" className="text-base font-bold font-serif tracking-tight">
                Menu Narzędzi & Ustawienia
              </h2>
              <p className="text-[11px] text-[var(--text-muted)] font-medium">
                Szybka konfiguracja, czytnik i administracja
              </p>
            </div>
          </div>
          <button
            id="close-tools-drawer-btn"
            aria-label="Zamknij menu narzędzi"
            onClick={onClose}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] rounded-xl transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body with 4 Sections */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* SEKCJA 1: NARZĘDZIA DYDAKTYCZNE */}
          <section className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>1. Narzędzia Dydaktyczne</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                id="drawer-toggle-whiteboard-btn"
                aria-label={isDrawingModeActive ? 'Wyłącz szkicownik na żywo' : 'Włącz szkicownik na żywo'}
                onClick={() => {
                  onToggleDrawing();
                  onClose();
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer min-h-[48px] flex flex-col justify-between ${
                  isDrawingModeActive
                    ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                    : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Tv className="w-4 h-4 shrink-0" />
                  {isDrawingModeActive && <span className="text-[9px] font-extrabold uppercase tracking-wide bg-rose-700/60 px-1.5 py-0.5 rounded-sm">Wł.</span>}
                </div>
                <div>
                  <span className="font-bold text-xs block">Tablica-Szkicownik</span>
                  <span className={`text-[10px] block opacity-80 ${isDrawingModeActive ? 'text-rose-100' : 'text-[var(--text-muted)]'}`}>
                    Rysowanie po lekcji
                  </span>
                </div>
              </button>

              <button
                id="drawer-toggle-notes-btn"
                aria-label={isNotesOpen ? 'Zamknij dziennik i notatki' : 'Otwórz dziennik i notatki'}
                onClick={() => {
                  onToggleNotes();
                  onClose();
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer min-h-[48px] flex flex-col justify-between ${
                  isNotesOpen
                    ? 'bg-[var(--accent-primary)] text-[var(--accent-contrast)] border-[var(--accent-primary)] shadow-xs'
                    : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <FileText className="w-4 h-4 shrink-0" />
                  {isNotesOpen && <span className="text-[9px] font-extrabold uppercase tracking-wide bg-black/20 px-1.5 py-0.5 rounded-sm">Otwarte</span>}
                </div>
                <div>
                  <span className="font-bold text-xs block">Dziennik & Notatki</span>
                  <span className={`text-[10px] block opacity-80 ${isNotesOpen ? 'text-emerald-100' : 'text-[var(--text-muted)]'}`}>
                    Notatki i realizacja
                  </span>
                </div>
              </button>

              <button
                id="drawer-toggle-fullscreen-btn"
                aria-label={isContentFullscreen ? 'Opuść pełny ekran' : 'Włącz tryb pełnoekranowy'}
                onClick={() => {
                  onToggleFullscreen();
                  onClose();
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer min-h-[48px] flex flex-col justify-between ${
                  isContentFullscreen
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                    : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  {isContentFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </div>
                <div>
                  <span className="font-bold text-xs block">Pełny Ekran Focus</span>
                  <span className="text-[10px] block opacity-80 text-[var(--text-muted)]">
                    Maksymalne skupienie
                  </span>
                </div>
              </button>

              {hasQuiz && (
                <button
                  id="drawer-toggle-quiz-btn"
                  aria-label={showQuiz ? 'Wróć do tekstu lekcji' : 'Rozpocznij quiz sprawdzający'}
                  onClick={() => {
                    onToggleQuiz();
                    onClose();
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer min-h-[48px] flex flex-col justify-between ${
                    showQuiz
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                      : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <HelpCircle className="w-4 h-4" />
                    {showQuiz && <span className="text-[9px] font-extrabold uppercase tracking-wide bg-amber-800/60 px-1.5 py-0.5 rounded-sm">Quiz</span>}
                  </div>
                  <div>
                    <span className="font-bold text-xs block">Quiz Sprawdzający</span>
                    <span className="text-[10px] block opacity-80 text-[var(--text-muted)]">
                      Test wiedzy ucznia
                    </span>
                  </div>
                </button>
              )}
            </div>
          </section>

          {/* SEKCJA 2: CZYTNIK I DOSTĘPNOŚĆ */}
          <section className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>2. Czytnik i Dostępność</span>
            </h3>

            {/* Font Size Scaling */}
            <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[var(--text-primary)]">Rozmiar czcionki:</span>
                <span className="font-mono font-bold text-[var(--accent-primary)]">{fontSize}%</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="drawer-font-decrease-btn"
                  aria-label="Zmniejsz rozmiar tekstu"
                  onClick={() => onSetFontSize((p) => Math.max(80, p - 5))}
                  disabled={fontSize <= 80}
                  className="flex-1 py-2 rounded-xl border border-[var(--border-subtle)] text-xs font-bold hover:bg-[var(--bg-surface-subtle)] disabled:opacity-40 cursor-pointer min-h-[44px]"
                >
                  A- (Mniejszy)
                </button>
                <button
                  id="drawer-font-reset-btn"
                  aria-label="Przywróć domyślny rozmiar tekstu 105%"
                  onClick={() => onSetFontSize(105)}
                  className="px-3 py-2 rounded-xl border border-[var(--border-subtle)] text-xs font-semibold hover:bg-[var(--bg-surface-subtle)] cursor-pointer min-h-[44px]"
                >
                  105%
                </button>
                <button
                  id="drawer-font-increase-btn"
                  aria-label="Zwiększ rozmiar tekstu"
                  onClick={() => onSetFontSize((p) => Math.min(160, p + 5))}
                  disabled={fontSize >= 160}
                  className="flex-1 py-2 rounded-xl border border-[var(--border-subtle)] text-xs font-bold hover:bg-[var(--bg-surface-subtle)] disabled:opacity-40 cursor-pointer min-h-[44px]"
                >
                  A+ (Większy)
                </button>
              </div>
            </div>

            {/* Line Height Selector */}
            <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-2">
              <span className="text-xs font-bold block text-[var(--text-primary)]">Interlinia (odstępy między wierszami):</span>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[var(--tab-group-bg)] border border-[var(--border-subtle)]">
                {(['normal', 'relaxed', 'loose'] as const).map((lh) => {
                  const labels = { normal: 'Zwykła', relaxed: 'Luźna', loose: 'Szeroka' };
                  const isCur = lineHeight === lh;
                  return (
                    <button
                      key={lh}
                      id={`drawer-lh-${lh}-btn`}
                      aria-label={`Ustaw interlinię: ${labels[lh]}`}
                      onClick={() => onSetLineHeight(lh)}
                      className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer min-h-[40px] ${
                        isCur
                          ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {labels[lh]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme Selector Palette */}
            <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-2.5">
              <span className="text-xs font-bold block text-[var(--text-primary)]">
                Paleta barw & Kontrast WCAG AAA:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {themesList.map((t) => {
                  const isCur = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      id={`drawer-theme-${t.id}-btn`}
                      aria-label={`Aktywuj motyw: ${t.label} (${t.desc})`}
                      onClick={() => onSetTheme(t.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 min-h-[48px] ${
                        isCur
                          ? 'ring-2 ring-[var(--accent-primary)] border-[var(--accent-primary)] bg-[var(--accent-subtle)]'
                          : 'border-[var(--border-subtle)] hover:border-[var(--border-strong)] bg-[var(--bg-surface)]'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center text-[10px] font-bold ${t.previewClass}`}>
                        {isCur && <Check className="w-3.5 h-3.5" />}
                      </span>
                      <div className="min-w-0">
                        <span className="text-xs font-bold block truncate">{t.label}</span>
                        <span className="text-[9.5px] text-[var(--text-muted)] block truncate">{t.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* SEKCJA 3: DANE I LEKCJE */}
          <section className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>3. Dane i Lekcje</span>
            </h3>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="drawer-add-chapter-btn"
                  aria-label="Dodaj nową autorską lekcję"
                  onClick={() => {
                    onAddNewChapter();
                    onClose();
                  }}
                  className="p-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-[var(--accent-primary)] text-left transition-all cursor-pointer min-h-[44px] flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold">Nowa lekcja</span>
                </button>

                <button
                  id="drawer-edit-chapter-btn"
                  aria-label="Edytuj bieżącą lekcję"
                  onClick={() => {
                    if (isChapterEditable) {
                      onEditCurrentChapter();
                      onClose();
                    }
                  }}
                  disabled={!isChapterEditable}
                  className="p-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-strong)] disabled:opacity-40 text-left transition-all cursor-pointer min-h-[44px] flex items-center gap-2"
                  title={isChapterEditable ? 'Edytuj treść i quiz bieżącej lekcji' : 'Temat domyślny lub chroniony przed edycją'}
                >
                  <Edit3 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="text-xs font-bold">Edytuj lekcję</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  id="drawer-export-backup-btn"
                  aria-label="Pobierz kopię zapasową bazy danych do pliku JSON"
                  onClick={() => {
                    onExportBackup();
                    onClose();
                  }}
                  className="p-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-strong)] text-left transition-all cursor-pointer min-h-[44px] flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold block">Eksport kopii</span>
                    <span className="text-[9.5px] text-[var(--text-muted)] block">Plik JSON</span>
                  </div>
                </button>

                <button
                  id="drawer-import-backup-btn"
                  aria-label="Przywróć dane z pliku kopii zapasowej JSON"
                  onClick={() => {
                    onImportBackup();
                    onClose();
                  }}
                  className="p-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-strong)] text-left transition-all cursor-pointer min-h-[44px] flex items-center gap-2"
                >
                  <Upload className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold block">Import kopii</span>
                    <span className="text-[9.5px] text-[var(--text-muted)] block">Wczytaj plik</span>
                  </div>
                </button>
              </div>

              <button
                id="drawer-storage-manager-btn"
                aria-label="Otwórz Menedżer Pamięci i Puli IndexedDB"
                onClick={() => {
                  onOpenStorageManager();
                  onClose();
                }}
                className="w-full p-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-[var(--accent-primary)] text-left transition-all cursor-pointer min-h-[44px] flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold block">Pamięć Podręczna & IndexedDB</span>
                    <span className="text-[10px] text-[var(--text-muted)] block">
                      Stan limitu dysku, optymalizacja pamięci
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[var(--accent-primary)] font-bold px-2 py-0.5 rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent-border)]">
                  Zarządzaj
                </span>
              </button>
            </div>
          </section>

          {/* SEKCJA 4: SYSTEM I LICENCJA */}
          <section className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>4. System i Bezpieczeństwo</span>
            </h3>

            <div className="space-y-2">
              <button
                id="drawer-terms-license-btn"
                aria-label="Otwórz Regulamin, Politykę Prywatności i Wolną Licencję WLPE"
                onClick={() => {
                  onOpenTerms();
                  onClose();
                }}
                className="w-full p-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-strong)] text-left transition-all cursor-pointer min-h-[44px] flex items-center gap-2.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold block">Regulamin & Wolna Licencja (WLPE)</span>
                  <span className="text-[10px] text-[var(--text-muted)] block">
                    Prywatność 100% offline, brak rejestracji i śledzenia
                  </span>
                </div>
              </button>

              <button
                id="drawer-reset-db-btn"
                aria-label="Przywróć domyślną fabryczną bazę tematów"
                onClick={() => {
                  onClose();
                  onResetDatabase();
                }}
                className="w-full p-3 rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50/60 dark:bg-red-950/20 hover:bg-red-100/70 text-red-700 dark:text-red-300 text-left transition-all cursor-pointer min-h-[44px] flex items-center gap-2.5"
              >
                <RotateCcw className="w-4 h-4 text-red-500 shrink-0" />
                <div>
                  <span className="text-xs font-bold block">Przywróć domyślne działy</span>
                  <span className="text-[10px] text-red-600/80 dark:text-red-400/80 block">
                    Resetuje tematy do pierwotnej bazy programu
                  </span>
                </div>
              </button>
            </div>
          </section>
        </div>

        {/* Footer info in Drawer */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[11px] text-[var(--text-muted)] flex items-center justify-between shrink-0">
          <span>Cyfrowy Multibook Edukacyjny</span>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            100% Offline PWA
          </span>
        </div>
      </div>
    </div>
  );
};
