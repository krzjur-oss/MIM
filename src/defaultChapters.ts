import { Chapter } from './types';

export const DEFAULT_CHAPTERS: Chapter[] = [
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
    createdAt: Date.now() - 4000,
    content: `# Witaj w Cyfrowym Multibooku Edukacyjnym! 👋

Ten program to interaktywny podręcznik i zeszyt ćwiczeń zaprojektowany z myślą o nowoczesnej nauce stacjonarnej oraz offline. Działa w całości w Twojej przeglądarce i nie wymaga połączenia internetowego po załadowaniu.

---

### 🌟 Najważniejsze Możliwości Multibooka:

1. **Podział na Typy Szkół, Klasy oraz Rozdziały**:
   Nauczyciel może uczyć na różnych poziomach edukacyjnych! W menu bocznym można filtrować i grupować treści wg typu szkoły oraz konkretnej klasy (np. Klasa 1, Klasa 7) oraz według rozdziałów przedmiotowych.

2. **Wyświetlanie i Tworzenie Treści w Formacie Lekcji**:
   Każda lekcja posiada swój **Rozdział nadrzędny** (np. *Stworzenie świata*) oraz **Temat lekcji** (np. *Bóg stwarza świat z miłości*).

3. **Szkicownik na Żywo (Interaktywna Tablica) 🖌️**:
   Nauczyciel lub uczeń może rysować, zakreślać i pisać bezpośrednio na wyświetlanym tekście! Kliknij **„Uruchom Szkicownik”** w pasku narzędzi, aby zacząć nanosić notatki na ekranie (idealne do rzutników i tablic interaktywnych).

4. **Indywidualne Notatki Ucznia i Interaktywna Galeria Obrazów 📝🖼️**:
   Każdy materiał posiada dedykowany brudnopis, który automatycznie zapisuje się w pamięci lokalnej. Dodatkowo możesz **wklejać linki URL do obrazów** lub wybierać **edukacyjne ilustracje z podręcznej bocznej galerii przedmiotowej** (np. mikroskopy dla Biologii, mapy dla Geografii, równania dla Matematyki). Obrazy w notatkach są automatycznie wykrywane, można je powiększać w oknie podglądu (Lightbox), kopiować ich linki lub wstawiać bezpośrednio do notatek.

5. **Wizualne Wskaźniki Postępu (Ścieżka Lekcji) 🟢**:
   Na dole strony znajduje się interaktywny pasek kropek postępu. Pokazuje on, w którym miejscu podręcznika się znajdujesz, które lekcje zostały już ukończone (oznaczone ptaszkiem ✓) oraz pozwala na natychmiastowe przejście do wybranej lekcji po naciśnięciu lub najechaniu myszką (wyświetla się wtedy dymek podglądu z pełnym tytułem).

6. **Interaktywny Kalendarz i Historia Zrealizowanych Lekcji 📅**:
   Uczniowie mogą oznaczać lekcje jako ukończone, a nauczyciele przypisywać je do realizacji w swoich klasach! W panelu klas w menu bocznym po rozwinięciu klasy zobaczysz interaktywny kalendarz z zaznaczonymi dniami odbytych lekcji, szczegółową historię chronologiczną z dokładną datą i tematem lekcji oraz możliwość wycofania realizacji przyciskiem "Cofnij".

7. **Elastyczne Dostosowanie Wyglądu 🛠️**:
   * Zmieniaj wielkość czcionki, aby tekst był doskonale czytelny z końca klasy.
   * Dopasowuj **wysokość linii (interlinii)** bezpośrednio w panelu stylów na wąską, normalną lub szeroką, co natychmiast wpływa na czytelność całego tekstu.
   * Wybieraj spośród **5 uroczych motywów kolorystycznych** (Jasny, Ciemny, Ciepły Sepia, Pastelowy Niebieski oraz specjalny **Motyw Dyslektyczny** z ułatwioną dyslektyczną czcionką OpenDyslexic i łagodnym tłem).

---

### 📂 Jak dodać własne materiały?
Kliknij przycisk **„+ Dodaj lekcję”** w menu bocznym:
- Wybierz typ szkoły i klasę (np. *Szkoła Podstawowa*, *Klasa 1*).
- Podaj rozdział nadrzędny (np. *Stworzenie świata*).
- Podaj temat lekcji (np. *Bóg stwarza świat z miłości*).
- Wpisz treść i opcjonalne pytania testowe!`,
    quizzes: [
      {
        id: 'intro-q1',
        question: 'Gdzie są zapisywane Twoje prywatne notatki i nowo dodane rozdziały w tym Multibooku?',
        options: [
          'Na zewnętrznym serwerze w chmurze',
          'Lokalnie w pamięci przeglądarki (LocalStorage) - działają w pełni offline',
          'Są jednorazowe i znikają po zamknięciu karty',
          'W specjalnej bazie danych wymagającej logowania'
        ],
        correctAnswer: 1,
        explanation: 'Wszystkie dane są zapisywane lokalnie w Twojej przeglądarce, dzięki czemu aplikacja działa w 100% offline bez wysyłania jakichkolwiek informacji do sieci!'
      },
      {
        id: 'intro-q2',
        question: 'Która funkcja ułatwia pracę nauczyciela na lekcji z tablicą interaktywną lub rzutnikiem?',
        options: [
          'Tylko czytanie tekstu',
          'Wyłącznie import plików PDF',
          'Szkicownik na Żywo pozwalający pisać i rysować bezpośrednio na treści podręcznika',
          'Odtwarzacz plików MP3'
        ],
        correctAnswer: 2,
        explanation: 'Szkicownik na Żywo pozwala rysować i pisać po ekranie w czasie rzeczywistym, co jest bezcenne przy omawianiu tematów wspólnie z klasą.'
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
*   **Klucze Natury (Rostliny)** 🌳 – Piękne kwiaty o cudownym zapachu, soczyste owoce, drzewa, które dają nam cień.
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
Charakterystyczna rdzawo-czerwona barwa planety wynika z obecności **tlenku żelaza(III)** (po prostu rdzy) pokrywającego jej powierzchnię.

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
  }
];
