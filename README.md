# Interaktywny Multibook Edukacyjny 📖🎨

Nowoczesny, interaktywny podręcznik cyfrowy oraz zeszyt ćwiczeń zaprojektowany z myślą o efektywnej nauce stacjonarnej, zdalnej oraz offline. Aplikacja umożliwia dynamiczną prezentację treści lekcyjnych, rysowanie bezpośrednio po ekranie, prowadzenie notatek z galerią grafik oraz pełne śledzenie postępów.

Działa w całości w przeglądarce i nie wymaga zewnętrznego zaplecza serwerowego (wykorzystuje `LocalStorage` do zapisu danych), dzięki czemu może pracować w 100% offline.

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
* Wbudowane galerie dostosowane do przedmiotu (np. biologia – mikroskop, geografia – mapy, matematyka – wzory).
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

* **React 18** (z TypeScript)
* **Vite** – ultraszybki bundler i środowisko deweloperskie
* **Tailwind CSS** – nowoczesne, responsywne style użytkowe
* **Lucide React** – spójny zestaw pięknych ikon wektorowych
* **Motion (Framer Motion)** – płynne animacje i przejścia interfejsu
* **React Markdown** – dynamiczne i czytelne renderowanie sformatowanych tekstów lekcji

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

---

## 📂 Struktura Projektu

```
├── src/
│   ├── components/
│   │   ├── ChapterManager.tsx  # Modal do dodawania/zarządzania lekcjami
│   │   └── DrawingOverlay.tsx  # Moduł interaktywnej tablicy (szkicownika)
│   ├── App.tsx                 # Główny komponent z logiką widoków, filtrowaniem i stanem
│   ├── defaultChapters.ts      # Baza domyślnych, bogatych lekcji startowych
│   ├── types.ts                # Definicje typów TypeScript i interfejsów struktur danych
│   ├── main.tsx                # Punkt wejścia aplikacji React
│   └── index.css               # Import Tailwind CSS oraz czcionek (w tym OpenDyslexic)
├── public/                     # Statyczne zasoby publiczne
├── metadata.json               # Konfiguracja uprawnień aplikacji
├── tsconfig.json               # Konfiguracja TypeScript
└── vite.config.ts              # Konfiguracja bundlera Vite
```

---

## 🔒 Bezpieczeństwo i Przechowywanie Danych
Aplikacja przechowuje dane wyłącznie po stronie klienta za pomocą mechanizmu `LocalStorage`. Żadne dane dotyczące notatek, postępów, zrealizowanych lekcji czy nowo dodanych materiałów nie są wysyłane na serwer zewnętrzny.
Użytkownik może w każdej chwili wyeksportować pełną kopię bezpieczeństwa (plik `.json`) lub zaimportować ją na innym urządzeniu w ustawieniach systemu.
