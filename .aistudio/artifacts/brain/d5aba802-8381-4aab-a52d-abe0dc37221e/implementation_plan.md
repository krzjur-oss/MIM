# Uporządkowanie Przycisków Aplikacji w Menu Narzędzi (Hamburger)

Plan reorganizacji interfejsu i przycisków Cyfrowego Multibooka: odciążenie nagłówka i paska czytnika, zachowanie kluczowych akcji bezpośrednich w nagłówku oraz konsolidacja wszystkich narzędzi dydaktycznych, ustawień czytnika, motywów WCAG AAA, operacji na danych i opcji systemowych w zorganizowanym, wysuwanym menu hamburger w prawym rogu ekranu.

---

### Decyzje uzgodnione z użytkownikiem

> [!IMPORTANT]
> Na podstawie odpowiedzi z Fazy 1 ustalono następującą architekturę:
> - **Forma menu**: Główne akcje robocze w nagłówku, a reszta zebrana w dedykowanym **menu hamburger w prawym rogu nagłówka**.
> - **Zakres konsolidacji**: Pełna konsolidacja – w menu znajdą się zarówno narzędzia pomocnicze, opcje bazy danych, jak i **ustawienia czytnika (rozmiar czcionki, interlinia, motywy kolorystyczne)**, co uwolni czytnik od clutteru.
> - **Układ wewnętrzny**: Podział na 4 sekcje tematyczne:
>   1. **Narzędzia** (Tablica, Dziennik i Notatki, Tryb Pełnoekranowy, Quiz)
>   2. **Czytnik i Dostępność** (Skalowanie czcionki, Interlinia, Przełącznik motywów WCAG AAA)
>   3. **Dane i Lekcje** (Tworzenie lekcji, Edycja, Kopia zapasowa Eksport/Import, Menedżer pamięci)
>   4. **System i Pomoc** (Regulamin i Licencja WLPE, Reset bazy do stanu fabrycznego, Informacje PWA)

---

## 1. Architektura Interfejsu i Rozmieszczenie Elementów

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  [Spis treści] 📖 Interaktywny Multibook        [Panel Nauczyciela] [Tablica] [☰ Menu] │
└──────────────────────────────────────────────────────────────────────────────────┘
                                                                           │
                                                                           ▼
                                                ┌──────────────────────────────────┐
                                                │ ☰ Menu Narzędzi i Ustawień  [✕]  │
                                                ├──────────────────────────────────┤
                                                │ 🛠️ NARZĘDZIA DYDAKTYCZNE         │
                                                │ • Dziennik i notatki lekcyjne    │
                                                │ • Tryb pełnoekranowy skupienia   │
                                                │ • Szkicownik / Tablica interakt. │
                                                │ • Quiz sprawdzający wiedzę       │
                                                ├──────────────────────────────────┤
                                                │ 👁️ CZYTNIK I DOSTĘPNOŚĆ          │
                                                │ • Rozmiar tekstu: [A-] 105% [A+] │
                                                │ • Interlinia: Normalna / Szeroka │
                                                │ • Paleta WCAG AAA (6 próbek)     │
                                                ├──────────────────────────────────┤
                                                │ 💾 DANE I KOPIA ZAPASOWA         │
                                                │ • Dodaj nową lekcję              │
                                                │ • Edytuj bieżący rozdział        │
                                                │ • Eksport kopii zapasowej (JSON) │
                                                │ • Import kopii zapasowej (JSON)  │
                                                │ • Menedżer pamięci podręcznej    │
                                                ├──────────────────────────────────┤
                                                │ ⚙️ SYSTEM I LICENCJA             │
                                                │ • Regulamin i Wolna Licencja     │
                                                │ • Przywróć domyślne działy       │
                                                └──────────────────────────────────┘
```

### Podział odpowiedzialności:
1. **Nagłówek główny (`<header>`)**:
   - Lewa strona: Przycisk mobilnego spisu treści (widoczny na małych ekranach) + logo i nazwa programu.
   - Prawa strona:
     - Główny przycisk perspektywy: **Panel Nauczyciela 🏫 / Widok Lekcji 📖**.
     - Szybki włącznik tablicy: **Tablica-Szkicownik ✏️** (z aktywnym statusem).
     - Przycisk menu: **Menu Narzędzi ☰** (ikona `Menu` / `X` z etykietą dostępności).
2. **Pasek czytnika lekcji**:
   - Skupia się na czytaniu: odtwarzacz lektora głosowego (Audio TTS: Play/Pause/Stop) oraz szybki przycisk otwarcia quizu do lekcji.
   - Usunięcie przeładowania dziesiątkami drobnych przycisków konfiguracyjnych.
3. **Wysuwany panel / Drawer Menu Narzędzi**:
   - Elegancki boczny panel wysuwany z prawej krawędzi (z półprzezroczystym tłem `backdrop-blur`).
   - Podział na 4 czytelne karty z ikonami i opisami.
   - Zgodność z klawiaturą (fokus po otwarciu, zamykanie klawiszem Escape, pułapka fokusu).

---

## 2. Projekt Graficzny i Wytyczne Dostępności

- **WCAG 2.2 AAA & Dostępność**:
  - `role="dialog"`, `aria-modal="true"`, `aria-labelledby="tools-menu-title"`.
  - Wszystkie przyciski posiadają unikalne `id`, czytelne `aria-label` oraz minimalną wysokość dotykową $\ge 44\text{px}$.
  - Obsługa klawisza `Escape` zamykająca menu.
  - Zgodność ze wszystkimi motywami barwnymi (kolory tła i tekstu bazują na tokenach `--bg-surface`, `--text-primary`, `--border-subtle`).
- **Mikrointerakcje i płynność**:
  - Płynne wejście i wyjście panelu menu (`transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1)`).
  - Wskaźniki aktywnego motywu i rozmiaru czcionki z natychmiastowym podglądem na żywo.

---

## 3. Plan Wdrożenia Krok po Kroku

### Krok 1: Komponent `ToolsDrawerMenu.tsx`
- Utworzenie wydzielonego, przetestowanego komponentu `src/components/ToolsDrawerMenu.tsx`.
- Przekazanie do komponentu niezbędnych handlerów (zarządzanie motywem, czcionką, notatkami, kopią, tablicą, edycją).
- Wdrożenie 4 sekcji: Narzędzia, Czytnik, Dane, System.
- Integracja `useFocusTrap` oraz nasłuchiwanie `Escape`.

### Krok 2: Refaktoryzacja nagłówka i paska czytnika w `src/App.tsx`
- Dodanie stanu `isToolsMenuOpen` w `App.tsx`.
- Wstawienie przycisku `Menu Narzędzi (Hamburger)` w prawym rogu nagłówka.
- Usunięcie nadmiarowych przycisków z nagłówka i paska czytnika (przeniesienie ich logiki do menu).
- Podłączenie komponentu `ToolsDrawerMenu`.

### Krok 3: Weryfikacja i Testy
- `npx tsc --noEmit` – brak błędów typowania.
- `npm run build` – pomyślne budowanie produkcyjne.
- `npm run validate` – walidacja integralności bazy danych.
- `npm test` – testy jednostkowe Vitest.
- `npm run check-sw` – integralność Service Workera offline.
- `npm run lint` – zgodność ze standardami kodu.
