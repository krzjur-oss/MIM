# Kompleksowa Aktualizacja Informacji o Programie, Instrukcji, Regulaminu, Licencji oraz README (v1.4)

Kompleksowa weryfikacja i unowocześnienie dokumentacji projektu **Cyfrowy Multibook Edukacyjny** – synchronizacja plików repozytorium (`README.md`, `REGULAMIN.md`, `LICENSE.md`), wbudowanych rozdziałów instruktażowych w aplikacji (`src/defaultChapters.ts`) oraz modalnych okien informacyjnych, z oficjalnym podniesieniem wersji programu do **v1.4** i dodaniem rejestru zmian (*Changelog*).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Na podstawie odpowiedzi użytkownika w Fazie 1 ustalono następujące wiążące wytyczne:
> 1. **Zakres**: Aktualizacja obejmuje zarówno pliki repozytorium (`README.md`, `REGULAMIN.md`, `LICENSE.md`), jak i interaktywne lekcje instruktażowe w aplikacji (`src/defaultChapters.ts`, Lekcje 1–9).
> 2. **Poziom szczegółowości**: Pełny opis nowego bocznego menu narzędziowego (Hamburger Drawer), 6 motywów kolorystycznych WCAG AAA opartych na modułowych plikach CSS, architektury pamięci trwałej `IndexedDB` z cichą migracją oraz mechanizmu PWA Offline.
> 3. **Wersjonowanie**: Podniesienie oficjalnej wersji programu z v1.3 do **v1.4 (2026)** wraz z kompletnym wykazem zmian w dokumentacji.

- **Status weryfikacji obecnego stanu**:
  - `README.md` zawierało nieaktualne wzmianki o „5 motywach” (obecnie jest 6, w tym Tablica Szkolna AAA), brakowało w nim opisu nowego bocznego menu Hamburger Drawer (`ToolsDrawerMenu`), modularnych plików CSS w `src/styles/themes/`, zaawansowanego Trybu Tablicy dla monitorów Android oraz narzędzi PWA.
  - `REGULAMIN.md` i `LICENSE.md` zawierały wersję 1.3; wymagają podniesienia do v1.4 ze spójnym określeniem licencji WLPE, warunków ochrony danych (RODO offline) i praw autorskich mgr Krzysztofa Jureczka.
  - Lekcje w `src/defaultChapters.ts` (Lekcja 1–9 w dziale *Wprowadzenie*) opisywały dawny układ przycisków w nagłówku, pomijały nowe menu szufladowe oraz 6. motyw Tablicy Szkolnej, a quizy odwoływały się wyłącznie do `localStorage` zamiast hybrydowego `IndexedDB`.

---

## 1. Overview & Core Concept

### Cel i Wartość Użytkowa
Zapewnienie 100% spójności pomiędzy faktycznymi możliwościami techniczno-dydaktycznymi programu a materiałami informacyjnymi, podręcznikiem użytkownika i podstawą prawno-licencyjną. Nauczyciele, dyrektorzy szkół oraz uczniowie otrzymają rzetelne, nowoczesne i czytelne instrukcje odzwierciedlające najnowsze rozwiązania interfejsu i bezpieczeństwa.

### Grupy Docelowe
- **Nauczyciele i Katecheci**: Precyzyjne instrukcje obsługi Panelu Nauczyciela, generatora harmonogramu lekcji, eksportu `.ics` oraz pracy na tablicach interaktywnych Android w dedykowanym trybie szkolnym.
- **Uczniowie i Samoucy**: Przejrzysty przewodnik po czytniku, notatkach, quizach sprawdzających, lektorze TTS i ułatwieniach dla dyslektyków.
- **Placówki Oświatowe i Administratorzy IT**: Jasne zapisy licencyjne WLPE v1.4, brak wymagań serwerowych, zerowy tracking i pełna zgodność z RODO dzięki lokalnej bazie IndexedDB.

---

## 2. User Experience & Visual Design

### Architektura Treści i Stylistyka Dokumentacji

Dokumentacja i instrukcje zostaną sformatowane zgodnie z regułami czytelności i typografii:
- **Tabelaryczne zestawienia funkcji i skrótów klawiszowych**: szybki przegląd zamiast bloków tekstu.
- **Czytelne ikony i wyróżniki wizualne**: precyzyjne odzwierciedlenie przycisków interfejsu (np. `Menu` ☰, `Czytnik & Motyw` 🎛️, `Tablica Szkolna` 📺).
- **Zasada Zero-Pill**: brak zbędnych dekoracyjnych etykiet; zamiast tego elegancka typografia z zachowaniem kontrastu WCAG AAA.

