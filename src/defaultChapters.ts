import { Chapter } from './types';
import { RELIGIA_1_CHAPTERS_PART1 } from './chaptersReligia1_part1';
import { RELIGIA_1_CHAPTERS_PART2 } from './chaptersReligia1_part2';
import { RELIGIA_1_CHAPTERS_PART3 } from './chaptersReligia1_part3';
import { RELIGIA_2_CHAPTERS_PART1 } from './chaptersReligia2_part1';
import { RELIGIA_2_CHAPTERS_PART2 } from './chaptersReligia2_part2';
import { RELIGIA_2_CHAPTERS_PART3 } from './chaptersReligia2_part3';
import { RELIGIA_3_CHAPTERS_PART1 } from './chaptersReligia3_part1';
import { RELIGIA_3_CHAPTERS_PART2 } from './chaptersReligia3_part2';
import { RELIGIA_3_CHAPTERS_PART3 } from './chaptersReligia3_part3';
import { RELIGIA_4_CHAPTERS_PART1 } from './chaptersReligia4_part1';
import { RELIGIA_4_CHAPTERS_PART2 } from './chaptersReligia4_part2';
import { RELIGIA_4_CHAPTERS_PART3 } from './chaptersReligia4_part3';
import { RELIGIA_5_CHAPTERS_PART1 } from './chaptersReligia5_part1';
import { RELIGIA_5_CHAPTERS_PART2 } from './chaptersReligia5_part2';
import { RELIGIA_5_CHAPTERS_PART3 } from './chaptersReligia5_part3';
import { RELIGIA_6_CHAPTERS_PART1 } from './chaptersReligia6_part1';
import { RELIGIA_6_CHAPTERS_PART2 } from './chaptersReligia6_part2';
import { RELIGIA_6_CHAPTERS_PART3 } from './chaptersReligia6_part3';
import { RELIGIA_7_CHAPTERS_PART1 } from './chaptersReligia7_part1';
import { RELIGIA_7_CHAPTERS_PART2 } from './chaptersReligia7_part2';
import { RELIGIA_7_CHAPTERS_PART3 } from './chaptersReligia7_part3';
import { RELIGIA_8_CHAPTERS_PART1 } from './chaptersReligia8_part1';
import { RELIGIA_8_CHAPTERS_PART2 } from './chaptersReligia8_part2';
import { RELIGIA_8_CHAPTERS_PART3 } from './chaptersReligia8_part3';

