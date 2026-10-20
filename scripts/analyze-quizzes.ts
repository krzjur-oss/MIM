import * as fs from 'fs';
import * as path from 'path';

const srcDir = './src';
const files = fs.readdirSync(srcDir).filter((f) => f.startsWith('chaptersReligia') || f === 'defaultChapters.ts');

let total = 0;
let correctIsLongest = 0;
const examples: Array<{ id: string; file: string; correct: string; wrong: string[] }> = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(srcDir, file), 'utf8');
  const quizRegex = /\{\s*id:\s*['"]([^'"]+)['"],\s*question:\s*([\s\S]*?),\s*options:\s*\[([\s\S]*?)\],\s*correctAnswer:\s*(\d+)/g;
  let match: RegExpExecArray | null;
  while ((match = quizRegex.exec(content)) !== null) {
    total++;
    const optsStr = match[3];
    const opts: string[] = [];
    const r = /^\s*([`'"])([\s\S]*?)\1\s*,?$/gm;
    let m: RegExpExecArray | null;
    while ((m = r.exec(optsStr)) !== null) {
      opts.push(m[2]);
    }
    const correctIdx = parseInt(match[4], 10);
    if (opts.length > 0 && correctIdx < opts.length) {
      const correctLen = opts[correctIdx].length;
      const maxLen = Math.max(...opts.map((o) => o.length));
      if (correctLen === maxLen) {
        correctIsLongest++;
        if (examples.length < 5) {
          examples.push({
            id: match[1],
            file,
            correct: opts[correctIdx],
            wrong: opts.filter((_, idx) => idx !== correctIdx)
          });
        }
      }
    }
  }
}

console.log(`Total: ${total}, Correct is longest: ${correctIsLongest} (${((correctIsLongest / total) * 100).toFixed(1)}%)`);
console.log('Sample examples:', JSON.stringify(examples, null, 2));
