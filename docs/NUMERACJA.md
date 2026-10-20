# Zasady Numeracji Lekcji i Rozdziałów w Multibooku

Niniejszy dokument wyjaśnia strukturę numeracji lekcji (`lessonNumber`) w poszczególnych przedmiotach i klasach Cyfrowego Multibooka Edukacyjnego.

## 1. Dlaczego w numeracji lekcji występują luki?

Luki w numeracji lekcji w przedmiotach takich jak **Religia** są **w pełni zamierzone i zaplanowane przez Autora programu (mgr Krzysztofa Jureczka)**. Wynikają one bezpośrednio z:

1. **Struktury ramowego programu nauczania**: Program nauczania religii katolickiej (Komisji Wychowania Katolickiego KEP) przewiduje określone jednostki tematyczne, z których część przypisana jest do konkretnych okresów roku liturgicznego (Adwent, Boże Narodzenie, Wielki Post, Triduum Paschalne, Wielkanoc, uroczystości nakazane).
2. **Jednostek okolicznościowych i fakultatywnych**: Część numerów w oficjalnych siatkach programowych jest zarezerwowana na lekcje okolicznościowe (rekolekcje szkolne, uroczystości patronalne szkoły, dni skupienia), które w podręczniku stałym nie stanowią standardowych jednostek lekcyjnych.
3. **Układu tematycznego podręcznika**: Każdy rozdział reprezentuje spójny blok dydaktyczny. Przejścia między blokami posiadają numerację zgodną z podręcznikami źródłowymi, co ułatwia nauczycielom synchronizację z programem nauczania i dziennikiem lekcyjnym.

## 2. Ciągłość w innych przedmiotach

W przedmiotach takich jak *Biologia*, *Geografia i Astronomia* oraz *Podręcznik / Instrukcja* numeracja lekcji prowadzona jest w sposób ciągły od lekcji 1.

## 3. Walidacja danych

W skrypcie `scripts/validate-data.ts` luki w numeracji tematów są traktowane jako **ostrzeżenia informacyjne (warnings)**, a nie błędy blokujące kompilację, ponieważ odzwierciedlają one autorski zamysł dydaktyczny i programowy.