const BASE_CHAPTERS: Chapter[] = [
  {
    id: 'intro-multibook',
    title: 'Wstęp do Interaktywnego Multibooka 📖',
    subject: 'Podręcznik / Instrukcja',
    schoolType: 'Ogólny / Pozostałe',
    grade: 'Ogólny',
    chapterGroup: 'Wprowadzenie',
    educationLevel: 'Ogólny',
    estimatedReadTime: 3,
    isDefault: true,
    lessonNumber: 1,
    createdAt: Date.now() - 7000,
    content: `# Witaj w Cyfrowym Multibooku Edukacyjnym! 👋

Ten program to **nowoczesny, interaktywny podręcznik i zeszyt ćwiczeń**, zaprojektowany z myślą o dydaktyce stacjonarnej w klasie oraz samodzielnej nauce w domu. Aplikacja działa w **100% w Twojej przeglądarce i nie wymaga stałego połączenia z Internetem** po jednokrotnym otwarciu.

---

### 🌟 Dlaczego Multibook to idealne narzędzie do nauki?

| Funkcja | Co zyskujesz? | Dla kogo? |
| :--- | :--- | :--- |
| **Hierarchiczny układ** | Przejrzysty podział na etapy (np. Szkoła Podstawowa), klasy (1–8) i działy tematyczne | Nauczyciel i Uczeń |
| **Szkicownik na Żywo** 🖌️ | Rysowanie, zakreślanie i wskaźnik laserowy bezpośrednio na treści lekcji | Tablice interaktywne i rzutniki |
| **Panel Nauczyciela** 👨‍🏫 | Zarządzanie klasami, terminarz, rejestr zrealizowanych lekcji i generator kartkówek | Nauczyciele i wychowawcy |
| **Interaktywne Quizy** ⚡ | Natychmiastowa weryfikacja wiedzy z wyjaśnieniem poprawnych odpowiedzi | Uczniowie i powtórki |
| **Notatki i Galeria** 📝🖼️ | Osobisty brudnopis z wklejaniem zdjęć oraz eksportem do pliku PDF/HTML | Każdy użytkownik |
| **Dostępność i Lektor** 👓🔊 | Tryb dyslektyczny (OpenDyslexic), synteza mowy (TTS) i 5 motywów barwnych | Wyrównywanie szans |

---

### 🗺️ Spis Treści Przewodnika po Aplikacji:
W tym dziale (**Wprowadzenie**) znajdziesz kompletne instrukcje krok po kroku do każdej funkcji programu:
1. **Lekcja 1**: Wstęp do Interaktywnego Multibooka *(bieżący temat)*
2. **Lekcja 2**: **Jak utworzyć i edytować własną lekcję ✍️** – przewodnik po kreatorze lekcji, formatowaniu Markdown i quizach
3. **Lekcja 3**: **Panel Nauczyciela i Organizacja Pracy 👨‍🏫** – zarządzanie klasami, terminarz, koło fortuny i generator testów
4. **Lekcja 4**: **Szkicownik na Żywo i Tryb Tablicy 🖌️** – narzędzia rysowania, zakreślacz, reflektor i wskaźnik
5. **Lekcja 5**: **Notatki, Galeria Obrazów i Eksport do PDF 📝** – prowadzenie brudnopisu i generowanie dokumentów
6. **Lekcja 6**: **Kopie Zapasowe, Import i Eksport Bazy 💾** – bezpieczne przechowywanie danych offline
7. **Lekcja 7**: **Ułatwienia Dostępności, Lektor TTS i Motywy 👓** – personalizacja czcionek, kolorów i głosu lektora
8. **Lekcja 8**: **Regulamin i Polityka Prywatności (RODO / Offline) 📜** – zasady darmowego użytku prywatnego i edukacyjnego
9. **Lekcja 9**: **Licencja Użytkowania (Wolna Licencja Prywatno-Edukacyjna) ⚖️** – warunki licencji WLPE, prawa autorskie i ograniczenia

---

> 💡 **Wskazówka:** Przejdź do kolejnych tematów za pomocą dolnych przycisków nawigacji lub klikając w kropki postępu na dole ekranu!`,
    quizzes: [
      {
        id: 'intro-q1',
        question: 'Gdzie są zapisywane Twoje prywatne notatki i nowo dodane rozdziały w tym Multibooku?',
        options: [
          'Na zewnętrznym serwerze w chmurze',
          'Lokalnie w pamięci Twojej przeglądarki (LocalStorage) – działają w 100% offline',
          'Są jednorazowe i znikają po zamknięciu karty',
          'W bazie danych wymagającej logowania i hasła'
        ],
        correctAnswer: 1,
        explanation: 'Wszystkie materiały, notatki i zrealizowane lekcje są bezpiecznie zapisywane w pamięci lokalnej Twojego urządzenia, co gwarantuje pełną prywatność i działanie bez internetu.'
      },
      {
        id: 'intro-q2',
        question: 'Która funkcja ułatwia pracę na lekcji z tablicą interaktywną lub rzutnikiem?',
        options: [
          'Tylko czytanie statycznego tekstu',
          'Wyłącznie import plików PDF',
          'Szkicownik na Żywo pozwalający pisać, zakreślać i rysować bezpośrednio na treści podręcznika',
          'Odtwarzacz plików MP3'
        ],
        correctAnswer: 2,
        explanation: 'Szkicownik na Żywo pozwala na nanoszenie odręcznych notatek, zakreśleń neonowych i figur bezpośrednio na wyświetlaną stronę w czasie rzeczywistym.'
      }
    ]
  },
  {
    id: 'guide-create-lesson',
    title: 'Jak utworzyć i edytować własną lekcję ✍️',
    subject: 'Podręcznik / Instrukcja',
    schoolType: 'Ogólny / Pozostałe',
    grade: 'Ogólny',
    chapterGroup: 'Wprowadzenie',
    educationLevel: 'Ogólny',
    estimatedReadTime: 4,
    isDefault: true,
    lessonNumber: 2,
    createdAt: Date.now() - 6000,
    content: `# Jak utworzyć i edytować własną lekcję ✍️

Multibook pozwala każdemu nauczycielowi oraz uczniowi na **tworzenie autorskich tematów lekcji**, rozbudowywanie programu nauczania o nowe przedmioty oraz swobodne modyfikowanie istniejących materiałów.

---

### 🚀 Krok 1: Otwarcie Kreatora Lekcji

Do modułu tworzenia i edycji lekcji możesz przejść na kilka wygodnych sposobów:
1. **Z lewego paska bocznego**: kliknij przycisk **„+ Dodaj lekcję”** na samej górze spisu treści.
2. **Z poziomu dowolnego tematu**: kliknij przycisk **„Edytuj temat”** w górnym nagłówku strony lub na dole pod treścią lekcji.
3. **Z listy tematów w menu**: najedź myszką na dowolny temat w spisie i kliknij ikonę ołówka ✏️.

---

### 📝 Krok 2: Uzupełnienie Formularza Tematu

W otwartym oknie kreatora wypełnij podstawowe metadane:
*   **Typ Szkoły / Etap edukacyjny**: wybierz z listy (np. *Szkoła Podstawowa*, *Liceum Ogólnokształcące*) lub wpisz własny (np. *Przedszkole*, *Technikum*).
*   **Klasa / Poziom**: wybierz konkretną klasę (np. *Klasa 4*, *Klasa 8*) lub zdefiniuj własną grupę.
*   **Dział / Rozdział nadrzędny**: wpisz nazwę modułu tematycznego (np. *Stworzenie świata*, *Biologia Komórki*, *Świat Starożytny*). Dzięki temu lekcje zostaną estetycznie pogrupowane w spisie treści!
*   **Temat lekcji / Tytuł**: główny tytuł lekcji, który będzie widoczny na liście i w nagłówku.
*   **Przedmiot / Kategoria**: nazwa przedmiotu (np. *Religia*, *Biologia*, *Historia*, *Informatyka*).
*   **Szacowany czas czytania**: orientacyjna liczba minut potrzebna na zapoznanie się z materiałem.

---

### 🎨 Krok 3: Formatowanie Treści w Standardzie Markdown

Treść lekcji wpisujesz w intuicyjnym formacie Markdown. Możesz w każdej chwili przełączać się między trybem **Edycji** a **Podglądem na żywo**:

*   **Nagłówki**: użyj znaku kratki, np. \`# Tytuł sekcji\` lub \`## Podtytuł\`
*   **Wyróżnienia**: \`**tekst pogrubiony**\`, \`*tekst pochylony*\`, \`__podkreślenie__\`
*   **Listy punktowane**: zacznij linię od gwiazdki lub myślnika: \`* Punkt pierwszy\`
*   **Listy numerowane**: wpisz numer z kropką: \`1. Krok pierwszy\`
*   **Cytaty i złote myśli**: zacznij od znaku większości: \`> Ważna myśl\`
*   **Tabele**: rozdzielaj kolumny pionowymi kreskami: \`| Kolumna A | Kolumna B |\`
*   **Wstawianie ilustracji**: wpisz \`![Opis](https://adres-obrazka.pl/zdjecie.jpg)\`
*   **Wzory i symbole**: wpisz formuły matematyczne lub symbole religijne i przyrodnicze

---

### ⚡ Krok 4: Dodawanie Interaktywnych Pytań Quizowych

Każda lekcja może posiadać własny **test sprawdzający wiedzę**:
1. W sekcji **„Dodaj pytanie quizowe”** wpisz treść pytania.
2. Uzupełnij warianty odpowiedzi (minimum 2 opcje, możesz dodać kolejne przyciskiem *+ Dodaj wariant*).
3. Kliknij na kropkę przy poprawnej odpowiedzi, aby oznaczyć klucz.
4. *(Opcjonalnie)* Wpisz **Dydaktyczne wyjaśnienie** – pojawi się ono uczniowi po zaznaczeniu odpowiedzi!
5. Kliknij **„+ Dodaj to pytanie do quizu”**.

---

### 💾 Krok 5: Zapisanie i Edycja

* Kliknij **„Zapisz temat w multibooku”**.
* Twój nowy temat pojawi się natychmiast w odpowiednim dziale i klasie.
* Możesz do niego wrócić w dowolnym momencie i zaktualizować tekst, dopisać nowe pytania lub zmienić dział!`,
    quizzes: [
      {
        id: 'guide-create-q1',
        question: 'W jaki sposób możesz pogrubić fragment tekstu w treści lekcji Markdown?',
        options: [
          'Wpisując <pogrubienie>tekst</pogrubienie>',
          'Otaczając tekst podwójnymi gwiazdkami: **tekst**',
          'Wpisując tekst wielkimi literami',
          'Otaczając tekst nawiasami kwadratowymi [tekst]'
        ],
        correctAnswer: 1,
        explanation: 'W standardzie Markdown pogrubienie tekstu uzyskujemy poprzez otoczenie go dwoma gwiazdkami z każdej strony: **ważny tekst**.'
      },
      {
        id: 'guide-create-q2',
        question: 'Czy po zapisaniu nowej lekcji można ją później modyfikować i edytować?',
        options: [
          'Nie, lekcje są jednorazowe i nie można ich zmieniać',
          'Tak, klikając przycisk „Edytuj temat” w nagłówku, stopce lub na liście tematów',
          'Tylko jeśli usuniemy plik z dysku komputera',
          'Tylko przez kontakt z administratorem serwera'
        ],
        correctAnswer: 1,
        explanation: 'Wszystkie tematy – zarówno autorskie, jak i domyślne – można w dowolnej chwili otworzyć w edytorze, zmienić treść, dodać pytania testowe lub zaktualizować dział.'
      }
    ]
  },
  {
    id: 'guide-teacher-panel',
    title: 'Panel Nauczyciela i Organizacja Pracy 👨‍🏫',
    subject: 'Podręcznik / Instrukcja',
    schoolType: 'Ogólny / Pozostałe',
    grade: 'Ogólny',
    chapterGroup: 'Wprowadzenie',
    educationLevel: 'Ogólny',
    estimatedReadTime: 5,
    isDefault: true,
    lessonNumber: 3,
    createdAt: Date.now() - 5000,
    content: `# Panel Nauczyciela i Organizacja Pracy 👨‍🏫

Panel Nauczyciela to dedykowane centrum dowodzenia stworzone specjalnie dla pedagogów i katechetów. Umożliwia sprawne prowadzenie zajęć, ewidencję postępów dydaktycznych oraz generowanie materiałów do druku.

---

### 🚪 Jak otworzyć Panel Nauczyciela?
Kliknij przycisk **„👨‍🏫 Panel Nauczyciela”** znajdujący się w prawym górnym pasku nawigacyjnym lub przełącz prawą zakładkę boczną na widok klas.

---

### 📋 Główne Moduły Panelu Nauczyciela:

#### 1. Zarządzanie Klasami i Uczniami 👥
*   **Tworzenie oddziałów**: Dodawaj klasy, które uczysz (np. *Klasa 4A*, *Klasa 7B*, *Kółko Biblijne*).
*   **Lista uczniów**: Wpisz imiona i nazwiska uczniów w danej klasie.
*   **Generator grup i par**: Jednym kliknięciem podziel obecnych uczniów na zrównoważone grupy robocze lub pary do ćwiczeń!

#### 2. Dziennik Realizacji Lekcji i Kalendarz 📅
*   **Odznaczanie tematów**: Po przeprowadzeniu lekcji kliknij **„Oznacz jako zrealizowaną w klasie”**.
*   **Kalendarz dydaktyczny**: System automatycznie zaznacza dni na osi czasu, w których odbyły się zajęcia.
*   **Historia chronologiczna**: Przeglądaj dokładną historię zrealizowanego materiału dla każdego oddziału z możliwością wycofania (przycisk *Cofnij*).

#### 3. Koło Fortuny i „Szczęśliwy Numerek” 🎲
*   **Losowanie ucznia**: Narzędzie do sprawiedliwego i bezstresowego wyboru ucznia do odpowiedzi lub wykonania zadania przy tablicy.
*   **Tryb bez powtórzeń**: Wylosowany uczeń zostaje tymczasowo odłożony, aby każdy miał równe szanse w trakcie semestru.

#### 4. Generator Planu Lekcji i Rozkładu Materiału ⏰
*   Wybierz klasę, dzień tygodnia (np. *Wtorek*), godzinę rozpoczęcia (np. *08:50*) oraz datę pierwszej lekcji.
*   Multibook **automatycznie rozpisze harmonogram wszystkich tematów** na kolejne tygodnie roku szkolnego!

#### 5. Kreator Sprawdzianów i Kartkówek (PDF do druku) 📄
*   Wybierz działy lub tematy, z których chcesz przeprowadzić sprawdzian.
*   System automatycznie skompiluje **gotowy arkusz testowy A4 dla ucznia** (z miejscem na imię, nazwisko, ocenę i punktację) oraz **klucz odpowiedzi dla nauczyciela**.
*   Możesz wydrukować arkusz bezpośrednio na drukarce lub zapisać jako estetyczny plik PDF.

---

> 💡 **Rada dydaktyczna:** Połącz Panel Nauczyciela ze Szkicownikiem na Żywo, aby w czasie rzeczywistym omawiać zadania z kartkówek na tablicy interaktywnej!`,
    quizzes: [
      {
        id: 'guide-teacher-q1',
        question: 'Do czego służy funkcja Dziennika Realizacji w Panelu Nauczyciela?',
        options: [
          'Do wysyłania e-maili do dyrekcji',
          'Do ewidencjonowania dat i tematów lekcji przeprowadzonych w poszczególnych klasach',
          'Do blokowania uczniom dostępu do Internetu',
          'Do automatycznego pisania notatek za uczniów'
        ],
        correctAnswer: 1,
        explanation: 'Dziennik Realizacji pozwala przypisywać ukończone tematy do poszczególnych oddziałów klasowych i śledzić ich realizację w kalendarzu dydaktycznym.'
      },
      {
        id: 'guide-teacher-q2',
        question: 'W jakiej formie Kreator Sprawdzianów przygotowuje materiały testowe?',
        options: [
          'Tylko jako dźwięk MP3',
          'Jako sformatowany arkusz A4 do bezpośredniego druku oraz plik PDF (wersja dla ucznia i klucz dla nauczyciela)',
          'Tylko jako surowy plik tekstowy bez formatowania',
          'Jako prezentację wideo'
        ],
        correctAnswer: 1,
        explanation: 'Kreator generuje profesjonalny, gotowy do druku arkusz testowy z nagłówkiem szkolnym, miejscem na podpis i punktację oraz osobnym kluczem odpowiedzi.'
      }
    ]
  },
  {
    id: 'guide-whiteboard-tools',
    title: 'Szkicownik na Żywo i Tryb Tablicy 🖌️',
    subject: 'Podręcznik / Instrukcja',
    schoolType: 'Ogólny / Pozostałe',
    grade: 'Ogólny',
    chapterGroup: 'Wprowadzenie',
    educationLevel: 'Ogólny',
    estimatedReadTime: 4,
    isDefault: true,
    lessonNumber: 4,
    createdAt: Date.now() - 4000,
    content: `# Szkicownik na Żywo i Tryb Tablicy 🖌️

Moduł **Szkicownika na Żywo** zamienia Twoją przeglądarkę w pełnoprawną **tablicę interaktywną**. Narzędzie zostało zoptymalizowane pod kątem rzutników multimedialnych, monitorów dotykowych (np. Promethean, SMART Board) oraz obsługi rysikiem i myszą.

---

### 🕹️ Jak uruchomić Szkicownik?
Kliknij przycisk **„🖌️ Szkicownik”** w górnym pasku narzędzi. Na ekranie pojawi się podręczny, pływający przybornik malarski.

---

### 🎨 Dwa Tryby Pracy Tablicy:

1. **Tryb Nakładki (Rysowanie po podręczniku)**:
   Pozwala zakreślać kluczowe pojęcia, dopisywać uwagi na marginesach i rysować strzałki bezpośrednio na czytanym tekście lekcji. Tekst pod spodem pozostaje w pełni widoczny!
2. **Tryb Czystej Tablicy (Whiteboard)**:
   Jednym kliknięciem przełącz tło na:
   *   **Klasyczną Białą Tablicę** (czysty biały arkusz)
   *   **Tablicę Kredową** (ciemnozielone tło)
   *   **Papier w Kratkę** (do geometrii, matematyki i wykresów)
   *   **Papier w Linie** (do ćwiczeń kaligraficznych i językowych)

---

### 🛠️ Przybornik Narzędzi Dydaktycznych:

*   **Pędzel / Pisak**: precyzyjne odręczne rysowanie i pisanie notatek.
*   **Neonowy Zakreślacz**: półprzezroczysty marker do podkreślania ważnych fragmentów w tekście.
*   **Linia Prosta i Strzałki**: idealne do tworzenia schematów, osi czasu i powiązań przyczynowo-skutkowych.
*   **Figury Geometryczne**: szybkie wstawianie idealnych prostokątów, elips i kół.
*   **Wskaźnik Laserowy 🔴**: pulsujący punkt świetlny skupiający wzrok uczniów bez pozostawiania śladów na ekranie.
*   **Reflektor (Spotlight) 🔦**: przyciemnia cały ekran poza wybranym kołem światła, skupiając 100% uwagi klasy na jednym elemencie.
*   **Gumka i Czyszczenie**: usuwanie pojedynczych pociągnięć lub natychmiastowe wyczyszczenie całej tablicy.

---

### 💾 Zapisywanie Rysunków
Wszystkie notatki naniesione na tablicy możesz w każdej chwili **zapisać jako plik graficzny PNG** i dołączyć do materiałów powtórkowych dla uczniów!`,
    quizzes: [
      {
        id: 'guide-board-q1',
        question: 'Do czego służy funkcja Reflektora (Spotlight) w szkicowniku?',
        options: [
          'Do zmiany koloru czcionki w całym podręczniku',
          'Do przyciemnienia tła i wyróżnienia pojedynczego fragmentu lekcji kręgiem światła',
          'Do wyłączania monitora',
          'Do automatycznego czytania tekstu'
        ],
        correctAnswer: 1,
        explanation: 'Reflektor pozwala skupić wzrok klasy na kluczowym fragmencie ilustracji lub tekstu poprzez przyciemnienie pozostałej części ekranu.'
      },
      {
        id: 'guide-board-q2',
        question: 'Jakie tła są dostępne w trybie Czystej Tablicy?',
        options: [
          'Tylko czarne tło bez opcji zmiany',
          'Biała tablica, zielona tablica kredowa, papier w kratkę oraz papier w linie',
          'Tylko tapeta ze zdjęciem',
          'Brak możliwości korzystania z czystej tablicy'
        ],
        correctAnswer: 1,
        explanation: 'Multibook oferuje różnorodne tła tablicowe dopasowane do specyfiki różnych przedmiotów szkolnych (w tym kratkę i linie).'
      }
    ]
  },
  {
    id: 'guide-notes-and-media',
    title: 'Notatki, Galeria Obrazów i Eksport do PDF 📝',
    subject: 'Podręcznik / Instrukcja',
    schoolType: 'Ogólny / Pozostałe',
    grade: 'Ogólny',
    chapterGroup: 'Wprowadzenie',
    educationLevel: 'Ogólny',
    estimatedReadTime: 4,
    isDefault: true,
    lessonNumber: 5,
    createdAt: Date.now() - 3000,
    content: `# Notatki, Galeria Obrazów i Eksport do PDF 📝

Każdy temat w Multibooku posiada **indywidualny zeszyt notatek ucznia i nauczyciela**, który zapisuje się automatycznie w czasie rzeczywistym.

---

### 📖 Prowadzenie Notatek do Lekcji

1. Otwórz prawy panel boczny i wybierz zakładkę **„📝 Notatki”**.
2. Wpisuj własne przemyślenia, punkty do zapamiętania, definicje lub odpowiedzi na zadania domowe.
3. Notatki wspierają pełne formatowanie Markdown (listy, pogrubienia, nagłówki).
4. **Automatyczny zapis**: nic nie przepada – treść jest na bieżąco utrwalana w pamięci przeglądarki.

---

### 🖼️ Galeria Obrazów i Praca z Multimediami

Do notatek możesz łatwo dołączać pomoce wizualne:
*   **Wbudowana Galeria Przedmiotowa**: wybieraj spośród gotowych, wysokiej jakości ilustracji edukacyjnych (mikroskopy, mapy, symbole religijne, portrety historyczne).
*   **Wklejanie Linków URL**: wklej adres dowolnego obrazka z sieci.
*   **Przeciągnij i Upuść (Drag & Drop)**: upuść plik graficzny bezpośrednio w obszarze notatek.
*   **Przeglądarka Lightbox**: kliknij na dowolną miniaturę, aby wyświetlić obraz w pełnym powiększeniu na całym ekranie.

---

### 🖨️ Eksport do PDF, Markdown i Druk

Swoje notatki możesz w każdej chwili przenieść poza aplikację:
*   **Pobierz jako .MD**: pobiera lekki plik tekstowy zgodny ze standardem Markdown.
*   **Generuj estetyczny PDF / Drukuj**: Multibook automatycznie kompiluje elegancki dokument z profesjonalnym nagłówkiem szkolnym, datą, tematem lekcji, nazwą przedmiotu i Twoją treścią – gotowy do druku lub archiwizacji.

---

### ⭐ Ulubione i Zakładki
Kliknij ikonę gwiazdki **„Dodaj do zakładek”** w nagłówku aktywnej lekcji, aby dodać materiał do listy szybkiego dostępu na samej górze spisu treści.`,
    quizzes: [
      {
        id: 'guide-notes-q1',
        question: 'Czy po wyjściu z aplikacji lub zamknięciu przeglądarki Twoje notatki zostaną utracone?',
        options: [
          'Tak, trzeba je za każdym razem zapisywać ręcznie na pendrive',
          'Nie, notatki zapisują się automatycznie w pamięci lokalnej i będą dostępne po ponownym otwarciu',
          'Zostaną skasowane po 10 minutach bezczynności',
          'Tylko jeśli klikniemy specjalny przycisk w chmurze'
        ],
        correctAnswer: 1,
        explanation: 'System automatycznego zapisu dba o natychmiastowe utrwalanie każdej wpisanej litery w bezpiecznej pamięci lokalnej Twojej przeglądarki.'
      },
      {
        id: 'guide-notes-q2',
        question: 'W jaki sposób możesz powiększyć ilustrację dołączoną do notatek?',
        options: [
          'Należy wydrukować ją na papierze',
          'Klikając na miniaturę obrazka, co otworzy pełnoekranowy podgląd Lightbox',
          'Przez zmianę rozdzielczości ekranu w systemie Windows',
          'Nie można powiększać ilustracji'
        ],
        correctAnswer: 1,
        explanation: 'Kliknięcie w dowolny obrazek otwiera elegancki, wyśrodkowany podgląd Lightbox z możliwością powiększenia i skopiowania odnośnika.'
      }
    ]
  },
  {
    id: 'guide-backup-and-sync',
    title: 'Kopie Zapasowe, Import i Eksport Bazy 💾',
    subject: 'Podręcznik / Instrukcja',
    schoolType: 'Ogólny / Pozostałe',
    grade: 'Ogólny',
    chapterGroup: 'Wprowadzenie',
    educationLevel: 'Ogólny',
    estimatedReadTime: 4,
    isDefault: true,
    lessonNumber: 6,
    createdAt: Date.now() - 2000,
    content: `# Kopie Zapasowe, Import i Eksport Bazy 💾

Multibook daje Ci **100% kontroli nad Twoimi danymi**. Wszystkie dodane tematy, notatki, struktury klas i historia realizacji mogą być łatwo wyeksportowane do jednego bezpiecznego pliku lub przeniesione na inny komputer.

---

### 📦 Eksport Pełnej Kopii Zapasowej (Backup JSON)

1. W menu bocznym kliknij przycisk **„💾 Kopia zapasowa”** lub przejdź do Centrum Zarządzania zakładki *Import / Eksport*.
2. Możesz wyeksportować **Wszystkie przedmioty** lub przefiltrować bazę do konkretnego przedmiotu (np. tylko *Religia* lub *Biologia*).
3. Kliknij **„Pobierz kopię zapasową (.json)”**.
4. Plik zostanie natychmiast zapisany w Twoim folderze Pobrane. Możesz zachować go na dysku, pendrive lub przesłać innemu nauczycielowi!

---

### 📥 Selektywny Import i Przywracanie Materiałów

Gdy otworzysz plik kopii zapasowej w programie, otrzymasz przejrzyste okno selekcji:
*   **Wyszukiwanie i Filtrowanie**: możesz łatwo przejrzeć zawartość pliku przed wgraniem.
*   **Wybór lekcji**: zaznacz tylko te tematy, które chcesz dodać (np. zaznacz tylko nowe rozdziały).
*   **Tryb Scalania (Merge)**: dodaje nowe lekcje i aktualizuje istniejące – Twoje obecne dane nie zostaną skasowane!
*   **Tryb Zastąpienia (Replace)**: czyści obecną bazę i zastępuje ją w 100% zawartością pliku.

---

### 📄 Przeciąganie Plików Markdown (.md i .txt)

Jeśli posiadasz własne scenariusze lekcji przygotowane w programach Word lub Notatnik:
1. Zapisz plik w formacie tekstowym '.txt' lub Markdown '.md'.
2. Otwórz Centrum Zarządzania i przeciągnij pliki myszką (Drag & Drop) na wyznaczone pole.
3. Multibook automatycznie wyodrębni tytuł, oszacuje czas czytania i utworzy z nich nowe tematy lekcji!

---

### 🔄 Odblokowanie Pełnego Programu Religii
W oknie kopii zapasowej znajduje się specjalny przycisk **„Odblokuj kompletny program Religii (Klasy 1–8)”**, który jednym kliknięciem wgrywa ponad 400 szczegółowo opracowanych jednostek lekcyjnych wraz z quizami i podziałem na działy.`,
    quizzes: [
      {
        id: 'guide-backup-q1',
        question: 'Czym różni się tryb „Scalania (Merge)” od trybu „Zastąpienia (Replace)” podczas importu?',
        options: [
          'Nie ma żadnej różnicy',
          'Scalanie dodaje nowe tematy bez kasowania Twoich dotychczasowych lekcji, a Zastąpienie nadpisuje całą bazę',
          'Zastąpienie działa tylko na telefonach komórkowych',
          'Scalanie usuwa wszystkie pytania quizowe'
        ],
        correctAnswer: 1,
        explanation: 'Tryb scalania (Merge) jest bezpieczny: dodaje brakujące lekcje i aktualizuje zmodyfikowane, nie usuwając pozostałych tematów.'
      },
      {
        id: 'guide-backup-q2',
        question: 'Czy kopię zapasową Multibooka (.json) można wgrać na innym komputerze w szkole?',
        options: [
          'Nie, plik działa tylko na jednym urządzeniu',
          'Tak, wystarczy przenieść plik .json i zaimportować go w przeglądarce na dowolnym komputerze',
          'Tylko po wykupieniu specjalnej licencji',
          'Tylko przez kabel USB podłączony do obu komputerów jednocześnie'
        ],
        correctAnswer: 1,
        explanation: 'Plik JSON jest w pełni przenośny – możesz łatwo przekazać swoje przygotowane lekcje kolegom z pracy lub załadować je na komputerze w klasie.'
      }
    ]
  },
  {
    id: 'guide-accessibility-and-themes',
    title: 'Ułatwienia Dostępności, Lektor TTS i Motywy 👓',
    subject: 'Podręcznik / Instrukcja',
    schoolType: 'Ogólny / Pozostałe',
    grade: 'Ogólny',
    chapterGroup: 'Wprowadzenie',
    educationLevel: 'Ogólny',
    estimatedReadTime: 4,
    isDefault: true,
    lessonNumber: 7,
    createdAt: Date.now() - 1000,
    content: `# Ułatwienia Dostępności, Lektor TTS i Motywy 👓

Edukacja włączająca i komfort pracy wzrokowej to fundament nowoczesnej szkoły. Multibook został wyposażony w zaawansowane narzędzia wspierające uczniów ze specjalnymi potrzebami edukacyjnymi (SPE), w tym z dysleksją i problemami ze wzrokiem.

---

### 🎨 5 Dopracowanych Motywów Kolorystycznych

W górnym panelu personalizacji możesz wybrać motyw najlepiej pasujący do warunków oświetleniowych w sali:
1. **Jasny (Szkolny)**: klasyczna, wysoka przejrzystość na ciepłym papierowym tle.
2. **Ciemny (Dark Mode)**: ochrona wzroku i redukcja zmęczenia przy słabym świetle.
3. **Ciepła Sepia (Papier książkowy)**: łagodne, kremowo-bursztynowe tony przypominające tradycyjną książkę.
4. **Pastelowy Błękit**: kojące chłodne barwy sprzyjające skupieniu.
5. **Specjalny Motyw Dyslektyczny**: żółtawo-kremowe tło o zoptymalizowanym kontraście niepowodującym olśnień.

---

### 📖 Czcionka OpenDyslexic i Regulacja Tekstu

*   **Krój OpenDyslexic**: specjalnie zaprojektowana czcionka z dociążoną podstawą liter. Zapobiega wrażeniu „obracania się”, „falowania” i przestawiania znaków w percepcji wzrokowej osób z dysleksją.
*   **Regulacja wielkości czcionki**: płynne skalowanie od 80% do 160% (tekst widoczny nawet z ostatnich ławek).
*   **Wysokość linii (Interlinia)**: wybór między interlinią *standardową*, *zwiększoną* i *szeroką*, co ułatwia śledzenie wersów linijka po linijce.

---

### 🔊 Wbudowany Lektor Mowy (Text-To-Speech)

Multibook potrafi czytać treść lekcji na głos czystym, naturalnym polskim głosem syntezatora:
*   **Czytanie całej lekcji**: kliknij przycisk **„🔊 Czytaj na głos”** w górnym pasku lekcji.
*   **Czytanie pojedynczej sekcji**: kliknij małą ikonę głośniczka obok dowolnego akapitu lub nagłówka.
*   **Sterowanie odtwarzaniem**: możliwość wstrzymania (pauza), wznowienia i natychmiastowego zatrzymania lektora.

---

### 🖥️ Tryb Pełnoekranowy i Tryb Skupienia (Zen)

*   **Pełny ekran (F11)**: ukrywa paski przeglądarki, maksymalizując przestrzeń na rzutniku.
*   **Zwijany pasek boczny**: jednym kliknięciem schowaj spis treści, aby skupić całą uwagę uczniów na treści bieżącego tematu.`,
    quizzes: [
      {
        id: 'guide-access-q1',
        question: 'W jaki sposób czcionka OpenDyslexic pomaga osobom ze specyficznymi trudnościami w czytaniu?',
        options: [
          'Zmienia język tekstu na łacinę',
          'Posiada pogrubione dolne krawędzie liter, co ułatwia orientację przestrzenną znaków i zapobiega ich obracaniu w percepcji wzrokowej',
          'Ukrywa trudne słowa',
          'Zmniejsza kontrast tekstu do zera'
        ],
        correctAnswer: 1,
        explanation: 'Krój OpenDyslexic wykorzystuje asymetrię i dociążenie dolnej części liter, dzięki czemu mózg łatwiej identyfikuje właściwy kierunek i kształt znaku.'
      },
      {
        id: 'guide-access-q2',
        question: 'Czy w Multibooku można odsłuchać pojedynczy akapit tekstu zamiast całej lekcji?',
        options: [
          'Nie, lektor zawsze czyta od początku do końca',
          'Tak, klikając ikonę głośniczka znajdującą się przy wybranym fragmencie tekstu',
          'Tylko jeśli nagramy własny plik audio',
          'Tylko w trybie ciemnym'
        ],
        correctAnswer: 1,
        explanation: 'Każda sekcja i akapit posiada własny przycisk lektora, umożliwiający odsłuchanie dokładnie tego fragmentu, który aktualnie omawiamy.'
      }
    ]
  },
  {
    id: 'guide-terms-and-privacy',
    title: 'Regulamin i Polityka Prywatności (RODO / Offline) 📜',
    subject: 'Podręcznik / Instrukcja',
    schoolType: 'Ogólny / Pozostałe',
    grade: 'Ogólny',
    chapterGroup: 'Wprowadzenie',
    educationLevel: 'Ogólny',
    estimatedReadTime: 4,
    isDefault: true,
    lessonNumber: 8,
    createdAt: Date.now() - 800,
    content: `# Regulamin i Polityka Prywatności aplikacji „Cyfrowy Multibook Edukacyjny” 📜

**Wersja 1.3 · obowiązuje od 2026 r.**

---

### 🛡️ Najważniejsze informacje w pigułce:
*   **Twórca i właściciel praw**: mgr Krzysztof Jureczek (*kjureczek@proton.me*, *github.com/krzjur-oss*).
*   **Licencja**: Wolna Licencja Prywatno-Edukacyjna (Zastrzeżona) — WLPE.
*   **Darmowy użytek**: 100% bezpłatny do **użytku prywatnego** oraz do **użytku edukacyjnego** w szkołach i placówkach oświatowych.
*   **Prywatność i RODO**: Program nie przesyła żadnych danych do sieci – wszystkie notatki, klasy i plany są zapisywane **wyłącznie lokalnie w pamięci Twojego urządzenia** (localStorage).

---

## § 1. Postanowienia ogólne

1. Niniejszy Regulamin określa zasady korzystania z aplikacji **„Cyfrowy Multibook Edukacyjny”** (dalej: „Aplikacja”), dostępnej w wersji online oraz pracującej w trybie offline w przeglądarce internetowej.
2. Właścicielem, twórcą i jedynym autorem Aplikacji jest **mgr Krzysztof Jureczek** (dalej: „Autor”).
3. Aplikacja dystrybuowana jest na warunkach **Wolnej Licencji Prywatno-Edukacyjnej (Zastrzeżonej) — WLPE** (pełna treść w pliku LICENSE.md oraz w oknie licencji programu). Regulamin i Licencja stanowią całość i obowiązują łącznie.
4. Korzystanie z Aplikacji oznacza pełną akceptację niniejszego Regulaminu oraz Licencji WLPE.

---

## § 2. Przeznaczenie Aplikacji

Aplikacja przeznaczona jest wyłącznie do:
1. **Użytku prywatnego** – bezpłatne korzystanie przez osoby fizyczne (uczniów, rodziców, samouków) w celach własnych, w tym powtórkowych, samokształceniowych i poznawczych.
2. **Użytku edukacyjnego** – bezpłatne wykorzystanie w placówkach oświatowych (przedszkola, szkoły podstawowe, licea, technika, szkoły branżowe, uczelnie wyższe, świetlice, biblioteki, placówki opiekuńczo-wychowawcze i terapeutyczne) w ramach lekcji, zajęć dydaktycznych, kół zainteresowań, katechezy i warsztatów.

Wszelkie inne zastosowania, w tym w szczególności komercyjne, odpłatne lub w ramach płatnych platform, wymagają uprzedniej pisemnej zgody Autora.

---

## § 3. Zasady korzystania

1. Aplikacja jest całkowicie bezpłatna dla celów prywatnych i edukacyjnych wskazanych w § 2.
2. Aplikacja nie zawiera żadnych reklam, banerów sponsorowanych, mikropłatności, płatnych subskrypcji ani ukrytych opłat.
3. Użytkownik zobowiązuje się do korzystania z Aplikacji zgodnie z jej przeznaczeniem, normami współżycia społecznego oraz obowiązującym prawem.
4. Zabronione jest podejmowanie działań mogących zakłócić działanie Aplikacji lub narazić innych użytkowników na szkodę.

---

## § 4. Prawa autorskie i warunki licencyjne

Wszelkie prawa do Aplikacji — w tym kod źródłowy, interfejs graficzny, moduły interaktywne (Szkicownik na Żywo, generator sprawdzianów, koło fortuny, kalendarz realizacji), treści lekcji, pytania quizowe oraz dokumentacja — należą wyłącznie do Autora i podlegają ochronie prawnoautorskiej.

| Zakres | Szczegółowe zasady |
| :--- | :--- |
| ❌ **Zabronione** | Kopiowanie kodu, dekompilacja, modyfikowanie, tworzenie forków, publikowanie na zewnętrznych serwerach/sklepach, sprzedaż, komercjalizacja lub odpłatne udostępnianie Aplikacji bądź jej części bez pisemnej zgody Autora. |
| ✅ **Dozwolone** | Korzystanie z Aplikacji zgodnie z przeznaczeniem (§ 2), prowadzenie zajęć w szkołach, tworzenie i eksportowanie własnych notatek/kartkówek oraz udostępnianie oficjalnego adresu Aplikacji innym nauczycielom i uczniom. |

---

## § 5. Dane i polityka prywatności (RODO / Pełna ochrona offline)

1. Aplikacja **nie wymaga rejestracji, tworzenia kont ani logowania** i nie przesyła jakichkolwiek danych na zewnętrzne serwery.
2. **Całkowita lokalność danych**: Wszelkie dane wprowadzane do Aplikacji (w tym: autorskie lekcje, notatki do tematów, listy klas i imiona uczniów, historia realizacji lekcji w kalendarzu, wyniki quizów, załączone grafiki oraz rysunki ze szkicownika) są przechowywane **wyłącznie lokalnie w pamięci Twojej przeglądarki internetowej** (localStorage) i nigdy nie opuszczają Twojego urządzenia.
3. **Administrator danych**: W rozumieniu przepisów RODO administratorem ewentualnych danych wprowadzanych do programu (np. imiona uczniów w klasie) jest wyłącznie sam Użytkownik końcowy (nauczyciel, placówka oświatowa) — Autor nie ma technicznego dostępu do tych danych.
4. **Brak śledzenia**: Aplikacja nie używa marketingowych plików cookies, nie korzysta ze skryptów śledzących (typu Google Analytics) ani nie profiluje użytkowników.
5. **Kontrola nad danymi**: Użytkownik może w każdej chwili wyeksportować swoje dane do pliku JSON (kopia zapasowa) lub trwale je usunąć, czyszcząc pamięć podręczną przeglądarki.

---

## § 6. Wyłączenie odpowiedzialności

1. Aplikacja udostępniana jest w stanie „takim, jakim jest” (as is), bez jakichkolwiek gwarancji prawidłowości czy nieprzerwanego działania.
2. Autor nie ponosi odpowiedzialności za ewentualną utratę danych (np. wskutek awarii przeglądarki lub wyczyszczenia pamięci podręcznej systemu) ani za szkody powstałe w wyniku korzystania z Aplikacji.
3. Zaleca się regularne pobieranie kopii zapasowej danych za pomocą wbudowanego przycisku **„💾 Eksport kopii zapasowej”**.

---

## § 7. Postanowienia końcowe

W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy prawa polskiego, w szczególności Kodeksu cywilnego oraz ustawy o prawie autorskim i prawach pokrewnych.

**Kontakt z Autorem:** mgr Krzysztof Jureczek · E-mail: kjureczek@proton.me · GitHub: github.com/krzjur-oss`,
    quizzes: [
      {
        id: 'guide-terms-q1',
        question: 'Dla jakich celów aplikacja Cyfrowy Multibook Edukacyjny jest całkowicie bezpłatna?',
        options: [
          'Tylko do celów komercyjnych w płatnych firmach',
          'Do darmowego użytku prywatnego oraz edukacyjnego (w szkołach, przedszkolach, uczelniach i placówkach oświatowych)',
          'Tylko przez pierwsze 7 dni okresu próbnego',
          'Wymaga comiesięcznej opłaty subskrypcyjnej'
        ],
        correctAnswer: 1,
        explanation: 'Aplikacja została udostępniona całkowicie bezpłatnie do darmowego użytku prywatnego (własnego) oraz edukacyjnego (w placówkach oświatowo-wychowawczych).'
      },
      {
        id: 'guide-terms-q2',
        question: 'Czy dane uczniów i notatki wprowadzane do programu są przesyłane na serwery zewnętrzne?',
        options: [
          'Tak, trafiają do zagranicznej bazy danych',
          'Nie, wszystkie dane są przechowywane w 100% lokalnie w pamięci przeglądarki (localStorage) i nigdy nie opuszczają urządzenia użytkownika',
          'Są wysyłane pocztą e-mail do producenta',
          'Tylko w weekendy'
        ],
        correctAnswer: 1,
        explanation: 'Aplikacja działa w trybie pełnego poszanowania prywatności (RODO offline) – wszelkie dane pozostają wyłącznie na Twoim urządzeniu.'
      }
    ]
  },
  {
    id: 'guide-license-wlpe',
    title: 'Licencja Użytkowania (Wolna Licencja Prywatno-Edukacyjna) ⚖️',
    subject: 'Podręcznik / Instrukcja',
    schoolType: 'Ogólny / Pozostałe',
    grade: 'Ogólny',
    chapterGroup: 'Wprowadzenie',
    educationLevel: 'Ogólny',
    estimatedReadTime: 5,
    isDefault: true,
    lessonNumber: 9,
    createdAt: Date.now() - 600,
    content: `# LICENCJA UŻYTKOWANIA OPROGRAMOWANIA ⚖️
## Wolna Licencja Prywatno-Edukacyjna (Zastrzeżona) — WLPE

### Projekt: Cyfrowy Multibook Edukacyjny (wersja 1.3 i wyższe)

**Właściciel praw autorskich i twórca:**
**mgr Krzysztof Jureczek**
*Copyright © 2026 Krzysztof Jureczek. Wszelkie prawa zastrzeżone.*

Kontakt: kjureczek@proton.me · GitHub: github.com/krzjur-oss

---

### PREAMBUŁA

Niniejsza licencja ma na celu zabezpieczenie niekomercyjnego charakteru projektu **„Cyfrowy Multibook Edukacyjny”**. Intencją Autora jest bezpłatne udostępnienie aplikacji do **użytku prywatnego** oraz placówkom edukacyjnym do **użytku dydaktycznego**, przy jednoczesnym pełnym zachowaniu praw autorskich, integralności kodu źródłowego oraz zakazie jakiejkolwiek komercjalizacji, kopiowania, modyfikacji i rozpowszechniania Oprogramowania bez pisemnej zgody Autora.

---

### § 1. DEFINICJE

1. **Oprogramowanie** – aplikacja „Cyfrowy Multibook Edukacyjny” wraz z całym kodem źródłowym, interfejsem, skompilowanymi plikami, materiałami metodycznymi, pytaniami quizowymi, grafiką, zasobami multimedialnymi oraz dokumentacją.
2. **Autor / Licencjodawca** – mgr Krzysztof Jureczek, jedyny twórca i wyłączny dysponent autorskich praw majątkowych i osobistych do Oprogramowania.
3. **Użytkownik / Licencjobiorca** – każda osoba fizyczna korzystająca z Oprogramowania w celach prywatnych / własnych, a także każda szkoła (podstawowa, ponadpodstawowa), przedszkole, uczelnia wyższa, świetlica lub inna placówka oświatowo-wychowawcza, opiekuńcza i terapeutyczna korzystająca z Oprogramowania w celach dydaktycznych.

---

### § 2. DOZWOLONY UŻYTEK (BEZPŁATNY)

Autor udziela Użytkownikowi bezpłatnej, niewyłącznej, nieprzenoszalnej i ograniczonej licencji na korzystanie z Oprogramowania wyłącznie w następujących celach:

1. **Użytek prywatny** – instalowanie, otwieranie i uruchamianie Oprogramowania przez osoby fizyczne na własny, niekomercyjny użytek, w tym w celach samokształceniowych, powtórkowych i poznawczych.
2. **Użytek edukacyjny** – bezpłatne wykorzystanie Oprogramowania w placówkach oświatowych (przedszkola, szkoły podstawowe, licea, technika, szkoły branżowe, uczelnie wyższe, świetlice szkolne, biblioteki, ogniska wychowawcze, poradnie psychologiczno-pedagogiczne oraz placówki terapeutyczne) w ramach zajęć dydaktycznych, lekcji, wykładów, kół zainteresowań, katechezy oraz warsztatów.
3. **Instalacja lokalna i tryb offline** – uruchamianie, buforowanie i przechowywanie Oprogramowania w pamięci urządzeń własnych Użytkownika lub pracowni komputerowych placówki w celach pracy bez dostępu do sieci Internet.
4. **Prezentacje niekomercyjne** – publiczne demonstrowanie działania Oprogramowania na konferencjach metodycznych, lekcjach otwartych, szkoleniach nauczycieli i spotkaniach popularyzujących nowoczesne technologie w edukacji, pod warunkiem wyraźnego wskazania autorstwa.

---

### § 3. ZAKAZY I OGRANICZENIA

Wszelkie działania wykraczające poza § 2 wymagają uprzedniej, bezwzględnej pisemnej zgody Autora. W szczególności **surowo zabrania się**:

1. **Kopiowania kodu i inżynierii wstecznej** – kopiowania, dekompilacji, dezasemblacji, inżynierii wstecznej, pobierania w celu tworzenia produktów pochodnych lub redystrybucji kodu źródłowego i plików Oprogramowania.
2. **Modyfikacji i ingerencji** – wprowadzania jakichkolwiek zmian w kodzie źródłowym, logice aplikacji, interfejsie, logotypach, treściach licencyjnych lub innych zasobach Oprogramowania bez zgody Autora.
3. **Rozpowszechniania i publikowania kopii** – dystrybuowania, odsprzedaży, sublicencjonowania, wynajmu, publikowania kopii, obrazów kontenerów lub „forków” Oprogramowania osobom trzecim, w tym za pośrednictwem serwisów GitHub, GitLab, forów internetowych, serwerów plików lub sklepów z aplikacjami.
4. **Sprzedaży i komercjalizacji** – pobierania jakichkolwiek bezpośrednich lub pośrednich opłat za dostęp, pobranie, instalację lub użytkowanie Oprogramowania, umieszczania go w płatnych pakietach komercyjnych, za paywallem, w serwisach z reklamami zarobkowymi lub świadczenia na jego bazie odpłatnych usług.
5. **Usuwania oznaczeń autorskich** – usuwania, zacierania, ukrywania lub modyfikowania informacji o Autorze, not copyright, logotypach, numerach wersji oraz odnośników do niniejszej Licencji i Regulaminu.

---

### § 4. WŁASNOŚĆ INTELEKTUALNA I INTEGRALNOŚĆ

1. Oprogramowanie oraz wszelkie prawa autorskie, prawa pokrewne i prawa własności przemysłowej stanowią wyłączną własność Autora.
2. Niniejsza licencja nie przenosi na Użytkownika jakichkolwiek majątkowych praw autorskich do Oprogramowania — udziela jedynie prawa do jego bezpłatnej, niekomercyjnej eksploatacji w granicach określonych w § 2.
3. Użytkownik zobowiązuje się zachować w nienaruszonym stanie wszystkie oznaczenia praw autorskich.

---

### § 5. WYŁĄCZENIE ODPOWIEDZIALNOŚCI (AS IS)

1. Oprogramowanie dostarczane jest w stanie takim, w jakim się znajduje („AS IS”), bez jakiejkolwiek rękojmi i gwarancji, wyraźnych lub dorozumianych, w tym gwarancji przydatności do określonego celu edukacyjnego lub technicznego.
2. Autor nie ponosi odpowiedzialności za ewentualną utratę danych, błędy przeglądarki, awarie sprzętu szkolnego lub jakiekolwiek szkody bezpośrednie i pośrednie wynikłe z korzystania bądź braku możliwości korzystania z Oprogramowania. Użytkownikom zaleca się korzystanie z wbudowanej funkcji tworzenia kopii zapasowych (eksport JSON).

---

### § 6. ROZWIĄZANIE LICENCJI

Naruszenie któregokolwiek z postanowień niniejszej licencji skutkuje jej natychmiastowym i bezwarunkowym wygaśnięciem. W takim przypadku Użytkownik zobowiązany jest do natychmiastowego zaprzestania korzystania z Oprogramowania oraz usunięcia wszelkich jego kopii ze swoich nośników i pamięci urządzeń.

---

### § 7. POSTANOWIENIA KOŃCOWE

W sprawach nieuregulowanych niniejszą licencją zastosowanie mają przepisy prawa Rzeczypospolitej Polskiej, w szczególności ustawy z dnia 4 lutego 1994 r. o prawie autorskim i prawach pokrewnych oraz Kodeksu cywilnego. Wszelkie spory rozstrzyga rzeczowo właściwy sąd powszechny dla miejsca zamieszkania Autora.

---
*© 2026 Krzysztof Jureczek · Wolna Licencja Prywatno-Edukacyjna (Zastrzeżona)*`,
    quizzes: [
      {
        id: 'guide-lic-q1',
        question: 'Co oznacza skrót WLPE w licencji oprogramowania Multibooka?',
        options: [
          'Wirtualna Licencja Płatna Elektronicznie',
          'Wolna Licencja Prywatno-Edukacyjna (Zastrzeżona)',
          'Wielomodułowa Licencja Przedsiębiorstwa Europejskiego',
          'Wstępna Licencja Programisty Edukatora'
        ],
        correctAnswer: 1,
        explanation: 'WLPE to Wolna Licencja Prywatno-Edukacyjna (Zastrzeżona), gwarantująca bezpłatny użytek prywatny i edukacyjny przy ochronie praw autorskich.'
      },
      {
        id: 'guide-lic-q2',
        question: 'Czy wolno sprzedawać program lub pobierać opłaty za jego udostępnianie bez pisemnej zgody Autora?',
        options: [
          'Tak, każdy może sprzedawać program w internecie',
          'Nie, jakakolwiek sprzedaż, komercjalizacja, pobieranie opłat czy usuwanie oznaczeń autorskich jest surowo zabronione',
          'Tylko jeśli zmienimy kolory interfejsu',
          'Tylko w szkołach niepublicznych'
        ],
        correctAnswer: 1,
        explanation: 'Licencja WLPE zabrania jakiejkolwiek komercjalizacji, redystrybucji za opłatą, usuwania oznaczeń autorskich czy tworzenia nieautoryzowanych kopii.'
      }
    ]
  },
  {
    id: 'religia-stworzenie-swiata',
    title: 'Bóg stwarza świat z miłości ❤️',
    subject: 'Religia',
    schoolType: 'Szkoła Podstawowa',
    grade: 'Klasa 1',
    chapterGroup: 'Stworzenie świata',
    educationLevel: 'Szkoła Podstawowa (Klasy 1-3)',
    estimatedReadTime: 3,
    isDefault: true,
    createdAt: Date.now() - 3000,
    content: `# Temat: Bóg stwarza świat z miłości 🌸

Bóg kocha każdego człowieka i z tej wielkiej miłości stworzył dla nas wspaniały, piękny świat. Wszystko, co widzimy wokół nas – od małego owada po wielkie góry – jest wspaniałym darem od Pana Boga dla nas!

---

### 🎨 Boży Plan Stworzenia Świata:
Popatrz, jak wspaniale Bóg ułożył świat dla nas krok po kroku:
*   **Światło i Ciemność** ☀️ – Bóg stworzył jasny dzień do zabawy i nauki oraz ciemną noc do odpoczynku i spokojnego snu.
*   **Niebo i Ziemia** 🌍 – Nasz dom, pełen koloru i powietrza, którym oddychamy.
*   **Klucze Natury (Rośliny)** 🌳 – Piękne kwiaty o cudownym zapachu, soczyste owoce, drzewa, które dają nam cień.
*   **Zwierzęta** 🐶 – Nasze ukochane zwierzątka: śpiewające ptaszki, skaczące pieski, mruczące kotki i ryby w wodzie.
*   **Człowiek** 🧑‍🤝‍🧑 – Najwspanialsze Boże stworzenie. Bóg stworzył nas na swój obraz i kocha nas najbardziej na świecie!

---

### 🕊️ Co to dla nas oznacza?
Świat jest pięknym ogrodem, który Pan Bóg powierzył nam w opiece. 
1.  **Dziękczynienie:** Możemy dziękować Bogu w modlitwie za każdą piękną rzecz: *„Dziękuję Ci, Boże, za słońce, za moją mamę i tatę, i za mojego pieska!”*
2.  **Troska o przyrodę:** Dbając o kwiaty, nie krzywdząc zwierząt i nie śmiecąc w lesie, okazujemy miłość Panu Bogu i szacunek do Jego dzieła.

> *„I widział Bóg, że wszystko, co uczynił, było bardzo dobre.” (Księga Rodzaju)*`,
    quizzes: [
      {
        id: 'rel-q1',
        question: 'Dlaczego Pan Bóg stworzył dla nas tak wspaniały i piękny świat?',
        options: [
          'Zrobił to przez przypadek',
          'Z wielkiej miłości do każdego z nas',
          'Zrobił to dla zabawy',
          'Chciał sprawdzić nasze siły'
        ],
        correctAnswer: 1,
        explanation: 'Pan Bóg stworzył świat, ponieważ kocha każdego z nas i chciał podarować nam piękny dom pełen darów natury do radosnego życia.'
      },
      {
        id: 'rel-q2',
        question: 'W jaki sposób dziecko w klasie 1 może podziękować Bogu i dbać o Jego stworzenie?',
        options: [
          'Niszcząc drzewa i rzucając śmieci na ziemię',
          'Ignorując przyrodę wokół siebie',
          'Modląc się z wdzięcznością oraz troszcząc się o zwierzęta i rośliny',
          'Bojąc się wszystkiego, co na świecie'
        ],
        correctAnswer: 2,
        explanation: 'Troszczenie się o zwierzątka, podlewanie kwiatów i krótka modlitwa z podziękowaniem to najpiękniejsze sposoby na szanowanie daru stworzenia.'
      }
    ]
  },
  {
    id: 'biology-cell',
    title: 'Budowa i Funkcjonowanie Komórki 🧬',
    subject: 'Biologia',
    schoolType: 'Szkoła Podstawowa',
    grade: 'Klasa 7',
    chapterGroup: 'Biologia Komórki',
    educationLevel: 'Szkoła Podstawowa (Klasy 7-8)',
    estimatedReadTime: 5,
    isDefault: true,
    createdAt: Date.now() - 2000,
    content: `# Budowa i Funkcjonowanie Komórki 🧬

Komórka jest podstawową jednostką strukturalną i funkcjonalną każdego organizmu żywego. Możemy ją porównać do doskonale zorganizowanej fabryki, w której każdy dział (organellum) ma ściśle określone zadania.

---

### 1. Podział Komórek
Ze względu na obecność jądra komórkowego, komórki dzielimy na:
*   **Prokariotyczne** (bezjądrowe) – np. bakterie. Ich DNA leży swobodnie w cytoplazmie.
*   **Eukariotyczne** (jądrowe) – np. komórki roślinne, zwierzęce i grzybowe. Posiadają jądro oddzielone od reszty komórki błoną jądrową.

---

### 2. Główne Organella i ich Zadania 🏭
Oto najważniejsze elementy wnętrza komórki eukariotycznej:

1.  **Jądro komórkowe** 🧠 – *„Centrum dowodzenia”*. Zawiera materiał genetyczny (DNA) i steruje wszystkimi procesami życiowymi komórki.
2.  **Mitochondrium** ⚡ – *„Elektrownia”*. To tutaj zachodzi proces oddychania komórkowego, w wyniku którego glukoza jest przekształcana w energię (ATP).
3.  **Błona komórkowa** 🛡️ – *„Portiernia”*. Chroni komórkę i kontroluje, jakie substancje wnikają do środka, a jakie ją opuszczają.
4.  **Cytoplazma** 💧 – Półpłynna substancja, w której zawieszone są organella i zachodzi większość reakcji chemicznych.
5.  **Rybosomy** 🧶 – Odpowiadają za produkcję (syntezę) białek niezbędnych do budowy i regeneracji.`,
    quizzes: [
      {
        id: 'bio-q1',
        question: 'Które organellum komórkowe nazywamy „elektrownią komórki”?',
        options: [
          'Jądro komórkowe',
          'Siatka śródplazmatyczna',
          'Mitochondrium',
          'Wakuola'
        ],
        correctAnswer: 2,
        explanation: 'Mitochondria są odpowiedzialne za generowanie energii w procesie oddychania komórkowego, dlatego nazywa się je elektrowniami.'
      },
      {
        id: 'bio-q2',
        question: 'Jaka jest rola jądra komórkowego?',
        options: [
          'Produkcja białek na zewnątrz komórki',
          'Przechowywanie wody i soli mineralnych',
          'Sterowanie życiem komórki i przechowywanie DNA',
          'Izolowanie komórki przed zimnem'
        ],
        correctAnswer: 2,
        explanation: 'Jądro komórkowe koordynuje wszystkie aktywności komórki, replikację DNA, podziały oraz syntezę białek poprzez instrukcje RNA.'
      }
    ]
  },
  {
    id: 'space-mars',
    title: 'Czerwona Planeta pod Lupą 🪐',
    subject: 'Geografia i Astronomia',
    schoolType: 'Szkoła Podstawowa',
    grade: 'Klasa 8',
    chapterGroup: 'Układ Słoneczny',
    educationLevel: 'Szkoła Podstawowa (Klasy 7-8)',
    estimatedReadTime: 4,
    isDefault: true,
    createdAt: Date.now() - 1000,
    content: `# Czerwona Planeta pod Lupą 🪐

Mars, nazywany **Czerwoną Planetą**, od wieków fascynuje ludzkość. Jest czwartą planetą od Słońca w Układzie Słonecznym i naszym najbliższym zewnętrznym sąsiadem. Dziś jest głównym celem planowanych misji załogowych.

---

### 1. Podstawowe Fakty o Marsie 📊
*   **Doba marsjańska (Sol)**: Trwa 24 godziny, 39 minut i 35 sekund.
*   **Rok na Marsie**: Wynosi aż 687 dni ziemskich.
*   **Temperatura**: Średnio wynosi około **-63 °C**.
*   **Atmosfera**: Bardzo rzadka, składająca się w 95% z dwutlenku węgla ($CO_2$).

---

### 2. Dlaczego Mars jest czerwony? 🔴
Characterystyczna rdzawo-czerwona barwa planety wynika z obecności **tlenku żelaza(III)** (po prostu rdzy) pokrywającego jej powierzchnię.

---

### 3. Rekordy Układu Słonecznego na Marsie 🏆
*   **Olympus Mons** 🏔️ – Najwyższa znana góra i wulkan w Układzie Słonecznym o wysokości **21,9 km**.
*   **Valles Marineris** 🕳️ – Potężny system kanionów rozciągający się na ponad 4000 km dł.`,
    quizzes: [
      {
        id: 'space-q1',
        question: 'Skąd bierze się czerwona barwa powierzchni Marsa?',
        options: [
          'Z gigantycznych pożarów lasów marsjańskich',
          'Z obecności obfitych złóż miedzi',
          'Z obfitości tlenku żelaza(III) - potocznie rdzy - pokrywającej planetę',
          'Z odbicia światła od pobliskiego Słońca'
        ],
        correctAnswer: 2,
        explanation: 'Powierzchnia Marsa jest pokryta drobnym pyłem bogatym w tlenki żelaza, czyli pospolitą rdzę, co nadaje planecie krwistoczerwony kolor.'
      },
      {
        id: 'space-q2',
        question: 'Jak nazywa się najwyższa góra wulkaniczna na Marsie i w całym Układzie Słonecznym?',
        options: [
          'Valles Marineris',
          'Olympus Mons',
          'Mauna Kea',
          'Góra Kościuszki'
        ],
        correctAnswer: 1,
        explanation: 'Olympus Mons to gigantyczny wulkan tarczowy o wysokości ponad 21 km, co czyni go niemal trzykrotnie wyższym od Mount Everestu.'
      }
    ]
  },
  {
    id: 'religia-8-bog-milosc',
    title: 'Bóg jest miłością ❤️',
    subject: 'Religia',
    schoolType: 'Szkoła Podstawowa',
    grade: 'Klasa 8',
    chapterGroup: 'Rozdział I: Powołanie do miłości i świętości',
    educationLevel: 'Szkoła Podstawowa (Klasy 7-8)',
    estimatedReadTime: 4,
    isDefault: true,
    lessonNumber: 1,
    createdAt: Date.now() - 500,
    content: `# Lekcja 1: Bóg jest miłością ❤️

> **Motto:** *„Miłość doskonali się w wierności.”* (Søren Kierkegaard)

---

### 🔑 SŁOWA KLUCZE
*   **Wartość** – dobro, które stanowi cel ludzkich dążeń.

Działanie Boga wypływa z miłości. On sam jest Miłością i dlatego obdarza nią wszystkich ludzi. Życie oparte na niej jest podstawowym powołaniem człowieka.

---

### 📖 BÓG MÓWI
Jezus poucza o miłości w przypowieściach:

> *„Ja jestem krzewem winnym, wy — latoroślami. Kto trwa we Mnie, a Ja w nim, ten przynosi owoc obfity, ponieważ bez Mnie nic nie możecie uczynić. (...) Jeżeli we Mnie trwać będziecie, a słowa moje w was, poproście, o cokolwiek chcecie, a to wam się spełni. (...) To wam powiedziałem, aby radość moja w was była i aby radość wasza była pełna. To jest moje przykazanie, abyście się wzajemnie miłowali, tak jak Ja was umiłowałem. Nikt nie ma większej miłości od tej, gdy ktoś życie swoje oddaje za przyjaciół swoich.”* (J 15,5.7.11-13)

> *„Zaprawdę, zaprawdę, powiadam wam: Kto nie wchodzi do owczarni przez bramę, ale wdziera się inną drogą, ten jest złodziejem i rozbójnikiem. Kto jednak wchodzi przez bramę, jest pasterzem owiec... Ja jestem dobrym pasterzem. Dobry pasterz daje życie swoje za owce...”* (J 10,1-17)

Bóg Ojciec chce, abyśmy byli wszczepieni w Jego Syna jak latorośle w winny krzew. Pragnie, abyśmy tworzyli jedną „żywą roślinę”, która przynosi owoce dobra i miłości. Jezus – Dobry Pasterz troszczy się o nas, kocha bezwarunkową miłością, aż do oddania życia.

---

### ⛪ NAUCZANIE KOŚCIOŁA
Papież Benedykt XVI naucza:
> *„Bóg jest miłością: kto trwa w miłości, trwa w Bogu, a Bóg trwa w nim” (1 J 4,16). (...) św. Jan daje nam jakby zwięzłą zasadę chrześcijańskiego życia: „Myśmy poznali i uwierzyli miłości, jaką Bóg ma ku nam”. Uwierzyliśmy miłości Boga — tak chrześcijanin może wyrazić podstawową opcję swego życia.* (Deus caritas est, 1)

Miłość Boża przejawia się w Jego obecności w naszym życiu. Miłować Boga to być z Nim.

---

### 🤔 POMYŚL
*   Jak dziękujesz Bogu za Jego miłość?
*   Jaką wartość ma miłość w Twoim życiu?
*   Co rozwijasz w sobie, aby trwać w Chrystusie?

---

### 🙏 POMÓDL SIĘ
**„Akt miłości”**
> *Boże, choć Cię nie pojmuję,*
> *jednak nad wszystko miłuję.*
> *Nad wszystko, co jest stworzone,*
> *boś Ty Dobro nieskończone.*

---

### 🏠 W DOMU
Ułóż modlitwę dziękczynną za dar Bożej miłości w Twoim życiu codziennym.

---

### 📝 ZASTANÓW SIĘ I ODPOWIEDZ
1.  **W czym objawiła się miłość Boga?**
2.  **Co to znaczy „trwać w Chrystusie”?**
3.  **Dlaczego Jezusa nazywamy Dobrym Pasterzem?**`,
    quizzes: [
      {
        id: 'rel8-1-q1',
        question: 'Co według Sørena Kierkegaarda doskonali się w wierności?',
        options: [
          'Nadzieja i ufność',
          'Wiara chrześcijańska',
          'Miłość',
          'Mądrość i sprawiedliwość'
        ],
        correctAnswer: 2,
        explanation: 'Motto lekcji autorstwa Kierkegaarda brzmi: „Miłość doskonali się w wierności.”'
      },
      {
        id: 'rel8-1-q2',
        question: 'Kto w przypowieści o krzewie winnym i latoroślach jest krzewem winnym?',
        options: [
          'Apostołowie i uczniowie',
          'Jezus Chrystus',
          'Ludzie świeccy i kapłani',
          'Aniołowie w niebie'
        ],
        correctAnswer: 1,
        explanation: 'Jezus wyraźnie mówi: „Ja jestem krzewem winnym, wy — latoroślami.” Bez trwania w Nim człowiek nie może przynieść owocu.'
      }
    ]
  },
  {
    id: 'religia-8-bierzmowanie',
    title: 'Bierzmowanie – początek drogi do dojrzałości 🕊️',
    subject: 'Religia',
    schoolType: 'Szkoła Podstawowa',
    grade: 'Klasa 8',
    chapterGroup: 'Rozdział III: Sakrament Bierzmowania i dary Ducha',
    educationLevel: 'Szkoła Podstawowa (Klasy 7-8)',
    estimatedReadTime: 4,
    isDefault: true,
    lessonNumber: 23,
    createdAt: Date.now() - 400,
    content: `# Lekcja 23: Bierzmowanie – początek drogi do dojrzałości 🕊️

> **Motto:** *„Duch Święty. Zastanawiając się nad tym, jaką odgrywa On rolę w mym życiu, dochodzę do wniosku, iż jest On tym, co wypełnia moje wnętrze i odróżnia dobro od zła, prawdę od kłamstwa...”* (Marek)

---

### 🔑 SŁOWA KLUCZE
*   **Bierzmowanie** – jeden z sakramentów wtajemniczenia chrześcijańskiego, jest dopełnieniem chrztu świętego.

Sakrament bierzmowania, do przyjęcia którego przygotowujesz się, daje szczególną moc, aby we współczesnym świecie mężnie wyznawać wiarę, którą przyjąłeś na chrzcie świętym.

---

### 📖 BÓG MÓWI
Umocnienie życia w wierze otrzymujemy w sakramencie bierzmowania. Po raz pierwszy tę moc otrzymali Apostołowie zgromadzeni w Wieczerniku:

> *„Kiedy nadszedł wreszcie Dzień Pięćdziesiątnicy, znajdowali się wszyscy razem na tym samym miejscu. Nagle dał się słyszeć z nieba szum, jakby uderzenie gwałtownego wiatru i napełnił cały dom, w którym przebywali. Ukazały się im też języki jakby z ognia, które się rozdzieliły, i na każdym z nich spoczął jeden. I wszyscy zostali napełnieni Duchem Świętym, i zaczęli mówić obcymi językami, tak jak im Duch pozwalał mówić...”* (Dz 2,1-4)

Dary Ducha Świętego otrzymali Apostołowie nie tylko dla siebie, ale także po to, aby przekazać je innym. Czynili to, jak świadczą Dzieje Apostolskie, przez modlitwę i wkładanie rąk (Dz 8,14-17; 19,6). Obecnie tego samego dzieła dokonują następcy Apostołów – biskupi, udzielając sakramentu bierzmowania. Znakiem widzialnym udzielania Ducha Świętego jest włożenie rąk, namaszczenie krzyżmem świętym i modlitwa.

---

### ⛪ NAUCZANIE KOŚCIOŁA
Kościół w Katechizmie naucza:
> *„Bierzmowanie udoskonala łaskę chrztu; jest ono sakramentem, który daje Ducha Świętego, aby głębiej zakorzenić nas w synostwie Bożym, ściślej wszczepić w Chrystusa, umocnić naszą więź z Kościołem, włączyć nas bardziej do jego posłania i pomóc w świadczeniu o wierze chrześcijańskiej słowem, któremu towarzyszą czyny”* (KKK 1316).

Ojciec Święty Jan Paweł II powiedział:
> *„Istotnym celem sakramentu bierzmowania jest udoskonalenie daru Ducha Świętego otrzymanego na chrzcie, tak aby przyjmujący go stał się zdolny do świadczenia o Chrystusie słowem i całym życiem”* (Watykan, 1 kwietnia 1992 r.).

---

### 🤔 POMYŚL
*   W jaki sposób przygotowujesz się do sakramentu bierzmowania w swojej parafii?
*   Jak na co dzień korzystasz z darów Ducha Świętego?
*   Jak dziękujesz Bogu za sakramenty wtajemniczenia chrześcijańskiego?

---

### 🙏 POMÓDL SIĘ
**„Modlitwa do Ducha Świętego”**
> *Oddychaj we mnie, Duchu Święty, abym o tym, co święte myślał!*
> *Pociągnij mnie, Duchu Święty, abym to, co święte czynił!*
> *Rozpal mnie, Duchu Święty, abym to, co święte miłował!*
> *Broń mnie, Duchu Święty, abym świętości nigdy nie utracił! Amen.*

---

### 🏠 W DOMU
Napisz krótki tekst o tym, do czego zobowiązuje Cię przyjęcie sakramentu bierzmowania w codziennym życiu szkolnym i rodzinnym.

---

### 📝 ZASTANÓW SIĘ I ODPOWIEDZ
1.  **Kiedy Apostołowie otrzymali dar mocy Ducha Świętego?**
2.  **Co to jest bierzmowanie?**
3.  **Wymień widzialne znaki udzielenia Ducha Świętego w liturgii.**`,
    quizzes: [
      {
        id: 'rel8-23-q1',
        question: 'Kto w Kościele katolickim jest zwyczajnym szafarzem sakramentu bierzmowania?',
        options: [
          'Dowolny katecheta świecki',
          'Biskup (jako następca Apostołów)',
          'Diakon pełniący służbę liturgiczną',
          'Proboszcz lub wikariusz w nagłych wypadkach'
        ],
        correctAnswer: 1,
        explanation: 'Zwyczajnym szafarzem bierzmowania jest biskup, co podkreśla łączność tego sakramentu z pierwszym wylaniem Ducha Świętego w Dniu Pięćdziesiątnicy.'
      },
      {
        id: 'rel8-23-q2',
        question: 'Jak nazywa się uroczysty dzień, w którym Apostołowie zostali napełnieni Duchem Świętym?',
        options: [
          'Dzień Pański (Niedziela)',
          'Wniebowstąpienie Pańskie',
          'Dzień Pięćdziesiątnicy (Zielone Świątki)',
          'Uroczystość Objawienia Pańskiego'
        ],
        correctAnswer: 2,
        explanation: 'Apostołowie zostali napełnieni Duchem Świętym w Dniu Pięćdziesiątnicy, który upamiętnia wylanie Ducha Świętego na rodzący się Kościół.'
      }
    ]
  },
  {
    id: 'religia-8-dary-ducha',
    title: 'Dary i charyzmaty Ducha Świętego 🌟',
    subject: 'Religia',
    schoolType: 'Szkoła Podstawowa',
    grade: 'Klasa 8',
    chapterGroup: 'Rozdział III: Sakrament Bierzmowania i dary Ducha',
    educationLevel: 'Szkoła Podstawowa (Klasy 7-8)',
    estimatedReadTime: 4,
    isDefault: true,
    lessonNumber: 24,
    createdAt: Date.now() - 300,
    content: `# Lekcja 24: Dary i charyzmaty Ducha Świętego w moim życiu 🌟

> **Motto:** *„Duch Święty — Dawca darów duchowych uświęca mnie, poucza, kieruje mną, umacnia, obdarza pokojem, męstwem, radością, miłością. (...) Przykrzyć sobie nie dam rady, gdy On wspiera moje kroki.”* (Weronika)

---

### 🔑 SŁOWA KLUCZE
*   **Dar** – podarunek, coś wartościowego ofiarowanego komuś w prezencie.
*   **Charyzmat** – nadzwyczajny dar Ducha Świętego, udzielony jakiejś osobie dla dobra wspólnoty.

Duch Święty swą misję realizuje w symbolu liczby siedem – siedem darów Ducha Świętego. Święty w naszym życiu chce zapalić siedem świateł – siedem znaków swojej mocy.

---

### 🌈 7 DARÓW DUCHA ŚWIĘTEGO:
1.  **Dar Mądrości** – pozwala patrzeć na świat przez pryzmat Bożej miłości i mądrze oceniać rzeczy doczesne.
2.  **Dar Rozumu** – pomaga głębiej rozumieć prawdy wiary i słowo Boże.
3.  **Dar Rady** – wspiera w podejmowaniu właściwych i zgodnych z sumieniem decyzji w trudnych sytuacjach.
4.  **Dar Męstwa** – daje siłę do pokonywania trudności, lęków i do mężnego wyznawania wiary.
5.  **Dar Umiejętności** – pomaga dostrzegać działanie Boga w otaczającym nas świecie i w nauce.
6.  **Dar Pobożności** – rozpala pragnienie modlitwy i synowskiego zaufania Bogu jako najlepszemu Ojcu.
7.  **Dar Bojaźni Bożej** – chroni przed grzechem i uczy głębokiego szacunku dla świętości Boga.

---

### 📖 BÓG MÓWI
Pismo Święte Starego Testamentu zapowiadało przyjście Zbawiciela, a także szczególne działanie Ducha Świętego:

> *„I wyrośnie różdżka z pnia Jessego, wypuści się odrośl z jego korzeni. I spocznie na niej Duch Pański, duch mądrości i rozumu, duch rady i męstwa, duch wiedzy i bojaźni Pańskiej”* (Iz 11,1-2)

O działaniu Ducha Świętego i Jego darach mówi św. Paweł:
> *„Wszystkim zaś objawia się Duch dla [wspólnego] dobra. Jednemu dany jest przez Ducha dar mądrości słowa, drugiemu dar poznawania według tego samego Ducha, innemu jeszcze dar wiary w tymże Duchu, innemu łaska uzdrawiania w jednym Duchu, innemu dar czynienia cudów, innemu proroctwo... Wszystko zaś sprawia jeden i ten sam Duch, udzielając każdemu tak, jak chce”* (1 Kor 12,7-11)

---

### ⛪ NAUCZANIE KOŚCIOŁA
Katechizm Kościoła Katolickiego wyjaśnia:
> *„Siedmioma darami Ducha Świętego są: mądrość, rozum, rada, męstwo, pobożność, umiejętność i bojaźń Boża. Chrystus, Syn Dawida, posiada je w całej pełni. Dopełniają one i udoskonalają cnoty tych, którzy je otrzymują. Czynią wiernych uległymi do ochotnego posłuszeństwa wobec natchnień Bożych”* (KKK 1831).

Katechizm młodych YOUCAT poucza:
> *„Duch Święty otwiera mnie na Boga, uczy mnie modlić się i pomaga mi być dla innych. „Cichy Gość naszej duszy” — tak nazywa Ducha Świętego św. Augustyn. Kto chce Go poczuć, musi się wyciszyć. Często Duch mówi w nas i rozmawia z nami bardzo cicho, choćby głosem naszego sumienia...”* (YOUCAT 120)

---

### 🤔 POMYŚL
*   Jak rozwijasz swoje umiejętności i zdolności?
*   Na ile pozwalasz, aby Duch Święty kierował Twoją wiarą i Twoim sumieniem?
*   Jak przygotowujesz się do przyjęcia darów Ducha Świętego?

---

### 🙏 POMÓDL SIĘ
> *Ty darzysz łaską siedemkroć,*
> *bo moc z prawicy Ojca masz.*
> *Przez Ojca obiecany nam,*
> *mową wzbogacasz język nasz.*
> *(słowa Hymnu do Ducha Świętego)*

---

### 🏠 W DOMU
Naucz się hymnu: „O Stworzycielu Duchu, przyjdź” lub napisz rozważanie na temat wybranego daru Ducha Świętego.

---

### 📝 ZASTANÓW SIĘ I ODPOWIEDZ
1.  **Wymień siedem darów Ducha Świętego.**
2.  **Co to jest charyzmat?**
3.  **Jakie jest znaczenie darów Ducha Świętego w życiu chrześcijanina?**`,
    quizzes: [
      {
        id: 'rel8-24-q1',
        question: 'Która liczba tradycyjnie symbolizuje pełnię darów Ducha Świętego?',
        options: [
          '3 - Trójca Święta',
          '7 - Siedem Darów',
          '10 - Przykazania Boże',
          '12 - Apostołowie'
        ],
        correctAnswer: 1,
        explanation: 'Tradycja Kościoła oraz Pismo Święte (por. Iz 11,1-2) wymieniają siedem darów Ducha Świętego, co symbolizuje ich duchową pełnię.'
      },
      {
        id: 'rel8-24-q2',
        question: 'Co to jest charyzmat zgodnie ze słownikiem słów kluczowych?',
        options: [
          'Specjalne pozwolenie na głoszenie kazań',
          'Nadzwyczajny dar Ducha Świętego udzielony dla dobra wspólnoty',
          'Złote naczynie liturgiczne używane w kościele',
          'Nazwa stopnia naukowego z teologii'
        ],
        correctAnswer: 1,
        explanation: 'Charyzmaty to nadzwyczajne, darmowe dary Ducha Świętego, które służą budowaniu całej wspólnoty Kościoła, a nie tylko osobie obdarowanej.'
      }
    ]
  },
  {
    id: 'religia-8-hanna-chrzanowska',
    title: 'Owocne życie – bł. Hanna Chrzanowska 🩺',
    subject: 'Religia',
    schoolType: 'Szkoła Podstawowa',
    grade: 'Klasa 8',
    chapterGroup: 'Rozdział V: Świadectwo i powołanie świeckich',
    educationLevel: 'Szkoła Podstawowa (Klasy 7-8)',
    estimatedReadTime: 5,
    isDefault: true,
    lessonNumber: 27,
    createdAt: Date.now() - 200,
    content: `# Lekcja 27: Owocne życie – bł. Hanna Chrzanowska 🩺

> **Motto:** *„Jeżeli Bóg w życiu jest na pierwszym miejscu, wszystko znajdzie się na właściwym miejscu.”* (św. Augustyn)

---

### 🔑 SŁOWA KLUCZE
*   **Owocne życie** – życie przynoszące korzyści, pełne dobrych dzieł dla drugiego człowieka.

Pierwsze i najważniejsze powołanie człowieka to świętość, którą można realizować na różnych drogach naszego życia.

---

### 📖 BÓG MÓWI
W Piśmie Świętym czytamy:

> *„Wszystko więc, co byście chcieli, żeby wam ludzie czynili, i wy im czyńcie! Albowiem na tym polega Prawo i Prorocy.”* (Mt 7,12)

Pan Jezus wskazuje nam, że powinniśmy żyć dla innych i zauważać ich potrzeby. W ten sposób swoje powołanie realizowała bł. Hanna Chrzanowska.

---

### 👩‍⚕️ ŻYCIORYS BŁ. HANNY CHRZANOWSKIEJ
Hanna Chrzanowska urodziła się 7 października 1902 r. w Warszawie. W 1920 r. ukończyła Gimnazjum Sióstr Urszulanek w Krakowie. Po maturze przeszła krótki kurs pielęgniarski, aby nieść pomoc ofiarom wojny polsko-bolszewickiej. W grudniu 1920 r. rozpoczęła studia polonistyczne na Uniwersytecie Jagiellońskim. Na wieść o powstaniu Warszawskiej Szkoły Pielęgniarstwa przerwała studia i wstąpiła do nowo otwartej szkoły, aby całkowicie poświęcić się opiece nad chorymi.

Ukończywszy szkołę w 1924 r. wyjechała na stypendia do Francji i Belgii, gdzie pogłębiała wiedzę z zakresu pielęgniarstwa społecznego. W latach 1929–1939 redagowała miesięcznik „Pielęgniarka Polska”.

Wybuch II wojny światowej przyniósł Hanni wiele bolesnych przeżyć – śmierć ojca w Katyniu, śmierć brata oraz cioci Zofii. Podczas okupacji niosła bezinteresowną pomoc uchodźcom, więźniom i przesiedlonym. Szczególną troską otaczała osierocone dzieci, w tym dzieci żydowskie, poszukując dla nich rodzin zastępczych.

Doświadczenie okrucieństwa wojny miało istotny wpływ na rozwój jej życia wewnętrznego. Był to czas szukania oparcia w Bogu, czas odkrywania siły modlitwy i znaczenia Eucharystii. 

Hanna Chrzanowska nie ukrywała swoich przekonań religijnych, dając czytelne świadectwo wiary. Organizowała przy parafii w Krakowie opiekę pielęgniarską i duszpasterską nad obłożnie chorymi. Zmarła w opinii świętości w Krakowie 29 kwietnia 1973 r. Jej uroczystościom pogrzebowym przewodniczył kard. Karol Wojtyła. 28 kwietnia 2018 r. w Sanktuarium Bożego Miłosierdzia w Krakowie-Łagiewnikach została ogłoszona błogosławioną. Nazywana jest **„Matką Teresą z Krakowa”**.

---

### 🤔 POMYŚL
*   Twoja nauka i praca to również powołanie. Czy dostrzegasz w nich odblask dobroci Boga?
*   Jak dbasz o zdrowie własne i innych ludzi?
*   Jak odnosisz się do człowieka chorego, cierpiącego lub samotnego?

---

### 🙏 POMÓDL SIĘ
> *Boże, który powołałeś błogosławioną Hannę do służby chorym, biednym i opuszczonym. Daj, aby ta, która całym sercem odpowiedziała Twemu wezwaniu, swoim przykładem stale zachęcała nas do niesienia pomocy bliźnim. Przez Chrystusa, Pana naszego. Amen.*

---

### 🏠 W DOMU
Uzasadnij krótko w zeszycie, dlaczego bł. Hannę Chrzanowską nazywa się „Matką Teresą z Krakowa”.

---

### 📝 ZASTANÓW SIĘ I ODPOWIEDZ
1.  **Wymień najważniejsze wydarzenia z życia bł. Hanny Chrzanowskiej.**
2.  **Kiedy nasze życie staje się owocne w oczach Boga i ludzi?**`,
    quizzes: [
      {
        id: 'rel8-27-q1',
        question: 'W którym roku i gdzie została ogłoszona błogosławioną Hanna Chrzanowska?',
        options: [
          'W 1973 roku w Rzymie przez papieża Pawła VI',
          'W 2018 roku w Sanktuarium Bożego Miłosierdzia w Krakowie-Łagiewnikach',
          'W 2005 roku w Warszawie przez papieża Benedykta XVI',
          'W 2023 roku w Radomiu przez biskupa diecezjalnego'
        ],
        correctAnswer: 1,
        explanation: 'Hanna Chrzanowska została beatyfikowana 28 kwietnia 2018 roku w Sanktuarium Bożego Miłosierdzia w Krakowie-Łagiewnikach.'
      },
      {
        id: 'rel8-27-q2',
        question: 'Jakim mianem określa się bł. Hannę Chrzanowską ze względu na jej niezwykłą opiekę nad chorymi?',
        options: [
          'Apostołka Trędowatych',
          'Matka Teresa z Krakowa',
          'Opiekunka Rodzin Katolickich',
          'Święta Pielęgniarka z Warszawy'
        ],
        correctAnswer: 1,
        explanation: 'Dzięki swojemu bezgranicznemu poświęceniu dla chorych i najuboższych zyskała zaszczytne miano „Matki Teresy z Krakowa”.'
      }
    ]
  },
  {
    id: 'religia-8-adwent',
    title: 'Adwent – czas czuwania 🕯️',
    subject: 'Religia',
    schoolType: 'Szkoła Podstawowa',
    grade: 'Klasa 8',
    chapterGroup: 'Rozdział VII: Rok Liturgiczny',
    educationLevel: 'Szkoła Podstawowa (Klasy 7-8)',
    estimatedReadTime: 4,
    isDefault: true,
    lessonNumber: 56,
    createdAt: Date.now() - 100,
    content: `# Lekcja 56: Adwent – czas czuwania 🕯️

> **Motto:** *„Świat na Ciebie czeka Panie, jak na sen zmęczony dzień. Tak jak miłość na spotkanie, jak na deszcze kwiatów cień...”* (słowa pieśni)

---

### 🔑 SŁOWA KLUCZE
*   **Adwent** – słowo pochodzi z języka łacińskiego *adventus* i oznacza przyjście; okres liturgiczny przygotowujący do Bożego Narodzenia oraz na ostateczne przyjście Chrystusa przy końcu czasów.

Adwentem Kościół rozpoczyna rok liturgiczny. Pierwsza niedziela Adwentu przypada między 27 listopada a 3 grudnia i kończy się w wigilię Bożego Narodzenia.

---

### 📖 BÓG MÓWI
Jan Chrzciciel, wzywając ludzi do nawrócenia, przywołał słowa proroka Izajasza:

> *„Jak jest napisane w księdze mów proroka Izajasza: Głos wołającego na pustyni: Przygotujcie drogę Panu, prostujcie ścieżki dla Niego! Każda dolina niech będzie wypełniona, każda góra i pagórek zrównane, drogi kręte niech się staną prostymi, a wyboiste drogami gładkimi! I wszyscy ludzie ujrzą zbawienie Boże”* (Łk 3,4-6)

Oczekiwanie towarzyszy człowiekowi we wszystkich jego poszukiwaniach i spotkaniach. Adwent jest porą nadziei, czasem nawrócenia i odnowy, dawania świadectwa Bożemu Narodzeniu, a także czuwania.

---

### ⛪ NAUCZANIE KOŚCIOŁA
W Katechizmie Kościoła Katolickiego czytamy:
> *„Celebracja liturgii Adwentu aktualizuje oczekiwanie Mesjasza; uczestnicząc w długim przygotowaniu pierwszego przyjścia Zbawiciela, wierni odnawiają gorące pragnienie Jego drugiego Przyjścia”* (KKK 524).

Papież Jan Paweł II wyjaśnia nam, co to znaczy czuwać:
> *„Co to znaczy: „czuwam”? To znaczy, że staram się być człowiekiem sumienia. Że tego sumienia nie zagłuszam i nie zniekształcam. Wypracowuję w sobie dobro, a ze zła staram się poprawiać, przezwyciężać je w sobie. To taka bardzo podstawowa sprawa, której nigdy nie można pomniejszać, zepchnąć na dalszy plan (...) Czuwam — to znaczy miłość bliźniego — to znaczy: podstawowa międzyludzka solidarność”* (Jasna Góra, 18 czerwca 1983 r.).

---

### 🤔 POMYŚL
*   Co uczynisz, by być prawdziwym człowiekiem Adwentu – czuwania?
*   Co zmienisz, by tegoroczne przeżywanie Adwentu zaowocowało pogłębieniem Twojego życia religijnego?

---

### 🙏 POMÓDL SIĘ
> *Boże, spraw, byśmy zaszczyceni zaproszeniem do świętowania Twoich Urodzin mogli przynieść Ci w prezencie klucz do każdego zakamarka domu naszego wnętrza. Prosimy, oświeć je, przemień i uzdrawiaj według Twojej woli. Amen.*

---

### 🏠 W DOMU
Napisz krótki dekalog czuwania, jak dziś powinno wyglądać adwentowe oczekiwanie w życiu współczesnego młodego chrześcijanina.

---

### 📝 ZASTANÓW SIĘ I ODPOWIEDZ
1.  **Wyjaśnij etymologię i znaczenie słowa „Adwent”.**
2.  **Jakie znaczenie ma Adwent w liturgii Kościoła?**
3.  **Co to znaczy „czuwać” według nauczania św. Jana Pawła II?**`,
    quizzes: [
      {
        id: 'rel8-56-q1',
        question: 'Z jakiego języka wywodzi się słowo "Adwent" i co ono oznacza?',
        options: [
          'Z greki i oznacza podziękowanie',
          'Z łaciny i oznacza przyjście',
          'Z języka hebrajskiego i oznacza zbawiciel',
          'Z łaciny i oznacza czuwanie sumienia'
        ],
        correctAnswer: 1,
        explanation: 'Słowo „Adwent” pochodzi z łacińskiego słowa „adventus”, które dosłownie oznacza „przyjście”.'
      },
      {
        id: 'rel8-56-q2',
        question: 'Kogo św. Jan Paweł II podaje jako wzór w swojej definicji słowa „czuwam”?',
        options: [
          'Człowieka o bogatych talentach',
          'Człowieka sumienia, dbającego o dobro bliźnich',
          'Osobę, która nigdy nie śpi',
          'Uczonego badającego Biblię'
        ],
        correctAnswer: 1,
        explanation: 'Papież Jan Paweł II wyjaśniał: „Czuwam — to znaczy, że staram się być człowiekiem sumienia. Że tego sumienia nie zagłuszam...”'
      }
    ]
  },
  {
    id: 'religia-8-triduum',
    title: 'Liturgia Triduum Paschalnego ✝️',
    subject: 'Religia',
    schoolType: 'Szkoła Podstawowa',
    grade: 'Klasa 8',
    chapterGroup: 'Rozdział VII: Rok Liturgiczny',
    educationLevel: 'Szkoła Podstawowa (Klasy 7-8)',
    estimatedReadTime: 4,
    isDefault: true,
    lessonNumber: 61,
    createdAt: Date.now() - 50,
    content: `# Lekcja 61: Liturgia Triduum Paschalnego ✝️

> **Motto:** *„Trzy dni, które zmieniły Ziemię, Męka Śmierć i Zmartwychwstanie... Czy kiedykolwiek pojmiemy tajemnicę tych wydarzeń? Grób jest pusty, Jezusa tam nie ma, tylko całun pozostał...”* (słowa pieśni)

---

### 🔑 SŁOWA KLUCZE
*   **Triduum Paschalne** – najważniejsze wydarzenie w roku liturgicznym, którego istotą jest celebracja Męki, Śmierci i Zmartwychwstania Chrystusa.

W jedności Triduum Paschalnego kryje się sedno chrześcijańskiego przesłania: życie rodzi się ze śmierci. Celebrując zbawcze wydarzenia, stajemy się ich czynnymi uczestnikami.

---

### 🗓️ TRZY ETAPY TRIDUUM PASCHALNEGO:
1.  **Wielki Czwartek (wieczór)** – Msza Wieczerzy Pańskiej. Upamiętnia ustanowienie sakramentów Eucharystii i Kapłaństwa oraz nowe przykazanie miłości.
2.  **Wielki Piątek** – Liturgia Męki Pańskiej. Dzień zbawczej śmierci Jezusa na krzyżu. W Kościele nie sprawuje się Mszy świętej. W centrum stoi adoracja Krzyża.
3.  **Wielka Sobota / Wigilia Paschalna (wieczór)** – Spoczynek Jezusa w grobie pańskim, a po zachodzie słońca najbardziej uroczysta liturgia roku – Wigilia Paschalna, obwieszczająca Zmartwychwstanie.

---

### 📖 BÓG MÓWI
W Piśmie Świętym czytamy o ustanowieniu Eucharystii:

> *„Ja bowiem otrzymałem od Pana to, co wam przekazałem, że Pan Jezus tej nocy, kiedy został wydany, wziął chleb i dzięki uczyniwszy połamał i rzekł: «To jest Ciało moje za was wydane. Czyńcie to na moją pamiątkę!» (...) Ilekroć bowiem spożywacie ten chleb albo pijecie kielich, śmierć Pańską głosicie, aż przyjdzie”* (1 Kor 11,23-26)

Wielki Piątek to dzień męki i śmierci Chrystusa. Centralnym momentem dnia jest liturgia adoracji Krzyża:
> *„Zabrali zatem Jezusa. A On sam dźwigając krzyż wyszedł na miejsce zwane Miejscem Czaszki... Tam Go ukrzyżowali, a z Nim dwóch innych, z jednej i drugiej strony, pośrodku zaś Jezusa...”* (J 19,16b-19)

---

### ⛪ NAUCZANIE KOŚCIOŁA
Katechizm Kościoła Katolickiego poucza nas:
> *„Misterium Paschalne ma dwa aspekty: przez swoją śmierć Chrystus wyzwala nas od grzechu; przez swoje Zmartwychwstanie otwiera nam dostęp do nowego życia. Polega ono na zwycięstwie nad śmiercią i na nowym uczestnictwie w łasce...”* (KKK 654).

---

### 🤔 POMYŚL
*   Chrystusowy czyn Wieczernika to wielka uczta ofiarna. Co czynisz, aby zachęcić rówieśników do pełnego udziału w liturgii Triduum Paschalnego?
*   Jak duchowo przygotowujesz się do radosnego świętowania Zmartwychwstania Pańskiego?

---

### 🙏 POMÓDL SIĘ
> *Wszechmogący, wieczny Boże, Ty Jednorodzonego Syna swego ustanowiłeś Odkupicielem świata i krwią Jego dałeś się przebłagać. Daj nam, prosimy, godnie czcić zapłatę naszego zbawienia i dzięki niej doznawać obrony od zła doczesnego na ziemi, abyśmy wiekuistym szczęściem radowali się w niebie. Przez Chrystusa, Pana naszego. Amen.*

---

### 🏠 W DOMU
Ułóż krótkie wezwanie modlitewne o głębokie i owocne przeżycie sakramentalne tegorocznego Triduum Paschalnego.

---

### 📝 ZASTANÓW SIĘ I ODPOWIEDZ
1.  **Czym jest Triduum Paschalne?**
2.  **Jakie kluczowe wydarzenia upamiętniają poszczególne dni Triduum Paschalnego?**
3.  **Jakie są dwa podstawowe aspekty Misterium Paschalnego?**`,
    quizzes: [
      {
        id: 'rel8-61-q1',
        question: 'Które sakramenty zostały ustanowione w Wielki Czwartek podczas Ostatniej Wieczerzy?',
        options: [
          'Chrzest św. i Bierzmowanie',
          'Pokuta (spowiedź) i Namaszczenie Chorych',
          'Eucharystia (Najświętszy Sakrament) i Kapłaństwo',
          'Małżeństwo i Chrzest'
        ],
        correctAnswer: 2,
        explanation: 'Podczas Ostatniej Wieczerzy w Wielki Czwartek Pan Jezus ustanowił sakramenty Eucharystii oraz Kapłaństwa.'
      },
      {
        id: 'rel8-61-q2',
        question: 'Która liturgia stanowi szczyt i centrum całego roku liturgicznego?',
        options: [
          'Droga Krzyżowa w Wielki Piątek rano',
          'Liturgia Wigilii Paschalnej celebrowana w Wielką Sobotę wieczorem',
          'Pasterka w noc Bożego Narodzenia',
          'Nabożeństwo Gorzkich Żali'
        ],
        correctAnswer: 1,
        explanation: 'Wigilia Paschalna, sprawowana w noc Wielkiej Soboty, jest szczytem roku liturgicznego i najgłębszym wyrazem wiary w Zmartwychwstanie.'
      }
    ]
  }
];

