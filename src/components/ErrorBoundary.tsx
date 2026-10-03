import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error('[ErrorBoundary] Przechwycono nieobsłużony błąd React:', error, errorInfo);
  }

  private handleDownloadBackup = (): void => {
    try {
      const backupData: Record<string, unknown> = {
        exportDate: new Date().toISOString(),
        backupType: 'emergency-dump',
        appVersion: '1.3'
      };

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('multibook_')) {
          try {
            backupData[key] = JSON.parse(localStorage.getItem(key) || 'null');
          } catch {
            backupData[key] = localStorage.getItem(key);
          }
        }
      }

      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `multibook_kopia_awaryjna_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (e) {
      alert('Nie udało się wyeksportować kopii awaryjnej: ' + String(e));
    }
  };

  private handleResetApp = (): void => {
    const confirmed = window.confirm(
      'Czy na pewno chcesz zresetować aplikację do ustawień fabrycznych?\n\nZostaną wyczyszczone lokalne dane programu. Jeśli chcesz zachować swoje notatki i lekcje, najpierw pobierz kopię zapasową.'
    );
    if (!confirmed) return;

    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('multibook_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));

      // Also attempt IndexedDB cleanup
      if (typeof window !== 'undefined' && window.indexedDB) {
        window.indexedDB.deleteDatabase('mim_multibook_idb');
      }

      window.location.reload();
    } catch (e) {
      alert('Błąd podczas resetowania danych: ' + String(e));
    }
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mb-5">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h1 className="text-xl font-bold tracking-tight mb-2">
              Coś poszło nie tak
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Wystąpił nieoczekiwany problem z wyświetleniem strony. Twoje dane (notatki, lekcje, klasy)
              są bezpieczne w pamięci przeglądarki. Możesz natychmiast pobrać kopię zapasową lub zresetować aplikację.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={this.handleDownloadBackup}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition cursor-pointer shadow-sm"
              >
                <span>💾 Pobierz kopię danych</span>
              </button>
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold transition cursor-pointer"
              >
                Odśwież stronę
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <button
                onClick={this.handleResetApp}
                className="text-xs text-red-600 dark:text-red-400 hover:underline font-medium cursor-pointer"
              >
                Zresetuj aplikację do stanu domyślnego
              </button>

              <span className="text-[11px] text-slate-400">Interaktywny Multibook</span>
            </div>

            {this.state.error && (
              <details className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 text-xs text-slate-500 dark:text-slate-400">
                <summary className="cursor-pointer font-medium hover:text-slate-700 dark:hover:text-slate-200">
                  Szczegóły techniczne błędu
                </summary>
                <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-x-auto font-mono text-[11px] text-red-600 dark:text-red-400">
                  <p className="font-semibold">{this.state.error.toString()}</p>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="mt-2 whitespace-pre-wrap text-[10px] text-slate-600 dark:text-slate-400">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
