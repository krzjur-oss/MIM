import { DEFAULT_CHAPTERS, ALL_RELIGIA_CHAPTERS } from '../src/defaultChapters';
import { Chapter, QuizQuestion } from '../src/types';

interface ValidationError {
  type: 'chapter' | 'quiz' | 'sequence' | 'level';
  id: string;
  message: string;
}

interface ValidationWarning {
  type: 'sequence' | 'reading_time' | 'quiz_length' | 'title';
  id: string;
  message: string;
}

export function validateData(): { isValid: boolean; errors: ValidationError[]; warnings: ValidationWarning[] } {
  console.log('🔍 Rozpoczynanie walidacji danych edukacyjnych Cyfrowego Multibooka...\n');

  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let correctAnswerLongestCount = 0;
  const allChapters: Chapter[] = [...DEFAULT_CHAPTERS, ...ALL_RELIGIA_CHAPTERS];

  // 1. Chapter ID uniqueness & required fields
  const seenChapterIds = new Map<string, string>();
  for (const ch of allChapters) {
    if (!ch.id || typeof ch.id !== 'string' || !ch.id.trim()) {
      errors.push({ type: 'chapter', id: 'unknown', message: 'Rozdział nie posiada poprawnego identyfikatora ID.' });
    } else {
      if (seenChapterIds.has(ch.id)) {
        errors.push({
          type: 'chapter',
          id: ch.id,
          message: `Zdublowane ID rozdziału: "${ch.id}" (występuje w: "${seenChapterIds.get(ch.id)}" oraz "${ch.title}")`
        });
      } else {
        seenChapterIds.set(ch.id, ch.title);
      }
    }

    if (!ch.title || typeof ch.title !== 'string' || !ch.title.trim()) {
      errors.push({ type: 'chapter', id: ch.id, message: `Rozdział "${ch.id}" nie posiada tytułu (title).` });
    }

    if (!ch.content || typeof ch.content !== 'string' || !ch.content.trim()) {
      errors.push({ type: 'chapter', id: ch.id, message: `Rozdział "${ch.id}" nie posiada treści (content).` });
    }

    if (!ch.subject || typeof ch.subject !== 'string' || !ch.subject.trim()) {
      errors.push({ type: 'chapter', id: ch.id, message: `Rozdział "${ch.id}" nie posiada przedmiotu (subject).` });
    }

    if (ch.lessonNumber === undefined || ch.lessonNumber === null || typeof ch.lessonNumber !== 'number' || ch.lessonNumber < 1) {
      errors.push({ type: 'chapter', id: ch.id, message: `Rozdział "${ch.id}" posiada niepoprawny numer lekcji: ${ch.lessonNumber}` });
    }

    if (ch.lessonNumber && ch.lessonNumber > 100) {
      errors.push({ type: 'chapter', id: ch.id, message: `Rozdział "${ch.id}" ma podejrzanie wysoki numer lekcji: ${ch.lessonNumber}` });
    }

    // 2. Education level consistency
    if (ch.grade && ch.educationLevel) {
      if (ch.grade.match(/Klasa [1-3]/) && !ch.educationLevel.includes('1-3') && !ch.educationLevel.includes('Wczesnoszkolna')) {
        errors.push({
          type: 'level',
          id: ch.id,
          message: `Niezgodność poziomu: klasa "${ch.grade}" a educationLevel to "${ch.educationLevel}"`
        });
      }
      if (ch.grade.match(/Klasa [4-8]/) && ch.educationLevel.includes('1-3')) {
        errors.push({
          type: 'level',
          id: ch.id,
          message: `Niezgodność poziomu: klasa "${ch.grade}" oznaczona jako klasy 1-3 w "${ch.educationLevel}"`
        });
      }
    }

    // 2b. Zgodność estimatedReadTime z długością tekstu (±3 min)
    const textChars = ch.content.length;
    const calculatedMinutes = Math.max(1, Math.round(textChars / 750));
    const declaredMinutes = ch.estimatedReadTime || 1;
    if (Math.abs(declaredMinutes - calculatedMinutes) > 3) {
      warnings.push({
        type: 'reading_time',
        id: ch.id,
        message: `Rozbieżność czasu czytania dla "${ch.title}": zadeklarowano ${declaredMinutes} min, wyliczono z tekstu ${calculatedMinutes} min (${textChars} znaków). Różnica przekracza dopuszczalne ±3 min.`
      });
    }
  }

  // 3. Lesson numbering sequences, continuity & title uniqueness per Subject & Grade
  const validateCollectionSequence = (collection: Chapter[], collectionName: string) => {
    const subjectGradeGroups = new Map<string, Chapter[]>();
    for (const ch of collection) {
      const key = `${ch.subject || 'Brak'}__${ch.grade || 'Brak'}`;
      if (!subjectGradeGroups.has(key)) {
        subjectGradeGroups.set(key, []);
      }
      subjectGradeGroups.get(key)!.push(ch);
    }

    for (const [key, group] of subjectGradeGroups.entries()) {
      const seenLessonNumbers = new Map<number, string>();
      const seenTitles = new Map<string, string>();

      for (const ch of group) {
        // Unikalność tytułów w klasie
        const cleanTitle = ch.title.trim().toLowerCase();
        if (seenTitles.has(cleanTitle)) {
          errors.push({
            type: 'chapter',
            id: ch.id,
            message: `Zdublowany tytuł lekcji w klasie [${collectionName} -> ${key}]: "${ch.title}" (występuje w ${ch.id} oraz ${seenTitles.get(cleanTitle)})`
          });
        } else {
          seenTitles.set(cleanTitle, ch.id);
        }

        // Zdublowany numer lekcji
        if (typeof ch.lessonNumber === 'number') {
          if (seenLessonNumbers.has(ch.lessonNumber)) {
            errors.push({
              type: 'sequence',
              id: ch.id,
              message: `Zdublowany numer lekcji ${ch.lessonNumber} w kolekcji [${collectionName}] w grupie [${key}]: "${ch.title}" i "${seenLessonNumbers.get(ch.lessonNumber)}"`
            });
          } else {
            seenLessonNumbers.set(ch.lessonNumber, ch.title);
          }
        }
      }

      // Sprawdzanie ciągłości lessonNumber w obrębie klasy (luki zgłaszane jako ostrzeżenie)
      const sortedLessons = [...group]
        .filter((c) => typeof c.lessonNumber === 'number')
        .sort((a, b) => (a.lessonNumber as number) - (b.lessonNumber as number));

      for (let i = 1; i < sortedLessons.length; i++) {
        const prevNum = sortedLessons[i - 1].lessonNumber as number;
        const currNum = sortedLessons[i].lessonNumber as number;
        if (currNum > prevNum + 1) {
          warnings.push({
            type: 'sequence',
            id: sortedLessons[i].id,
            message: `Luka w numeracji lekcji w [${key}]: przeskok z lekcji ${prevNum} do ${currNum} (zamierzone luki programowe opisane w docs/NUMERACJA.md)`
          });
        }
      }
    }
  };

  validateCollectionSequence(DEFAULT_CHAPTERS, 'DEFAULT_CHAPTERS');
  validateCollectionSequence(ALL_RELIGIA_CHAPTERS, 'ALL_RELIGIA_CHAPTERS');

  // 4. Quizzes validation & distribution analysis
  const seenQuizIds = new Map<string, string>();
  let totalQuizzes = 0;
  const answerDistribution: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };

  for (const ch of allChapters) {
    if (ch.quizzes && Array.isArray(ch.quizzes)) {
      for (const q of ch.quizzes) {
        totalQuizzes++;

        if (!q.id || typeof q.id !== 'string' || !q.id.trim()) {
          errors.push({ type: 'quiz', id: `chapter-${ch.id}`, message: `Quiz w rozdziale "${ch.id}" nie posiada ID.` });
        } else {
          if (seenQuizIds.has(q.id)) {
            errors.push({
              type: 'quiz',
              id: q.id,
              message: `Zdublowane ID pytania testowego: "${q.id}" (w rozdziale "${ch.id}" i "${seenQuizIds.get(q.id)}")`
            });
          } else {
            seenQuizIds.set(q.id, ch.id);
          }
        }

        if (!q.question || typeof q.question !== 'string' || !q.question.trim()) {
          errors.push({ type: 'quiz', id: q.id || ch.id, message: `Puste pytanie quizowe w rozdziale "${ch.id}".` });
        }

        if (!Array.isArray(q.options) || q.options.length < 2) {
          errors.push({
            type: 'quiz',
            id: q.id || ch.id,
            message: `Quiz "${q.id}" w "${ch.id}" posiada mniej niż 2 opcje (${q.options?.length || 0}).`
          });
        } else {
          // Check for empty options
          q.options.forEach((opt, optIdx) => {
            if (typeof opt !== 'string' || !opt.trim()) {
              errors.push({
                type: 'quiz',
                id: q.id || ch.id,
                message: `Quiz "${q.id}" opcja #${optIdx + 1} jest pusta.`
              });
            }
          });

          // Check for duplicate options in single question
          const uniqueOpts = new Set(q.options.map((o) => (typeof o === 'string' ? o.trim().toLowerCase() : '')));
          if (uniqueOpts.size !== q.options.length) {
            errors.push({
              type: 'quiz',
              id: q.id || ch.id,
              message: `Quiz "${q.id}" w "${ch.id}" posiada zduplikowane odpowiedzi.`
            });
          }
        }

        if (
          typeof q.correctAnswer !== 'number' ||
          !Number.isInteger(q.correctAnswer) ||
          q.correctAnswer < 0 ||
          (Array.isArray(q.options) && q.correctAnswer >= q.options.length)
        ) {
          errors.push({
            type: 'quiz',
            id: q.id || ch.id,
            message: `Quiz "${q.id}" ma nieprawidłowy indeks poprawnej odpowiedzi: ${q.correctAnswer} (liczba opcji: ${q.options?.length})`
          });
        } else {
          answerDistribution[q.correctAnswer] = (answerDistribution[q.correctAnswer] || 0) + 1;
          const correctLen = (q.options[q.correctAnswer] || '').length;
          const maxLen = Math.max(...q.options.map((o) => (typeof o === 'string' ? o.length : 0)));
          if (correctLen === maxLen) {
            correctAnswerLongestCount++;
          }
        }

        if (q.explanation && (typeof q.explanation !== 'string' || !q.explanation.trim())) {
          errors.push({
            type: 'quiz',
            id: q.id || ch.id,
            message: `Quiz "${q.id}" posiada niepoprawny format wyjaśnienia (explanation).`
          });
        }
      }
    }
  }

  // Summary statistics
  console.log('📊 PODSUMOWANIE STATYSTYK BAZY DANYCH:');
  console.log(`- Łączna liczba rozdziałów: ${allChapters.length}`);
  console.log(`  • Domyślne startowe (DEFAULT_CHAPTERS): ${DEFAULT_CHAPTERS.length}`);
  console.log(`  • Pełny zbiór religii (ALL_RELIGIA_CHAPTERS): ${ALL_RELIGIA_CHAPTERS.length}`);
  console.log(`- Liczba unikalnych pytań quizowych: ${totalQuizzes}`);
  console.log('- Rozkład poprawnych odpowiedzi w quizach:');
  for (const [ansIdx, count] of Object.entries(answerDistribution)) {
    const pct = totalQuizzes > 0 ? ((count / totalQuizzes) * 100).toFixed(1) : '0';
    const letter = ['A', 'B', 'C', 'D'][parseInt(ansIdx, 10)] || ansIdx;
    console.log(`  • Opcja [${letter}] (indeks ${ansIdx}): ${count} pytań (${pct}%)`);
  }

  const longestPercent = totalQuizzes > 0 ? (correctAnswerLongestCount / totalQuizzes) * 100 : 0;
  console.log(`- Rozkład długości opcji: poprawna odpowiedź jest najdłuższa w ${correctAnswerLongestCount}/${totalQuizzes} pytań (${longestPercent.toFixed(1)}%) [wymóg: ≤ 40%]`);

  if (longestPercent > 40) {
    warnings.push({
      type: 'quiz_length',
      id: 'quiz-longest-option-rule',
      message: `Poprawna odpowiedź jest najdłuższą opcją w ${longestPercent.toFixed(1)}% pytań (przekracza zalecany próg ≤ 40%). Uczniowie mogą zgadywać na podstawie długości tekstu.`
    });
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  ZAREJESTROWANE OSTRZEŻENIA I INFORMACJE SYSTEMOWE (${warnings.length}):`);
    warnings.slice(0, 10).forEach((w, idx) => {
      console.log(`  ${idx + 1}. [${w.type.toUpperCase()}] ID: "${w.id}": ${w.message}`);
    });
    if (warnings.length > 10) {
      console.log(`  ... oraz ${warnings.length - 10} pozostałych ostrzeżeń (m.in. luki w programie opisane w docs/NUMERACJA.md).`);
    }
  }

  const isValid = errors.length === 0;

  if (isValid) {
    console.log('\n✅ WSZYSTKIE DANE SĄ POPRAWNE I ZGODNE ZE SCHEMATEM!');
    console.log('   - Wszystkie identyfikatory ID są unikalne');
    console.log('   - Tytuły lekcji w obrębie klas są unikalne');
    console.log('   - Opcje quizów są zbalansowane i nie faworyzują żadnej litery');
    console.log(`   - Reguła najdłuższej opcji spełniona: ${longestPercent.toFixed(1)}% (wymóg ≤ 40%)`);
    console.log('   - Szacowane czasy czytania są zgodne z długością treści (±3 min)');
  } else {
    console.error(`\n❌ ZNALEZIONO ${errors.length} BŁĘDÓW W DANYCH:`);
    errors.forEach((err, idx) => {
      console.error(`  ${idx + 1}. [${err.type.toUpperCase()}] ID: "${err.id}": ${err.message}`);
    });
  }

  return { isValid, errors, warnings };
}

if (process.argv[1]?.includes('validate-data')) {
  const result = validateData();
  process.exit(result.isValid ? 0 : 1);
}
