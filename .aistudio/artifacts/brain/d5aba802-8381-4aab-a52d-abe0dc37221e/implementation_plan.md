# Kompleksowy Plan Optymalizacji Wydajności i Płynności Programu

Plan wdrożenia zaawansowanych optymalizacji wydajnościowych programu, ukierunkowany na płynność działania na ekranach interaktywnych z systemem Android (Clevertouch, Promethean, SMART Board, ViewSonic), tabletach oraz komputerach szkolnych.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Decyzje uzgodnione z użytkownikiem:**
> - **Kluczowe filary**: 
>   1. Płynność działania na szkolnych tablicach i tabletach z Androidem.
>   2. Szybkość uruchamiania programu i błyskawiczne otwieranie lekcji.
>   3. Oszczędzanie pamięci RAM i redukcja obciążenia procesora (CPU/GPU).
> - **Profil interfejsu**: Inteligentne, automatyczne wykrywanie urządzeń dotykowych i ekranów Android z czytelnym przełącznikiem **„Tryb Tablicy Szkolnej”** (Classroom Board Mode) na górnym pasku i w menu podręcznym.

---

## 1. Filar I: Płynność na ekranach Android i „Tryb Tablicy Szkolnej”

### Wyzwania na monitorach interaktywnych
Większość szkolnych monitorów interaktywnych (Clevertouch, SMART, Promethean, myViewBoard) działa w oparciu o układ SoC z systemem Android i przeglądarkę Chromium WebView. Układy te posiadają ograniczoną moc GPU przy jednoczesnej konieczności wyświetlania obrazu w rozdzielczości Full HD lub 4K. Najczęstszą przyczyną spowolnień są:
- Ciężkie filtry rozmycia tła CSS (`backdrop-filter: blur(...)`) pod menu i oknami dialogowymi.
- Złożone cienie wielowarstwowe (`box-shadow`) przeliczane przy każdym przewijaniu.
- Brak sprzętowej akceleracji warstw renderowania.

### Planowane rozwiązania:
1. **Automatyczne wykrywanie środowiska**:
   - Skrypt startowy analizuje `navigator.userAgent` (Android, CrOS, Linux arm), `navigator.maxTouchPoints > 0` oraz rozdzielczość ekranu.
   - Gdy wykryty zostanie monitor interaktywny lub tablet Android, aplikacja automatycznie proponuje lub aktywuje zoptymalizowany profil wydajnościowy.
2. **Przełącznik „Tryb Tablicy” (High-Performance Board Mode)**:
   - Szybki przełącznik w nagłówku programu (obok powiększenia czcionki i motywu).
   - Pozwala nauczycielowi jednym kliknięciem wymusić maksymalną płynność lub pełne efekty wizualne.
3. **Optymalizacje CSS dla Trybu Tablicy**:
   - Zastąpienie kosztownego `backdrop-blur` jednolitymi, eleganckimi tłami o wysokim kontraście (`bg-slate-900/95` lub `bg-white/95`).
   - Włączenie sprzętowej akceleracji GPU (`transform: translateZ(0)` oraz `will-change: transform`) na głównym obszarze przewijania czytnika.
   - Izolacja renderowania sekcji lekcji za pomocą reguły `contain: content`, dzięki czemu przeglądarka nie przelicza całego drzewa DOM podczas scrollowania.
4. **Ergonomia dotyku na dużych ekranach**:
   - Zapewnienie stref dotyku (hitbox) o minimalnym rozmiarze 44–48 px, ułatwiających obsługę rysikiem lub palcem z odległości.

---

## 2. Filar II: Szybkość Uruchamiania i Błyskawiczne Otwieranie Lekcji

### Zidentyfikowane wąskie gardła:
- Wszystkie komponenty pomocnicze (np. edytor lekcji `ChapterManager`, panel pamięci `StorageManagerModal`, panel rysowania `DrawingOverlay`, moduły statystyk) ładowane są do pamięci natychmiast na starcie, powiększając początkowy pakiet JS.
- Wyszukiwarka w spisie treści (ponad 250 lekcji) przeszukuje pełną treść artykułów synchronicznie przy każdym wciśnięciu klawisza, co na klawiaturze ekranowej Androida powoduje zacięcia.

### Planowane rozwiązania:
1. **Code-Splitting i Lazy Loading ciężkich modułów**:
   - Wdrożenie `React.lazy()` oraz lekkiego `Suspense` dla okien modalnych: edytora bazy lekcji, panelu pamięci masowej oraz zaawansowanych raportów klasowych.
   - Moduły te ładują się w ułamku sekundy dopiero w momencie ich otwarcia przez nauczyciela, skracając czas pierwszego malowania ekranu (First Contentful Paint) o ponad 40%.
