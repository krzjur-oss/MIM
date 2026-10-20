# Interaktywny Multibook Edukacyjny 📖🎨

Nowoczesny, interaktywny podręcznik cyfrowy oraz zeszyt ćwiczeń zaprojektowany z myślą o efektywnej nauce stacjonarnej, zdalnej oraz offline. Aplikacja umożliwia dynamiczną prezentację treści lekcyjnych, rysowanie bezpośrednio po ekranie, prowadzenie notatek z galerią grafik oraz pełne śledzenie postępów.

Działa w całości w przeglądarce i nie wymaga zewnętrznego zaplecza serwerowego (wykorzystuje lokalną bazę `IndexedDB` dla rozdziałów i notatek oraz `localStorage` dla preferencji), dzięki czemu pracuje w 100% offline.

---

## 🌟 Główne Funkcje Aplikacji

### 1. Strukturyzacja Treści (Szkoły, Klasy, Przedmioty)
* Filtrowanie i hierarchiczne grupowanie materiałów według typów szkół (np. Szkoła Podstawowa, Liceum) oraz klas (Klasa 1, Klasa 7).
* Automatyczny podział lekcji na **Rozdziały nadrzędne** i konkretne **Tematy lekcyjne**.

### 2. Szkicownik na Żywo (Wirtualna Tablica) 🖌️
* Możliwość rysowania, pisania, podkreślania oraz zakreślania bezpośrednio na tekście podręcznika.
* Narzędzie idealnie przystosowane do pracy z rzutnikami i tablicami interaktywnymi w salach lekcyjnych.
* Łatwe włączanie/wyłączanie nakładki rysowania jednym kliknięciem.

### 3. Zaawansowane Notatki i Przedmiotowa Galeria Obrazów 📝🖼️
* Każda lekcja posiada własny autozapisywalny brudnopis/notatnik.
* Wbudowane galerie dostosowane do przedmiotu (np. biologia – mikroskop, geografia – mapy, matematyka – wzory) z oznaczeniem zasobów wymagających połączenia internetowego (w przypadku pobierania miniatur z Unsplash, adres IP użytkownika jest widoczny dla dostawcy obrazów w celu obsługi pobrania pliku graficznego).
* Automatyczne wykrywanie linków graficznych w notatkach z obsługą powiększania w oknie modalnym (Lightbox) oraz kopiowania adresów URL.

### 4. Dynamiczne Dopasowanie Kolorystyki Przedmiotowej 🎨 *(Nowość!)*
* Kolory aktywnych kropel postępu, tła plakietek przedmiotowych, aktywnej karty lekcji oraz przycisków akcji zmieniają się automatycznie w zależności od nauczanego przedmiotu:
  * **Biologia**: Świeża zieleń (`Emerald`)
  * **Religia**: Ciepły, stonowany bursztyn (`Amber`)
  * **Geografia / Astronomia / Kosmos**: Głęboki błękit i indygo (`Indigo`)
  * **Matematyka / Fizyka / Chemia**: Energetyczna czerwień/róż (`Rose`)
  * **Pozostałe**: Elegancki i minimalistyczny szary/grafit (`Slate`)

### 5. Zarządzanie Lekcjami (Dodawanie i Usuwanie) 🗑️ *(Nowość!)*
* Elastyczne dodawanie własnych lekcji wraz z rozdziałem, tematem, treścią w formacie Markdown oraz pytaniami testowymi.
* Możliwość **całkowitego usunięcia dowolnej lekcji** (zarówno domyślnej, jak i utworzonej przez użytkownika) bezpośrednio z listy rozdziałów w menu bocznym lub z dolnego paska aktywnej lekcji.

### 6. Śledzenie Postępów i Rejestr Lekcji (Kalendarz) 📅🟢
* Interaktywny pasek kropek na dole ekranu pokazujący postęp w podręczniku z tooltipami podglądu tytułu lekcji.
* Panel klas z interaktywnym kalendarzem zrealizowanych lekcji, pełną chronologiczną historią realizacji oraz możliwością cofania statusów.

