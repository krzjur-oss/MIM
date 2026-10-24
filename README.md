# Interaktywny Multibook Edukacyjny 📖🎨 (Wersja 1.4)

Nowoczesny, interaktywny podręcznik cyfrowy oraz wieloaspektowy zeszyt ćwiczeń zaprojektowany z myślą o efektywnej dydaktyce stacjonarnej w klasie (na tablicach interaktywnych i monitorach dotykowych) oraz samodzielnej nauce w domu i w podróży.

Aplikacja funkcjonuje w całości w przeglądarce internetowej (Progressive Web App – PWA) i nie wymaga zewnętrznego zaplecza serwerowego. Wykorzystuje lokalną, trwałą bazę danych **`IndexedDB`** (dla pełnych treści lekcji, notatek, rysunków i rejestru zajęć) oraz **`localStorage`** (dla preferencji interfejsu), zapewniając **100% prywatności oraz pełną funkcjonalność offline**.

---

## 🌟 Główne Funkcje i Narzędzia (Wersja 1.4)

### 1. Boczna Szuflada Narzędziowa (Hamburger Tools Drawer) ☰
W prawym górnym rogu nagłówka umieszczono skonsolidowane, wysuwane menu narzędziowe (`global-tools-menu-btn`). Zapewnia ono błyskawiczny dostęp do wszystkich funkcji programu bez zaśmiecania widoku lekcji:
*   **Strefa 1: Narzędzia dydaktyczne** – włączanie Tablicy-Szkicownika na żywo, otwieranie Dziennika i Notatek ucznia, tryb pełnoekranowy (Focus) oraz bezpośredni skrót do quizu sprawdzającego.
*   **Strefa 2: Czytnik i Dostępność** – płynne skalowanie czcionki (A- / 105% / A+), trzystopniowa interlinia (*Zwykła*, *Luźna*, *Szeroka*) oraz 6 palet barwnych o wysokim kontraście WCAG AAA z miniaturowymi próbkami.
*   **Strefa 3: Dane i Lekcje** – dodawanie nowej lekcji, edycja bieżącego tematu, eksport kopii zapasowej JSON, selektywny import oraz Menedżer pamięci podręcznej i optymalizacji ekranów Android.
*   **Strefa 4: System i Pomoc** – oficjalny Regulamin i Licencja WLPE, przywracanie domyślnych działów oraz karta stanu offline PWA.
*   **Dostępność**: Pełna obsługa klawiatury (`Escape`, pułapka fokusu `useFocusTrap`) i duże cele dotykowe ($\ge 44\text{px}$) zoptymalizowane pod palce i rysiki.

### 2. Szkicownik na Żywo (Wirtualna Tablica) & Tryb Tablicy Szkolnej 🖌️📺
*   **Szkicownik na treści**: Rysowanie, zakreślanie neonowym markerem, wprowadzanie figur geometrycznych, strzałek oraz wskaźnika laserowego bezpośrednio na tekście otwartej lekcji.
*   **Tryb Czystej Tablicy**: Przełączanie tła na białą tablicę, tablicę kredową, papier w kratkę lub papier w linie.
*   **Tryb Tablicy Szkolnej (Classroom Board Mode)**: Opcja dedykowana dla monitorów dotykowych (Promethean, SMART Board, myViewBoard, Android TV). Wyłącza obciążające procesor filtry rozmycia tła (`backdrop-blur`), optymalizuje akcelerację GPU i gwarantuje stabilne 60 FPS.

### 3. Sześć Motywów Barwnych WCAG AAA i Modularne Style CSS 🎨
System wizualny opiera się na dedykowanych plikach CSS ze zmiennymi (`src/styles/themes/*.css`):
1.  **Jasny (Szkolny WCAG AAA)** (`light.css`): Maksymalna czytelność i naturalny papierowy kontrast.
2.  **Ciemny (Dark Mode WCAG AAA)** (`dark.css`): Ochrona wzroku przy zaciemnionych salach lekcyjnych.
3.  **Tablica Szkolna (Maksymalny Kontrast AAA)** (`board.css`): Głęboka zieleń szkolnej tablicy kredowej (`#041f14`) ze śnieżnobiałym i szmaragdowym tekstem o współczynniku kontrastu przekraczającym 14:1.
4.  **Ciepły Pergamin (Sepia)** (`sepia.css`): Ciepłe, bursztynowe tony eliminujące niebieskie światło.
5.  **Pastelowy Błękit (Nordic)** (`blue.css`): Uspokajający, arktyczny błękit sprzyjający skupieniu.
6.  **Motyw Dyslektyczny** (`dyslexic.css`): Specjalistyczny krój **OpenDyslexic** z asymetrycznie dociążoną podstawą liter zapobiegający wrażeniu obracania się znaków w percepcji wzrokowej.