### Zakres Zmian w Poszczególnych Plikach:

#### A. Plik `README.md` (Wizytówka Repozytorium i Podręcznik Wdrożeniowy):
1. **Nagłówek i Status**: Podniesienie wersji do `v1.4` (Wydanie 2026), aktualizacja opisu hybrydowej bazy danych (`IndexedDB` + `localStorage`).
2. **Nowa Sekcja: Boczna Szuflada Narzędziowa (Hamburger Tools Drawer)**:
   - Opis 4 logicznych stref: *1. Narzędzia dydaktyczne*, *2. Czytnik i Dostępność*, *3. Dane i Lekcje*, *4. System i Pomoc*.
   - Wygodna obsługa dotykowa ($\ge 44\text{px}$) i dostępność klawiaturowa (`Escape`, pułapka fokusu).
3. **Nowa Sekcja: 6 Palet Barwnych WCAG AAA i Modularne Motywy CSS**:
   - Omówienie struktury `src/styles/themes/*.css` (`light`, `dark`, `board`, `sepia`, `blue`, `dyslexic`).
   - Szczegółowy opis motywu **Tablica Szkolna (Maksymalny Kontrast AAA)** dedykowanego do sal lekcyjnych i rzutników.
4. **Tryb Tablicy Szkolnej i Optymalizacja Ekranów Android**:
   - Akceleracja sprzętowa GPU, eliminacja obciążających filtrów rozmycia (`backdrop-blur`), stabilna płynność 60 FPS na monitorach interaktywnych.
5. **PWA i Pełny Tryb Pracy Offline**:
   - Opis Service Workera, buforowania zasobów lokalnych, weryfikacji spójności (`npm run check-sw`).
6. **Aktualizacja Drzewa Projektu**:
   - Uwzględnienie `ToolsDrawerMenu.tsx`, katalogu stylów `themes/`, modułów testowych i skryptów walidacyjnych.
7. **Dziennik Zmian (Changelog v1.4)**:
   - Wyszczególnienie dodania Hamburger Drawer, modułowych motywów CSS, pełnej bazy 251 lekcji, optymalizatora pamięci i zgodności PWA.

#### B. Pliki `REGULAMIN.md` oraz `LICENSE.md`:
1. **Podniesienie wersji**: Aktualizacja do wersji `1.4 (obowiązuje od 2026 r.)`.
2. **Doprecyzowanie zapisów technicznych o danych (§ 5 Regulaminu)**:
   - Wskazanie magazynu `IndexedDB` jako podstawowej bazy dla rozdziałów, notatek i rysunków, a `localStorage` dla szybkich preferencji wyglądu.
   - Podkreślenie całkowitej suwerenności danych użytkownika i zerowej telemetrii.
3. **Utrzymanie Wolnej Licencji Prywatno-Edukacyjnej (WLPE)**:
   - Precyzyjne zachowanie darmowości dla osób prywatnych i szkół przy bezwzględnym zakazie komercjalizacji, redystrybucji i forkowania kodu.

#### C. Wbudowane Lekcje Instruktażowe w `src/defaultChapters.ts`:
1. **Lekcja 1 (`intro-multibook`)**:
   - Zaktualizowanie tabeli korzyści: 6 motywów barwnych WCAG AAA, menu narzędziowe Hamburger, IndexedDB.
   - Quiz: aktualizacja pytania o bazę danych z uwzględnieniem `IndexedDB`.
2. **Lekcja 2 (`guide-create-lesson`)**:
   - Opis uruchamiania kreatora przez menu Hamburger (`Menu` -> `Dane i Lekcje` -> `Dodaj nową lekcję` / `Edytuj temat`) oraz z paska bocznego.
3. **Lekcja 3 (`guide-teacher-panel`)**:
   - Pełny opis modułów klasowych, generatora harmonogramu z eksportem `.ics` oraz zestawu sprawdzianów.
4. **Lekcja 4 (`guide-whiteboard-tools`)**:
   - Dodanie informacji o Trybie Tablicy Szkolnej (Classroom Board Mode) dla ekranów Android i włączaniu tablicy z menu narzędziowego.
5. **Lekcja 5 (`guide-notes-and-media`)**:
   - Odświeżenie instrukcji korzystania z notatek, generowania PDF/HTML oraz pobierania plików Markdown.