### 7. Pełna Personalizacja Wyglądu ⚙️
* Pięć motywów kolorystycznych: **Jasny**, **Ciemny**, **Ciepły Sepia**, **Pastelowy Niebieski** oraz **Motyw Dyslektyczny** (ułatwiający czytanie dzięki czcionce *OpenDyslexic*).
* Regulacja rozmiaru czcionki oraz wysokości linii (interlinii) bezpośrednio z panelu ustawień tekstu.

---

## 🛠️ Technologie i Biblioteki

Aplikacja została zbudowana przy użyciu najnowocześniejszych standardów webowych:

* **React 19** (z TypeScript)
* **Vite** – ultraszybki bundler i środowisko deweloperskie
* **Tailwind CSS 4** – nowoczesne, responsywne style użytkowe
* **Lucide React** – spójny zestaw pięknych ikon wektorowych
* **Motion** – płynne animacje i przejścia interfejsu
* **React Markdown** – dynamiczne i czytelne renderowanie sformatowanych tekstów lekcji
* **IndexedDB & LocalStorage** – hybrydowy, odporny na awarie magazyn danych offline

---

## 🚀 Jak uruchomić projekt lokalnie?

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
   Aplikacja będzie dostępna pod adresem `http://localhost:3000` (lub innym wskazanym w terminalu).

4. **Budowanie produkcyjne:**
   ```bash
   npm run build
   ```
   Skompilowane pliki statyczne zostaną zapisane w katalogu `/dist`.

5. **Testy i walidacja danych:**
   ```bash
   npm test
   npm run validate
   ```

---

## 📂 Struktura Projektu

```
├── src/
│   ├── components/
│   │   ├── ChapterManager.tsx      # Modal do dodawania/zarządzania lekcjami i eksportu
│   │   ├── DrawingOverlay.tsx      # Moduł interaktywnej tablicy (szkicownika)
│   │   ├── ErrorBoundary.tsx       # Obsługa błędów renderowania z możliwością resetu i pobrania kopii
│   │   └── StorageManagerModal.tsx # Zarządzanie magazynem IndexedDB i localStorage ze statystykami
│   ├── App.tsx                     # Główny komponent z logiką widoków, filtrowaniem i stanem
│   ├── storage.ts                  # Warstwa trwałego magazynu (IndexedDB + localStorage fallback)
│   ├── defaultChapters.ts          # Baza domyślnych lekcji startowych
│   ├── types.ts                    # Definicje typów TypeScript i interfejsów struktur danych
│   ├── main.tsx                    # Punkt wejścia aplikacji React
│   └── index.css                   # Tailwind CSS oraz lokalne czcionki (@fontsource i OpenDyslexic)
├── public/                         # PWA manifest, service worker i ikony
├── scripts/                        # Narzędzia walidacji danych edukacyjnych i tasowania opcji
├── tests/                          # Testy jednostkowe warstwy pamięci (Vitest)
├── metadata.json                   # Konfiguracja uprawnień aplikacji
├── tsconfig.json                   # Konfiguracja TypeScript
└── vite.config.ts                  # Konfiguracja bundlera Vite
```

---

## 🔒 Bezpieczeństwo i Przechowywanie Danych
Aplikacja przechowuje dane wyłącznie po stronie klienta za pomocą lokalnych baz `IndexedDB` (dla obszernych treści lekcji, notatek i szkiców) oraz `localStorage` (dla szybkich preferencji użytkownika). Żadne dane dotyczące notatek, postępów, zrealizowanych lekcji czy nowo dodanych materiałów nie są wysyłane na serwer zewnętrzny.
W przypadku pobierania zewnętrznych miniatur grafik (np. z serwisu Unsplash) w celach demonstracyjnych, zapytanie sieciowe wysyłane jest bezpośrednio z przeglądarki użytkownika, przez co adres IP jest widoczny dla dostawcy pliku graficznego.
Użytkownik może w każdej chwili wyeksportować pełną kopię bezpieczeństwa (plik `.json`) lub zaimportować ją na innym urządzeniu w ustawieniach systemu.

