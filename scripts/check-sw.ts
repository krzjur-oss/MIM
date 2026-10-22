import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const distSwPath = path.join(distDir, 'sw.js');

console.log('🔍 Weryfikacja spójności manifestu offline PWA (dist/sw.js)...');

if (!fs.existsSync(distSwPath)) {
  console.error('❌ BŁĄD: Plik dist/sw.js nie istnieje! Uruchom najpierw "npm run build".');
  process.exit(1);
}

const swContent = fs.readFileSync(distSwPath, 'utf-8');
const coreMatch = swContent.match(/\/\* __CORE_ASSETS_START__ \*\/([\s\S]*?)\/\* __CORE_ASSETS_END__ \*\//);

if (!coreMatch) {
  console.error('❌ BŁĄD: Nie znaleziono sekcji CORE_ASSETS w dist/sw.js!');
  process.exit(1);
}

let coreAssets: string[];
try {
  coreAssets = JSON.parse(coreMatch[1].trim());
} catch (err) {
  console.error('❌ BŁĄD: Nie udało się sparsować tablicy CORE_ASSETS z dist/sw.js:', err);
  process.exit(1);
}

if (!Array.isArray(coreAssets) || coreAssets.length === 0) {
  console.error('❌ BŁĄD: CORE_ASSETS jest puste lub nie jest tablicą!');
  process.exit(1);
}

console.log(`📋 Znaleziono ${coreAssets.length} wpisów w CORE_ASSETS. Weryfikacja istnienia plików...`);

const missingFiles: string[] = [];
const directoryEntries: string[] = [];
let validFileCount = 0;

for (const asset of coreAssets) {
  if (asset === './') {
    const indexPath = path.join(distDir, 'index.html');
    if (!fs.existsSync(indexPath) || !fs.statSync(indexPath).isFile()) {
      missingFiles.push('./ (wymaga dist/index.html)');
    } else {
      validFileCount++;
    }
    continue;
  }

  const cleanPath = asset.replace(/^\.\//, '');
  const fullPath = path.join(distDir, cleanPath);

  if (!fs.existsSync(fullPath)) {
    missingFiles.push(asset);
    continue;
  }

  const stat = fs.statSync(fullPath);
  if (stat.isDirectory()) {
    directoryEntries.push(asset);
  } else if (stat.isFile()) {
    validFileCount++;
  } else {
    missingFiles.push(`${asset} (nie jest zwykłym plikiem)`);
  }
}

if (missingFiles.length > 0 || directoryEntries.length > 0) {
  if (missingFiles.length > 0) {
    console.error('❌ Brakujące pliki w dist:', missingFiles);
  }
  if (directoryEntries.length > 0) {
    console.error('❌ Wpisy w CORE_ASSETS będące katalogami (niedozwolone):', directoryEntries);
  }
  process.exit(1);
}

console.log(`✅ Wszystkie ${validFileCount} wpisy CORE_ASSETS istnieją w dist/ i są poprawnymi plikami!`);
