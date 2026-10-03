import * as fs from 'fs';
import * as path from 'path';

function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function parseOptions(optionsStr: string): string[] {
  const opts: string[] = [];
  const regex = /^\s*([`\x27"])([\s\S]*?)\1\s*,?$/gm;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(optionsStr)) !== null) {
    opts.push(match[0].trim().replace(/,$/, ''));
  }
  return opts;
}

export function shuffleQuizFiles(): void {
  const srcDir = path.resolve(process.cwd(), 'src');
  const files = fs
    .readdirSync(srcDir)
    .filter((f) => f.startsWith('chaptersReligia') || f === 'defaultChapters.ts');

  let totalUpdated = 0;
  const quizRegex =
    /\{\s*id:\s*['"]([^'"]+)['"],\s*question:\s*([\s\S]*?),\s*options:\s*\[([\s\S]*?)\],\s*correctAnswer:\s*(\d+)([\s\S]*?)\}/g;

  for (const file of files) {
    const filePath = path.join(srcDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    let fileUpdated = 0;
    const newContent = content.replace(
      quizRegex,
      (fullMatch, id, questionRaw, optionsRaw, oldAnsStr, rest) => {
        const oldAns = parseInt(oldAnsStr, 10);
        const opts = parseOptions(optionsRaw);
        if (opts.length < 2) return fullMatch;

        const rand = mulberry32(hashString(id));
        const indices = Array.from({ length: opts.length }, (_, i) => i);
        for (let i = opts.length - 1; i > 0; i--) {
          const j = Math.floor(rand() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        const newAns = indices.indexOf(oldAns);
        const shuffledOpts = indices.map((idx) => opts[idx]);
        const formattedOptions = shuffledOpts.map((o) => `          ${o}`).join(',\n');

        fileUpdated++;
        totalUpdated++;

        return `{
        id: '${id}',
        question: ${questionRaw.trim()},
        options: [
${formattedOptions}
        ],
        correctAnswer: ${newAns}${rest}}`;
      }
    );

    if (fileUpdated > 0) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated ${fileUpdated} quizzes in ${file}`);
    }
  }

  console.log(`Successfully deterministically shuffled ${totalUpdated} quizzes!`);
}

if (process.argv[1]?.includes('shuffle-quiz-options')) {
  shuffleQuizFiles();
}