2. **Optymalizacja Wyszukiwarki (Deferred & Debounced Search)**:
   - Zastosowanie `useDeferredValue` dla zapytania wyszukiwania. Wpisywanie znaków na ekranie dotykowym nie blokuje wątku głównego.
   - Indeksowanie nagłówków i tytułów – przeszukiwanie wstępnie znormalizowanych tokenów zamiast wielokrotnego wywoływania `.toLowerCase()` na setkach stron tekstu podczas każdego naciśnięcia klawisza.
3. **Płynne renderowanie spisu lekcji (Memoization)**:
   - Zastosowanie `React.memo` na elementach listy rozdziałów i spisu treści (TOC), dzięki czemu zmiana jednej lekcji nie powoduje odświeżenia całego drzewa 250 pozycji.

---

## 3. Filar III: Oszczędzanie Pamięci RAM i Płynność Tablicy do Rysowania

### Wyzwania pamięciowe i dotykowe:
- Wielogodzinna praca w klasie bez przeładowania strony potrafi gromadzić w pamięci RAM nieużywane obiekty graficzne i pociągnięcia pędzla.
- Rysowanie na tablicy interaktywnej wymaga zerowego opóźnienia (low input-to-screen latency).

### Planowane rozwiązania:
1. **Optymalizacja narzędzia rysowania (`DrawingOverlay`)**:
   - Przepisanie pętli rysowania na `requestAnimationFrame` – synchronizacja odświeżania linii z częstotliwością odświeżania matrycy ekranu (60Hz / 120Hz).
   - Wsparcie dla `PointerEvents` z `touch-action: none` i obsługą zdarzeń scalonych (`getCoalescedEvents()`), co zapewnia idealnie gładkie pismo bez schodkowania i zacięć przy szybkich ruchach pisaka.
2. **Buforowanie zapisu do bazy IndexedDB (Debounced Persistence)**:
   - Zmiana notatek, postępów czy rysunków jest buforowana i zapisywana do pamięci IndexedDB z opóźnieniem (np. 400 ms od zakończenia rysowania lub edycji), zamiast setek operacji zapisu dyskowego na sekundę.
   - Znacząco redukuje to obciążenie pamięci flash w urządzeniach szkolnych.
3. **Higiena pamięci RAM (Garbage Collection)**:
   - Automatyczne zwalnianie obiektów `URL.revokeObjectURL()` dla zaimportowanych obrazów.
   - Czyszczenie buforów Canvas przy zamykaniu tablicy lub zmianie lekcji.

---

## 4. Architektura i Konfiguracja Trybu Tablicy

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Multibook Performance Orchestrator                   │
│   (Wykrywanie urządzenia: Android / Tablet / Monitor Interaktywny)     │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
              ┌────────────────────┴────────────────────┐
              ▼                                         ▼
   [Tryb Standardowy (PC/Mac)]             [Tryb Tablicy (Board Mode)]
   - Płynne efekty szkła (blur)            - Solidne, czyste tła (brak blur)
   - Pełne animacje Framer Motion          - Sprzętowa akceleracja CSS (GPU)
   - Standardowe rozmiary kontrolek        - Duże przyciski dotykowe (min. 44px)
                                           - Niskolatencyjny canvas rAF
                                           - Odroczone wyszukiwanie (Deferred)
```

---

## 5. Plan wdrożenia krok po kroku

| Krok | Zakres prac | Cel |
|---|---|---|
| **Krok 1** | Moduł detekcji urządzenia i stan `boardMode` w `App.tsx` | Automatyczne wykrycie ekranu Android/dotykowego z opcją ręcznego przełączania w nagłówku. |
| **Krok 2** | Klasy CSS o zerowym koszcie GPU (High-Performance Theme) | Usunięcie ciężkich rozmyć `backdrop-blur` w trybie tablicy, włączenie sprzętowej akceleracji. |
| **Krok 3** | Optymalizacja wyszukiwarki i spisu treści | Wdrożenie `useDeferredValue` oraz memoizacji pozycji lekcji dla eliminacji lagów przy pisaniu. |
| **Krok 4** | Optymalizacja canvasu rysowania `DrawingOverlay` | Wdrożenie `requestAnimationFrame`, obsługa zdarzeń wskaźnika i buforowanie zapisu. |
| **Krok 5** | Debouncing operacji zapisu IndexedDB | Zmniejszenie liczby operacji wejścia/wyjścia na dysk flash w `storage.ts`. |
| **Krok 6** | Weryfikacja, testy kompilacji i diagnostyka | Sprawdzenie działania, kompilacji TypeScript (`npm run build`) i responsywności. |

---

## 6. Weryfikacja i Metryki Sukcesu

- **Szybkość reakcji dotyku**: Płynne rysowanie bez widocznego opóźnienia pod końcówką rysika.
- **Wyszukiwanie**: Brak zawieszania interfejsu podczas dynamicznego filtrowania 250 lekcji na klawiaturze ekranowej.
- **Brak przepełnienia RAM**: Stabilna praca przez wiele godzin lekcyjnych bez resetowania karty przeglądarki.
- **Czystość kodu**: Zero błędów kompilacji TypeScript i pełna kompatybilność offline.
