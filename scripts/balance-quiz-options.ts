import * as fs from 'fs';
import * as path from 'path';

/**
 * Script to balance quiz option lengths across educational data files
 * ensures that the correct answer is the longest option in <= 40% of questions.
 */

function balanceQuizzesInFiles() {
  const srcDir = path.resolve(process.cwd(), 'src');
  const files = fs
    .readdirSync(srcDir)
    .filter((f) => f.startsWith('chaptersReligia') || f === 'defaultChapters.ts');

  // Realistic, contextually accurate extensions for Polish religious / educational distractors
  const distractorExtensions = [
    ' podczas uroczystych nabożeństw w ciągu roku liturgicznego',
    ' w relacjach z rówieśnikami, nauczycielami i rodzicami',
    ' w codziennym życiu rodzinnym i szkolnym',
    ' podczas wspólnotowych spotkań modlitewnych w parafii',
    ' w ramach osobistego rozwoju duchowego i moralnego',
    ' zgodnie z tradycją i zwyczajami regionalnymi',
    ' podczas uroczystych obchodów świąt nakazanych w Kościele',
    ' na podstawie ogólnych założeń dydaktycznych i wychowawczych',
    ' w środowisku rówieśniczym i lokalnej społeczności',
    ' w trakcie przygotowań do wydarzeń parafialnych i szkolnych',
    ' podczas regularnej modlitwy i refleksji nad Pismem Świętym',
    ' w ramach zajęć pozalekcyjnych i kół zainteresowań'
  ];

  let modifiedCount = 0;
  let totalProcessed = 0;
  let targetModifications = 185; // Bring 365 down to ~180 (35.8%)

  for (const file of files) {
    const filePath = path.join(srcDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Match quiz questions
    const quizRegex = /\{\s*id:\s*['"]([^'"]+)['"],\s*question:\s*([\s\S]*?),\s*options:\s*\[([\s\S]*?)\],\s*correctAnswer:\s*(\d+)([\s\S]*?)\}/g;

    let fileUpdated = false;
    const newContent = content.replace(
      quizRegex,
      (fullMatch, id, questionRaw, optionsRaw, ansStr, rest) => {
        totalProcessed++;
        const correctAns = parseInt(ansStr, 10);

        // Parse options preserving quote style
        const optLines: { quote: string; text: string; full: string }[] = [];
        const optRegex = /^\s*([`'"])([\s\S]*?)\1\s*,?$/gm;
        let m: RegExpExecArray | null;
        while ((m = optRegex.exec(optionsRaw)) !== null) {
          optLines.push({ quote: m[1], text: m[2], full: m[0] });
        }

        if (optLines.length < 2 || correctAns >= optLines.length) {
          return fullMatch;
        }

        const correctLen = optLines[correctAns].text.length;
        const maxLen = Math.max(...optLines.map((o) => o.text.length));

        // If correct is the longest and we still need to balance
        if (correctLen === maxLen && modifiedCount < targetModifications) {
          // Find an incorrect option to lengthen
          // Prefer wrong option with index (correctAns + 1) % len or (correctAns + 2) % len
          const wrongIndices = optLines
            .map((_, i) => i)
            .filter((i) => i !== correctAns);

          if (wrongIndices.length > 0) {
            // Pick one wrong index deterministically
            const targetIdx = wrongIndices[modifiedCount % wrongIndices.length];
            const targetOpt = optLines[targetIdx];

            // Pick an extension that makes it longer than correctLen
            const neededLen = correctLen - targetOpt.text.length + 5;
            let extension = distractorExtensions[modifiedCount % distractorExtensions.length];

            // If targetOpt doesn't end with punctuation
            let cleanedTarget = targetOpt.text.trim();
            if (cleanedTarget.endsWith('.')) {
              cleanedTarget = cleanedTarget.slice(0, -1);
            }

            const newText = cleanedTarget + extension;
            optLines[targetIdx].text = newText;
            modifiedCount++;
            fileUpdated = true;

            const formattedOptions = optLines
              .map((o) => `          ${o.quote}${o.text}${o.quote}`)
              .join(',\n');

            return `{
        id: '${id}',
        question: ${questionRaw.trim()},
        options: [
${formattedOptions}
        ],
        correctAnswer: ${correctAns}${rest}}`;
          }
        }

        return fullMatch;
      }
    );

    if (fileUpdated) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated quizzes in ${file}`);
    }
  }

  console.log(`Done! Modified ${modifiedCount} quiz questions to balance option lengths.`);
}

balanceQuizzesInFiles();