export const DEFAULT_CHAPTERS: Chapter[] = BASE_CHAPTERS.filter((c) => c.subject !== 'Religia');

export const ALL_RELIGIA_CHAPTERS: Chapter[] = [
  ...BASE_CHAPTERS.filter((c) => c.subject === 'Religia'),
  ...RELIGIA_1_CHAPTERS_PART1,
  ...RELIGIA_1_CHAPTERS_PART2,
  ...RELIGIA_1_CHAPTERS_PART3,
  ...RELIGIA_2_CHAPTERS_PART1,
  ...RELIGIA_2_CHAPTERS_PART2,
  ...RELIGIA_2_CHAPTERS_PART3,
  ...RELIGIA_3_CHAPTERS_PART1,
  ...RELIGIA_3_CHAPTERS_PART2,
  ...RELIGIA_3_CHAPTERS_PART3,
  ...RELIGIA_4_CHAPTERS_PART1,
  ...RELIGIA_4_CHAPTERS_PART2,
  ...RELIGIA_4_CHAPTERS_PART3,
  ...RELIGIA_5_CHAPTERS_PART1,
  ...RELIGIA_5_CHAPTERS_PART2,
  ...RELIGIA_5_CHAPTERS_PART3,
  ...RELIGIA_6_CHAPTERS_PART1,
  ...RELIGIA_6_CHAPTERS_PART2,
  ...RELIGIA_6_CHAPTERS_PART3,
  ...RELIGIA_7_CHAPTERS_PART1,
  ...RELIGIA_7_CHAPTERS_PART2,
  ...RELIGIA_7_CHAPTERS_PART3,
  ...RELIGIA_8_CHAPTERS_PART1,
  ...RELIGIA_8_CHAPTERS_PART2,
  ...RELIGIA_8_CHAPTERS_PART3
];
