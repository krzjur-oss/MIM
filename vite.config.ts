import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

/**
 * Custom Vite plugin that automatically injects the production build hash
 * and the complete list of generated JS/CSS/static assets into dist/sw.js.
 * This guarantees true offline precaching on installation without manual lists.
 */
function pwaPrecachePlugin(): Plugin {
  let isBuild = false;

  return {
    name: 'pwa-precache-injector',
    configResolved(config) {
      isBuild = config.command === 'build';
    },
    closeBundle() {
      if (!isBuild) return;

      const distDir = path.resolve(__dirname, 'dist');
      const distSwPath = path.join(distDir, 'sw.js');
      if (!fs.existsSync(distSwPath)) return;

      // Collect all compiled chunk files from dist/assets
      const assetsDir = path.join(distDir, 'assets');
      const assetFiles: string[] = [];
      if (fs.existsSync(assetsDir)) {
        const files = fs.readdirSync(assetsDir);
        for (const file of files) {
          if (!file.endsWith('.map')) {
            assetFiles.push(`./assets/${file}`);
          }
        }
      }

      // Split assets into critical CORE_ASSETS and non-critical CONTENT_ASSETS
      const coreAssets: string[] = [
        './',
        './index.html',
        './manifest.json',
        './icon.svg',
      ];
      const contentAssets: string[] = [];

      for (const file of assetFiles) {
        const basename = path.basename(file);
        const isSecondary =
          basename.startsWith('vendor-') ||
          basename.startsWith('curriculum-') ||
          basename.startsWith('component-') ||
          basename.startsWith('default-chapters');

        if (isSecondary) {
          contentAssets.push(file);
        } else {
          coreAssets.push(file);
        }
      }

      // Compute content-based build hash from output assets
      const hash = crypto.createHash('sha256');
      for (const asset of assetFiles) {
        const fullPath = path.join(assetsDir, path.basename(asset));
        try {
          hash.update(fs.readFileSync(fullPath));
        } catch {
          hash.update(asset);
        }
      }
      const buildHash = hash.digest('hex').slice(0, 10);

      let swContent = fs.readFileSync(distSwPath, 'utf-8');

      // 1. Inject build version hash and production CACHE_NAME
      swContent = swContent.replace(
        /const BUILD_HASH = '__BUILD_HASH__';[\s\S]*?const CACHE_NAME = [^;]+;/,
        `const BUILD_HASH = '${buildHash}';\nconst CACHE_NAME = 'multibook-mim-${buildHash}';`
      );

      // 2. Inject CORE_ASSETS array
      swContent = swContent.replace(
        /\/\* __CORE_ASSETS_START__ \*\/[\s\S]*?\/\* __CORE_ASSETS_END__ \*\//,
        `/* __CORE_ASSETS_START__ */ ${JSON.stringify(coreAssets, null, 2)} /* __CORE_ASSETS_END__ */`
      );

      // 3. Inject CONTENT_ASSETS array
      swContent = swContent.replace(
        /\/\* __CONTENT_ASSETS_START__ \*\/[\s\S]*?\/\* __CONTENT_ASSETS_END__ \*\//,
        `/* __CONTENT_ASSETS_START__ */ ${JSON.stringify(contentAssets, null, 2)} /* __CONTENT_ASSETS_END__ */`
      );

      fs.writeFileSync(distSwPath, swContent, 'utf-8');
      console.log(`[PWA Plugin] Injected build hash "${buildHash}" (Core: ${coreAssets.length}, Content: ${contentAssets.length}) into dist/sw.js`);
    },
  };
}

export default defineConfig(() => {
  return {
    base: isGitHubActions ? '/MIM/' : './',
    plugins: [react(), tailwindcss(), pwaPrecachePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
      dedupe: ['react', 'react-dom'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Third-party vendor libraries
            if (id.includes('node_modules')) {
              // React core & scheduler
              if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) {
                return 'vendor-react';
              }
              // Framer Motion / Motion
              if (id.includes('framer-motion') || id.includes('/motion/') || id.includes('/motion-dom/') || id.includes('/motion-utils/')) {
                return 'vendor-motion';
              }
              // Recharts & D3 dependencies
              if (id.includes('recharts') || id.includes('/d3-') || id.includes('victory-vendor')) {
                return 'vendor-recharts';
              }
              // React Markdown, Unified, Remark, Rehype & Micromark ecosystem
              if (
                id.includes('react-markdown') ||
                id.includes('remark') ||
                id.includes('rehype') ||
                id.includes('unified') ||
                id.includes('unist') ||
                id.includes('vfile') ||
                id.includes('micromark') ||
                id.includes('mdast') ||
                id.includes('hast')
              ) {
                return 'vendor-markdown';
              }
              // Lucide icons
              if (id.includes('lucide-react')) {
                return 'vendor-lucide';
              }
              return 'vendor-other';
            }

            // Internal educational curriculum textbook data chunks
            if (
              id.includes('chaptersReligia1') ||
              id.includes('chaptersReligia2') ||
              id.includes('chaptersReligia3') ||
              id.includes('chaptersReligia4')
            ) {
              return 'curriculum-grades-1-4';
            }

            if (
              id.includes('chaptersReligia5') ||
              id.includes('chaptersReligia6')
            ) {
              return 'curriculum-grades-5-6';
            }

            if (
              id.includes('chaptersReligia7') ||
              id.includes('chaptersReligia8')
            ) {
              return 'curriculum-grades-7-8';
            }

            if (id.includes('defaultChapters')) {
              return 'default-chapters';
            }

            // Major modular components
            if (id.includes('components/ChapterManager')) {
              return 'component-chapter-manager';
            }
            if (id.includes('components/DrawingOverlay')) {
              return 'component-drawing-overlay';
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