### 4. Uporządkowany Pasek Czytnika 📖
*   Kompaktowy pasek narzędziowy lekcji z plakietką przedmiotu, szacowanym czasem nauki i wynikiem quizu.
*   Szybki przycisk `Czytnik & Motyw` (pokazujący bieżący rozmiar czcionki i otwierający szufladę ustawień).
*   Bezpośrednie przełączniki: **Pełny ekran**, **Tryb Czytania** (czyszczący nagłówki z dekoracyjnych emotikonów) oraz **Tryb Tablicy Szkolnej**.
*   Wbudowany lektor mowy (Text-To-Speech) z polską syntezą mowy dla całych lekcji oraz poszczególnych akapitów.

### 5. Zaawansowane Notatki, Galeria Multimediów i Eksport PDF 📝🖼️
*   Autozapisywalny notatnik dla każdej lekcji z pełnym wsparciem formatowania Markdown.
*   Przedmiotowe galerie fotografii z podglądem pełnoekranowym (Lightbox) oraz możliwością przeciągania plików grafik (Drag & Drop).
*   Generowanie gotowych, sformatowanych dokumentów do druku (PDF / HTML z oficjalnym nagłówkiem szkolnym) oraz pobieranie plików Markdown `.md`.

### 6. Panel Nauczyciela, Kalendarz Realizacji i Generator `.ics` 👨‍🏫📅
*   Zarządzanie oddziałami klasowymi i listami uczniów.
*   Ewidencja zrealizowanych lekcji z osią czasu i kalendarzem dydaktycznym.
*   **Generator Harmonogramu Lekcji**: automatyczne rozplanowanie tematów na cały rok szkolny z możliwością eksportu do uniwersalnego formatu kalendarza `.ics`.
*   **Kreator Sprawdzianów i Kartkówek**: natychmiastowe generowanie arkuszy testowych A4 dla ucznia wraz z kluczem odpowiedzi dla nauczyciela.

### 7. Trwała Baza Danych IndexedDB i Bezpieczeństwo Danych 🔒
*   Hybrydowy mechanizm pamięci z automatyczną migracją danych z `localStorage` do asynchronicznej bazy `IndexedDB`.
*   Równoległe odczytywanie zasobów przy starcie programu (`Promise.all`) gwarantujące błyskawiczne uruchamianie aplikacji.
*   Menedżer pamięci podręcznej pozwalający kontrolować zajętość miejsca na dysku urządzenia.
*   Wielopoziomowy selektywny eksport i import kopii bezpieczeństwa w formacie JSON (tryb scalania *Merge* lub nadpisywania *Replace*).

---

## 🛠️ Technologie i Biblioteki

*   **React 19** (TypeScript)
*   **Vite** – środowisko wykonawcze i bundler
*   **Tailwind CSS 4** – nowoczesny silnik stylów z dedykowanymi arkuszami motywów CSS
*   **IndexedDB** (`fake-indexeddb` w testach) – lokalna asynchroniczna baza danych
*   **Lucide React** – ikony wektorowe
*   **Motion** – płynne animacje elementów interfejsu
*   **React Markdown** – semantyczne renderowanie formatowanego tekstu lekcji
*   **Service Worker & PWA** – pełne buforowanie zasobów i działanie bez dostępu do Internetu

---

## 🚀 Uruchomienie Projektu Lokalnie

1. **Sklonuj repozytorium:**
   ```bash
   git clone <url-repozytorium-github>
   cd <nazwa-katalogu>
   ```

2. **Zainstaluj zależności:**
   ```bash
   npm install
   ```

3. **Uruchom serwer deweloperski:**
   ```bash
   npm run dev
   ```
   Aplikacja uruchomi się pod adresem `http://localhost:3000`.

4. **Kompilacja i weryfikacja kodu:**
   ```bash
   npm run lint        # Sprawdzenie typów TypeScript i reguł ESLint
   npm test            # Uruchomienie 16 testów jednostkowych bazy danych
   npm run validate    # Weryfikacja spójności 251 lekcji i 502 quizów
   npm run check-sw    # Sprawdzenie manifestu pamięci podręcznej Service Workera
   npm run build       # Produkcyjna kompilacja do katalogu /dist
   ```

---

## 📂 Struktura Projektu

