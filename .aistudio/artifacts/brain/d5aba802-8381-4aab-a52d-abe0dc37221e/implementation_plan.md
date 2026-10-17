# Architektura Pamięci IndexedDB dla Ekranów Interaktywnych Android i Tabletów

Plan wdrożenia bezstratnego, automatycznego zapisu danych edukacyjnych do lokalnej bazy IndexedDB na urządzeniach użytkownika, eliminujący błąd przepełnienia pamięci przeglądarki (5 MB limit localStorage) z gwarancją 100% działania offline.

## User Review & Critical Decisions

> [!IMPORTANT]
> Decyzje potwierdzone w fazie ustaleń:
> - **Zakres migracji**: Przeniesienie wszystkich obszernych baz danych (rozdziały, ilustracje galerii, notatki, postępy, historia quizów, profile uczniów i dziennik klas) do bazy IndexedDB. Podręczne parametry interfejsu (motyw kolorystyczny, rozmiar czcionki, interlinia, tryb skupienia) pozostają w localStorage dla natychmiastowego startu bez opóźnień.
> - **Przebieg migracji**: Cicha, bezobsługowa migracja w tle przy pierwszym uruchomieniu aplikacji. Stare klucze z ciasnego localStorage zostają bezpiecznie przeniesione do IndexedDB i natychmiast usunięte z localStorage, uwalniając pamięć i zapobiegając błędom na tablicach szkolnych.

## 1. Overview & Core Concept

- **Problem**: Ekrany interaktywne z Androidem oraz tablety szkolne korzystają z silnika Chromium WebView, który nakłada twardy limit 5 MB na magazyn `localStorage`. Podręcznik zawierający ponad 250 lekcji, rysunki tablicowe, notatki oraz wyniki quizów szybko wyczerpywał ten limit, wywołując uciążliwe ostrzeżenia systemowe.
- **Rozwiązanie**: Pełne przekierowanie zapisu danych edukacyjnych do wbudowanej w przeglądarkę bazy **IndexedDB** (magazyn o pojemności setek megabajtów/gigabajtów na dysku urządzenia).
- **Tryb Offline**: 100% zachowany. IndexedDB jest technologią czysto lokalną, nie łączy się z żadnym serwerem i działa bez połączenia z internetem.
- **Bezpieczeństwo Danych**: Nauczyciele i uczniowie nie tracą żadnych dotychczas sporządzonych materiałów ani wyników – skrypt startowy bezpiecznie przenosi istniejące dane do nowej bazy.

## 2. User Experience & Visual Design

- **Start Aplikacji**: Uruchomienie odbywa się płynnie. Podstawowe ustawienia graficzne wczytują się synchronicznie (brak migotania interfejsu), a baza lekcji i postępów hydratuje się z IndexedDB w ułamku sekundy.
- **Zarządzanie Pamięcią (Storage Manager Modal)**:
  - W menu bocznym oraz na pasku narzędzi dostępny jest dedykowany panel diagnostyczny „Pamięć i ekrany Android”.
  - Prezentuje czytelny wskaźnik zajętości pamięci, status bazy IndexedDB, wagę poszczególnych modułów oraz narzędzia: „Optymalizuj pamięć”, „Kopia zapasowa JSON” i „Wyczyść historię quizów”.
  - Sekcja edukacyjna wyjaśnia nauczycielom specyfikę ekranów interaktywnych i podpowiada, jak dbać o płynność tablicy.
- **Elegancja i Dyskrecja**:
  - Zgodnie z zasadami projektowania interfejsów edukacyjnych, proces migracji nie generuje nachalnych wyskakujących okienek ani fałszywych alarmów.
  - Komunikaty o ewentualnych problemach sprzętowych są inteligentnie buforowane (maksymalnie jedno zwięzłe powiadomienie z przyciskiem szybkiej naprawy).

## 3. Key Product Decisions & Trade-Offs

- **Model Dwuwarstwowy (Hybrid Layered Storage)**:
  - *Warstwa 1 (IndexedDB)*: Rozdziały (`multibook_chapters`), galeria (`multibook_chapter_gallery_images`), postępy (`multibook_progress`), quizy (`multibook_quiz_answers`), klasy i uczniowie (`multibook_students`, `multibook_teacher_classes`, `multibook_realizations`).
  - *Warstwa 2 (localStorage)*: Motyw (`multibook_theme`), czcionka (`multibook_fontsize`), interlinia (`multibook_lineheight`), tryb czytania (`multibook_reading_mode`).
  - *Dlaczego*: Eliminuje ryzyko `QuotaExceededError`, zachowując natychmiastowe renderowanie stylów CSS przed pierwszym cyklem renderowania React.
- **Przezroczysta Samonaprawa (Self-Healing Fallback)**:
  - Jeśli jakikolwiek komponent spróbuje zapisać dane przekraczające limit pamięci, mechanizm przechwytuje wyjątek `QuotaExceededError`, automatycznie ewakuuje dane do IndexedDB i ponawia próbę zapisu bez przerywania pracy użytkownika.

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Multibook React UI                              │
│         (Książka, Tablica interaktywna, Quizy, Notatki, Klasy)         │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
         Ustawienia interfejsu              Dane edukacyjne i bazy
     (motyw, czcionka, widoki)        (lekcje, rysunki, uczniowie, quizy)
                   │                                 │
                   ▼                                 ▼
         ┌───────────────────┐             ┌───────────────────┐
         │   localStorage    │             │     IndexedDB     │
         │   (limit ~5 MB)   │             │   (pojemność GB)  │
         │  Szybki start UI  │             │   Trwały zapis    │
         └───────────────────┘             └───────────────────┘
                   ▲                                 │
                   │           Start / Sync          │
                   └────────── Cicha migracja ───────┘
```

### Zadania Implementacyjne:
1. **Moduł `storage.ts`**:
   - Wdrożenie funkcji `migrateLocalStorageToIndexedDB()` wykonującej jednorazowe, ciche przeniesienie ciężkich kluczy do IndexedDB i wyczyszczenie ich z `localStorage`.
   - Wzbogacenie `safeSet` i `safeGetAsync` o asynchroniczny odczyt/zapis do IndexedDB jako domyślnego magazynu dla kolekcji.
   - Utrzymanie wskaźników pamięci `getStorageMetrics()` dla panelu diagnostycznego.
2. **Inicjalizacja w `App.tsx`**:
   - Wywołanie cichej migracji przy montowaniu aplikacji (`useEffect`).
   - Weryfikacja synchronizacji rozdziałów i galerii z bazy IndexedDB do stanu aplikacji.
3. **Weryfikacja i Kompilacja**:
   - Uruchomienie `compile_applet` oraz testów integralności danych offline.