6. **Lekcja 6 (`guide-backup-and-sync`)**:
   - Instrukcja selektywnego eksportu i importu kopii JSON oraz Menedżera Pamięci Podręcznej i Ekranów Android.
7. **Lekcja 7 (`guide-accessibility-and-themes`)**:
   - Rozbudowa z 5 do **6 profesjonalnych motywów**: szczegółowe omówienie nowego motywu *Tablica Szkolna (Maksymalny Kontrast AAA)* z zielonym tłem kredowym.
   - Opis szybkiego przycisku `Czytnik & Motyw` na pasku lekcji oraz pełnej palety w szufladzie menu.
8. **Lekcja 8 (`guide-terms-and-privacy`)**:
   - Zaktualizowanie do Wersji 1.4, uwzględnienie bazy `IndexedDB`, spójność z plikiem `REGULAMIN.md`.
9. **Lekcja 9 (`guide-license-wlpe`)**:
   - Zaktualizowanie do Wersji 1.4, spójność z plikiem `LICENSE.md`.

#### D. Oznaczenia Wersji w Interfejsie Aplikacji:
- Zaktualizowanie stopki paska bocznego w `src/App.tsx` z `v1.3` na `Interaktywny Multibook v1.4`.
- Zaktualizowanie domyślnej wersji backupu JSON i modali do `1.4`.

---

## 3. Key Product Decisions & Trade-Offs

### Decyzja 1: Jednoczesna synchronizacja plików repozytorium i bazy lekcji aplikacji
- **Wybrany wariant**: Aktualizacja zarówno plików `.md` na dysku, jak i obiektów lekcji w `src/defaultChapters.ts`.
- **Uzasadnienie**: Użytkownik korzystający z programu w trybie offline czyta instrukcje bezpośrednio na ekranie jako rozdziały lekcyjne. Gdybyśmy zmienili tylko `README.md`, użytkownik w aplikacji wciąż widziałby nieaktualne opisy „5 motywów” i stare ścieżki dostępu do narzędzi.
- **Alternatywa odrzucona**: Aktualizacja wyłącznie `README.md` (pozostawiłaby aplikację wewnętrznie niespójną).

### Decyzja 2: Podniesienie wersji do v1.4 zamiast zachowania v1.3
- **Wybrany wariant**: Oficjalne przejście na wersję 1.4.
- **Uzasadnienie**: Wprowadzenie nowego menu Hamburger Drawer, architektury motywów CSS z 6. paletą Tablicy Szkolnej, pełnego wsparcia pamięci `IndexedDB` oraz optymalizacji monitorów Android to znaczący krok rozwojowy uzasadniający wydanie wersji `v1.4`.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                   DOKUMENTACJA I WARSTWA INFORMACYJNA v1.4             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────┐             ┌──────────────┐             ┌──────────────┐
│  REPOZYTORIUM│             │   APLIKACJA  │             │ MODALE W APP │
│  (Pliki .md) │             │ (Lekcje w TS)│             │ (Prawne/Info)│
├──────────────┤             ├──────────────┤             ├──────────────┤
│ README.md    │             │ Lekcja 1-9 w │             │ Modal Licen- │
│ - Opis v1.4  │◄───────────►│ default-     │◄───────────►│ cji i Regu-  │
│ - Menu Drawer│  SPÓJNOŚĆ   │ Chapters.ts  │   SPÓJNOŚĆ  │ laminu       │
│ - 6 Motywów  │  TREŚCI     │ - Instrukcje │   WERSJI    │ (v1.4 WLPE)  │
│ - IndexedDB  │  I ZASAD    │ - 6 Motywów  │   I RODO    │ - Stopka     │
│ - PWA offline│             │ - Bezpiecz.  │             │   Sidebar v1.4│
│ REGULAMIN.md │             │ - Quizy RODO │             │ - JSON v1.4  │
│ LICENSE.md   │             │              │             │              │
└──────────────┘             └──────────────┘             └──────────────┘
```

### Spójność danych i testy
Po wprowadzeniu zmian w tekstach lekcji `src/defaultChapters.ts`:
- Uruchomienie skryptu `npm run validate` w celu automatycznej weryfikacji integralności unikalnych identyfikatorów pytań quizowych, balansu odpowiedzi i czasów czytania.
- Uruchomienie `npm test` dla potwierdzenia niezawodności warstwy IndexedDB.
- Uruchomienie `npm run check-sw` i `npm run lint` dla weryfikacji braku błędów składniowych i poprawności manifestu PWA.
