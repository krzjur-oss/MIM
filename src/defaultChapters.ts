import { Chapter } from './types';
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
   Każdy materiał posiada dedykowany brudnopis, który automatycznie zapisuje się w pamięci lokalnej. Dodatkowo możesz **wklejać linki URL do obrazów** lub wybierać **edukacyjne ilustracje z podręcznej bocznej galerii przedmiotowej** (np. mikroskopy dla Biologii, mapy dla Geografii, równania dla Matematyki). Obrazy w notatkach are automatycznie wykrywane, można je powiększać w oknie podglądu (Lightbox), kopiować ich linki lub wstawiać bezpośrednio do notatek.

5. **Wizualne Wskaźniki Postępu (Ścieżka Lekcji) 🟢**:
   Na dole strony znajduje się interaktywny pasek kropek postępu. Pokazuje on, w którym miejscu podręcznika się znajdujesz, które lekcje zostały już ukończone (oznaczone ptaszkiem ✓) oraz pozwala na natychmiastowe przejście do wybranej lekcji po naciśnięciu lub najechaniu myszką (wyświetla się wtedy dymek podglądu z pełnym tytułem).

6. **Interaktywny Kalendarz i Historia Zrealizowanych Lekcji 📅**:
   Uczniowie mogą oznaczać lekcje jako ukończone, a nauczyciele przypisywać je do realizacji w swoich klasach! W panelu klas w menu bocznym po rozwinięciu klasy zobaczysz interaktywny kalendarz z zaznaczonymi dniami odbytych lekcji, szczegółową historię chronologiczną z dokładną datą i tematem lekcji oraz możliwość wycofania realizacji przyciskiem "Cofnij".

7. **Elastyczne Dostosowanie Wyglądu i Motywów 🛠️**:
   * Zmieniaj wielkość czcionki, aby tekst był doskonale czytelny z końca klasy.
   * Dopasowuj **wysokość linii (interlinii)** bezpośrednio w panelu stylów na wąską, normalną lub szeroką, co natychmiast wpływa na czytelność całego tekstu.
   * Wybieraj spośród **5 uroczych motywów kolorystycznych** (Jasny, Ciemny, Ciepły Sepia, Pastelowy Niebieski oraz specjalny **Motyw Dyslektyczny** z ułatwioną dyslektyczną czcionką OpenDyslexic i łagodnym tłem).
   * **Dynamiczne Kolory Przedmiotów** 🎨: Plakietki, aktywny wybór rozdziałów oraz kropki postępu automatycznie zmieniają barwę w zależności od wybranego przedmiotu (np. zielony dla Biologii, indigo dla Astronomii/Geografii, różowy dla Matematyki/Fizyki/Chemii, ciepły bursztynowy dla Religii).

8. **Usuwanie i Zarządzanie Lekcjami 🗑️**:
   Zarówno domyślne, jak i własne dodane lekcje mogą być teraz bez problemu usunięte z poziomu bocznej listy rozdziałów (za pomocą ikony kosza przy danej lekcji) lub bezpośrednio za pomocą przycisku usuwania w dolnym panelu aktywnej lekcji.

---

### 📂 Jak zarządzać materiałami?
* **Dodawanie**: Kliknij przycisk **„+ Dodaj lekcję”** w menu bocznym, wybierz typ szkoły/klasę, wpisz rozdział, temat, treść oraz pytania testowe.
* **Usuwanie**: Kliknij ikonę kosza przy lekcji w menu bocznym lub przycisk kosza obok oznaczenia ukończenia lekcji w oknie głównym.`,
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

export const DEFAULT_CHAPTERS: Chapter[] = [
  ...BASE_CHAPTERS,
  ...RELIGIA_8_CHAPTERS_PART1,
  ...RELIGIA_8_CHAPTERS_PART2,
  ...RELIGIA_8_CHAPTERS_PART3
];
