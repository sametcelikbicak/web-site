import {
  existsSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

const clientOnly = process.env.VITE_CLIENT_ONLY === 'true';

function inlineCssPlugin(): Plugin {
  let cssContent = '';
  let cssFileName = '';

  return {
    name: 'inline-css',
    enforce: 'post',

    generateBundle(_, bundle) {
      for (const [name, chunk] of Object.entries(bundle)) {
        if (/\/?index-\w+\.css$/.test(name) && chunk.type === 'asset') {
          const source = chunk.source;
          if (typeof source === 'string') {
            cssContent = source;
            cssFileName = name;
          }
          break;
        }
      }
    },

    closeBundle() {
      if (!cssContent || !cssFileName) return;

      const clientBuildDir = path.resolve(__dirname, 'dist/client');
      const htmlPath = path.join(clientBuildDir, 'index.html');

      if (!existsSync(htmlPath)) return;

      let html = readFileSync(htmlPath, 'utf-8');

      html = html.replace(/<link[^>]*href=["'][^"']*\.css["'][^>]*\/?>/gi, '');

      const assetsDir = path.join(clientBuildDir, 'assets');
      if (!existsSync(assetsDir)) return;
      const initialChunks = readdirSync(assetsDir)
        .filter((f) => /^(HomePage|router|i18n|icons)-[\w-]+\.js$/.test(f))
        .sort();
      const modulepreloads = initialChunks
        .map(
          (f) =>
            `    <link rel="modulepreload" crossorigin href="/assets/${f}">`
        )
        .join('\n');

      html = html.replace(
        /\n[ \t]*<\/head>/,
        `\n${modulepreloads}\n    <style>${cssContent}</style>\n  </head>`
      );
      html = html.replace('<!--ssr-styles-->', '');

      writeFileSync(htmlPath, html);

      const cssBasename = path.basename(cssFileName);
      try {
        unlinkSync(path.join(assetsDir, cssBasename));
      } catch {
        // ignore
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    inlineCssPlugin(),
    ...(clientOnly ? [] : [cloudflare()]),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react/')
          ) {
            return 'react-vendor';
          }
          if (
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/@remix-run')
          ) {
            return 'router';
          }
          if (
            id.includes('node_modules/i18next') ||
            id.includes('node_modules/react-i18next')
          ) {
            return 'i18n';
          }
          if (id.includes('node_modules/react-icons')) {
            return 'icons';
          }
        },
      },
    },
  },
});