```
├── src/
│   ├── components/
│   │   ├── ToolsDrawerMenu.tsx     # Boczna szuflada narzędzi i ustawień (Hamburger Menu)
│   │   ├── ChapterManager.tsx      # Kreator lekcji, pytań quizowych i import Markdown
│   │   ├── DrawingOverlay.tsx      # Nakładka wirtualnej tablicy i szkicownika na żywo
│   │   ├── StorageManagerModal.tsx # Zarządzanie bazą IndexedDB i optymalizacja Android
│   │   └── ErrorBoundary.tsx       # Tarcza chroniąca przed awariami z opcją pobrania kopii
│   ├── styles/
│   │   └── themes/                 # Dedykowane tokeny kolorystyczne WCAG AAA:
│   │       ├── light.css           # Motyw jasny szkolny
│   │       ├── dark.css            # Motyw ciemny
│   │       ├── board.css           # Tablica szkolna (zielona kreda, ultra kontrast)
│   │       ├── sepia.css           # Ciepły pergamin
│   │       ├── blue.css            # Arktyczny błękit
│   │       └── dyslexic.css        # Zoptymalizowany pod dysleksję
│   ├── App.tsx                     # Główny kontroler aplikacji, pasek czytnika, nawigacja
│   ├── storage.ts                  # Silnik trwałego magazynu (IndexedDB + fallback)
│   ├── defaultChapters.ts          # Baza lekcji startowych i wbudowane instrukcje
│   ├── types.ts                    # Definicje struktur danych i interfejsów TypeScript
│   ├── main.tsx                    # Główny punkt wejściowy aplikacji React
│   └── index.css                   # Globalne reguły Tailwind i importy czcionek
├── public/                         # Pliki PWA (manifest.json, sw.js, ikony)
├── scripts/
│   ├── validate-data.ts            # Skrypt walidacji spójności bazy edukacyjnej
│   └── check-sw.ts                 # Skrypt weryfikacji pre-cache Service Workera
├── tests/                          # Zestaw testów jednostkowych Vitest (16 testów)
├── LICENSE.md                      # Wolna Licencja Prywatno-Edukacyjna (WLPE v1.4)
├── REGULAMIN.md                    # Regulamin i Polityka Prywatności RODO offline (v1.4)
├── metadata.json                   # Konfiguracja uprawnień i nazwy aplikacji
└── tsconfig.json / vite.config.ts  # Konfiguracja środowiska TypeScript i Vite
```

---

## 📜 Licencja i Prawa Autorskie

Aplikacja udostępniana jest na warunkach **Wolnej Licencji Prywatno-Edukacyjnej (Zastrzeżonej) — WLPE (Wersja 1.4, 2026 r.)**.

*   **Dozwolony użytek (w 100% bezpłatny)**: Wykorzystanie do własnych celów prywatnych przez uczniów, rodziców i samouków oraz do celów dydaktycznych w placówkach oświatowych (szkoły podstawowe, ponadpodstawowe, przedszkola, uczelnie, świetlice).
*   **Zakazy i ograniczenia**: Surowy zakaz komercjalizacji, sprzedaży, zamykania za płatnymi subskrypcjami, publikowania kopii kodu lub forkowania w celach komercyjnych bez pisemnej zgody Autora.
*   **Autor i właściciel praw autorskich**: mgr Krzysztof Jureczek (`kjureczek@proton.me`, GitHub: `github.com/krzjur-oss`).
*   Pełna treść licencji znajduje się w pliku `LICENSE.md`, a regulamin korzystania w pliku `REGULAMIN.md`.

---

## 📝 Dziennik Zmian (Changelog)

### Wersja 1.4 (2026 r.)
*   **Boczna Szuflada Narzędziowa (Hamburger Tools Drawer)**: Wprowadzono modularne menu boczne porządkujące wszystkie funkcje dydaktyczne, ustawienia czytnika, operacje na danych i status systemu.
*   **Nowa Paleta Barwna „Tablica Szkolna” (WCAG AAA)**: Dodano profesjonalny, szmaragdowo-kredowy motyw o kontraście 14:1, perfekcyjny na tablice interaktywne i rzutniki.
*   **Modułowa Architektura Stylów CSS**: Przeniesiono definicje kolorów do niezależnych plików `src/styles/themes/*.css` podłączonych przez atrybut `data-theme`.
*   **Tryb Tablicy Szkolnej (Classroom Board Mode)**: Sprzętowa optymalizacja pod monitory interaktywne z systemem Android i tablety (eliminacja obciążających filtrów rozmycia, stałe 60 FPS).
*   **Uporządkowanie Paska Czytnika**: Zredukowano natłok przycisków, wprowadzając szybki kontroler `Czytnik & Motyw` oraz skróty do trybów pełnoekranowych i tablicy.
*   **Udoskonalenie PWA i Bazy IndexedDB**: Wzmocniono odporność na awarie pamięci, wprowadzono automatyczną synchronizację i skrypt weryfikujący `check-sw`.
*   **Aktualizacja Dokumentacji i Instrukcji**: Zaktualizowano wszystkie rozdziały instruktażowe w programie oraz pliki prawne.

### Wersja 1.3
*   Wdrożenie hybrydowej bazy danych IndexedDB dla lekcji i notatek.
*   Panel Nauczyciela z harmonogramem lekcji, terminarzem i generatorem sprawdzianów A4.
*   Wsparcie dla lektora syntezy mowy TTS.
