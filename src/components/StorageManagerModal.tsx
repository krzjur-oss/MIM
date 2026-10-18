import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Download,
  Trash2,
  RefreshCw,
  X,
  HelpCircle,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Database,
  ShieldCheck,
  Sparkles,
  Tv,
} from 'lucide-react';
import {
  getStorageMetrics,
  optimizeStorage,
  clearQuizHistoryStorage,
  StorageMetrics,
} from '../storage';
import { detectDeviceProfile } from '../utils/devicePerformance';

interface StorageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportBackup: () => void;
  onResetFactory: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  isBoardMode?: boolean;
  onToggleBoardMode?: () => void;
}

export const StorageManagerModal: React.FC<StorageManagerModalProps> = ({
  isOpen,
  onClose,
  onExportBackup,
  onResetFactory,
  showToast,
  isBoardMode,
  onToggleBoardMode,
}) => {
  const [metrics, setMetrics] = useState<StorageMetrics | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState(true);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [deviceProfile] = useState(() => detectDeviceProfile());

  const refreshMetrics = () => {
    setMetrics(getStorageMetrics());
  };

  useEffect(() => {
    if (isOpen) {
      refreshMetrics();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const res = await optimizeStorage();
      refreshMetrics();
      showToast(
        `Optymalizacja zakończona sukcesem! Zwolniono ${res.formattedFreed} z pamięci przeglądarki. Dane zabezpieczono w IndexedDB.`,
        'success'
      );
    } catch (e) {
      console.error(e);
      showToast('Wystąpił błąd podczas optymalizacji pamięci.', 'error');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleClearQuizHistory = () => {
    if (
      window.confirm(
        'Czy na pewno chcesz wyczyścić historię odpowiedzi z quizów? Pozwoli to zwolnić pamięć przed nową lekcją, zachowując wszystkie rozdziały i notatki.'
      )
    ) {
      clearQuizHistoryStorage();
      refreshMetrics();
      showToast('Wyczyszczono historię odpowiedzi w quizach.', 'success');
    }
  };

  const percent = metrics ? metrics.usagePercent : 0;
  const isDanger = percent >= 80;
  const isWarning = percent >= 50 && percent < 80;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-400 shrink-0 shadow-xs">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                Zarządzanie Pamięcią i Ekranami Android
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                  Tablice & Tablety
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Diagnostyka i eliminacja komunikatu o przepełnionej pamięci przeglądarki
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Zamknij"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-4 pr-1.5 text-xs">
          {/* Storage Capacity Gauge */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                  Szybka pamięć podręczna przeglądarki (DOM Storage)
                </span>
              </div>
              <span className="font-extrabold text-xs text-slate-700 dark:text-slate-300">
                {metrics?.formattedUsed} / {metrics?.formattedQuota} ({percent}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isDanger
                    ? 'bg-rose-500 animate-pulse'
                    : isWarning
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.max(2, Math.min(100, percent))}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <div className="flex items-center gap-1.5">
                {isDanger ? (
                  <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Ryzyko błędu: Pamięć bliska przepełnienia
                  </span>
                ) : isWarning ? (
                  <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Zalecana optymalizacja pamięci
                  </span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Stan optymalny — bezpieczny zapas pamięci
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>IndexedDB: {metrics?.hasIndexedDB ? 'Dostępna (do 1 GB)' : 'Niedostępna'}</span>
              </div>
            </div>
          </div>

          {/* Device Profile & Classroom Board Mode */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-3.5 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Tv className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-emerald-950 dark:text-emerald-200">
                    Tryb Tablicy Szkolnej (GPU & Touch)
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold ${
                    isBoardMode
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {isBoardMode ? 'WŁĄCZONY' : 'WYŁĄCZONY'}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
                  Wykryte urządzenie: <strong>{deviceProfile.deviceLabel}</strong>. Wyłącza ciężkie rozmycia tła, włącza akcelerację GPU.
                </p>
              </div>
            </div>

            {onToggleBoardMode && (
              <button
                type="button"
                onClick={onToggleBoardMode}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 cursor-pointer transition-all shadow-xs ${
                  isBoardMode
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50'
                }`}
                title="Włącz lub wyłącz Tryb Tablicy Szkolnej"
              >
                {isBoardMode ? 'Wyłącz' : 'Włącz'}
              </button>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs active:scale-95 disabled:opacity-50"
              title="Przenieś duże bazy lekcji i zdjęć do IndexedDB, aby zwolnić pamięć podręczną"
            >
              <Zap className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
              <span>{isOptimizing ? 'Optymalizuję...' : '🚀 1-Klik: Zoptymalizuj pamięć'}</span>
            </button>

            <button
              type="button"
              onClick={onExportBackup}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs active:scale-95"
              title="Pobierz kopię wszystkich danych do pliku JSON na pendrive lub dysk"
            >
              <Download className="w-4 h-4" />
              <span>💾 Pobierz kopię zapasową (JSON)</span>
            </button>

            <button
              type="button"
              onClick={handleClearQuizHistory}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 border border-slate-200 dark:border-slate-700"
              title="Wyczyść zaznaczone odpowiedzi w quizach przed nową lekcją"
            >
              <Trash2 className="w-4 h-4 text-amber-500" />
              <span>Wyczyść historię quizów</span>
            </button>

            <button
              type="button"
              onClick={onResetFactory}
              className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 border border-rose-200 dark:border-rose-800"
              title="Przywróć stan początkowy aplikacji"
            >
              <RefreshCw className="w-4 h-4 text-rose-600" />
              <span>Pełny reset (stan fabryczny)</span>
            </button>
          </div>

          {/* Android Interactive Screens Guide (Foldable) */}
          <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 space-y-2">
            <button
              type="button"
              onClick={() => setShowAndroidGuide((prev) => !prev)}
              className="w-full flex items-center justify-between text-left font-bold text-amber-900 dark:text-amber-200 text-xs cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Dlaczego na ekranie interaktywnym Android / tablecie wyskakuje ten błąd?</span>
              </div>
              {showAndroidGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAndroidGuide && (
              <div className="text-[11.5px] text-amber-900/90 dark:text-amber-200/90 space-y-2 pt-2 border-t border-amber-200/60 dark:border-amber-800/40 leading-relaxed">
                <p>
                  <strong>Przyczyna techniczna:</strong> Monitory interaktywne (Clevertouch, Promethean, SMART Board, ViewSonic, myViewBoard) oraz tablety z systemem Android posiadają przeglądarkę o sztywnym limicie pamięci <em>DOM Storage</em> (tylko <strong>5 MB</strong> na stronę internetową).
                </p>
                <p>
                  W klasie, w której tablica pracuje przez wiele miesięcy bez restartu, wbudowana przeglądarka monitora gromadzi dane i odrzuca nowe zapisy.
                </p>
                <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-amber-200 dark:border-amber-900 space-y-1.5">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Jak to trwale rozwiązać w 3 krokach na monitorze w sali:
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300">
                    <li>
                      <strong>Krok 1 w aplikacji:</strong> Kliknij powyżej niebieski przycisk <em>„🚀 1-Klik: Zoptymalizuj pamięć”</em> — program natychmiast przeniesie bazę lekcji do pamięci IndexedDB i zwolni ponad 90% miejsca.
                    </li>
                    <li>
                      <strong>Krok 2 w monitorze:</strong> Wciśnij przycisk <em>Home</em> na ramie lub pilocie tablicy &rarr; otwórz <em>Ustawienia (Settings)</em> &rarr; <em>Aplikacje (Apps)</em> &rarr; wybierz <em>Przeglądarkę / Chrome</em> &rarr; <em>Pamięć (Storage)</em> &rarr; <strong>Wyczyść pamięć podręczną (Clear Cache)</strong>.
                    </li>
                    <li>
                      <strong>Krok 3 (Rekomendacja):</strong> Otwórz menu przeglądarki (3 kropki) i wybierz <em>„Dodaj do ekranu głównego”</em> / <em>„Zainstaluj aplikację”</em>. Uruchomienie jako aplikacja PWA przydziela odrębną, niezależną przestrzeń dyskową do 1 GB!
                    </li>
                  </ol>
                </div>
              </div>
            )}
          </div>

          {/* Breakdown Table (Foldable) */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 space-y-2">
            <button
              type="button"
              onClick={() => setShowItemDetails((prev) => !prev)}
              className="w-full flex items-center justify-between text-left font-semibold text-slate-700 dark:text-slate-300 text-xs cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span>Szczegółowa lista elementów w pamięci urządzenia ({metrics?.items.length || 0})</span>
              </div>
              {showItemDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showItemDetails && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {metrics?.items.map((item) => (
                  <div
                    key={item.key}
                    className="flex justify-between items-center text-[11px] p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800"
                  >
                    <div className="truncate pr-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{item.label}</span>
                      <span className="text-slate-400 text-[10px] block font-mono">{item.key}</span>
                    </div>
                    <span className="font-extrabold text-slate-600 dark:text-slate-400 shrink-0">
                      {item.formatted}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Zamknij
          </button>
        </div>
      </motion.div>
    </div>
  );
};
