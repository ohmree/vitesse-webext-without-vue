import { dirname, relative } from 'node:path';
import { defineConfig, UserConfig } from 'vite';
import icons from 'unplugin-icons/vite';
import autoImport from 'unplugin-auto-import/vite';
import windiCSS from 'vite-plugin-windicss';
import windiConfig from './windi.config';
import { r, port, isDev } from './scripts/utils';

export const sharedConfig: UserConfig = {
  root: r('src'),
  resolve: {
    alias: {
      '~/': `${r('src')}/`,
    },
  },
  define: {
    __DEV__: isDev,
  },
  plugins: [
    autoImport({
      imports: [
        {
          'webextension-polyfill': [['default', 'browser']],
        },
      ],
      dts: r('src/auto-imports.d.ts'),
    }),

    // https://github.com/antfu/unplugin-icons
    icons({
      compiler: 'raw',
    }),

    // Rewrite assets to use relative path
    {
      name: 'assets-rewrite',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml(html, { path }) {
        return html.replace(
          /"\/assets\//g,
          `"${relative(dirname(path), '/assets')}/`,
        );
      },
    },
  ],
  optimizeDeps: {
    include: ['webextension-polyfill'],
  },
};

export default defineConfig(({ command }) => ({
  ...sharedConfig,
  base: command === 'serve' ? `http://localhost:${port}/` : '/dist/',
  server: {
    port,
    hmr: {
      host: 'localhost',
    },
  },
  build: {
    outDir: r('extension/dist'),
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
    terserOptions: {
      mangle: false,
    },
    rollupOptions: {
      input: {
        background: r('src/background/index.html'),
        options: r('src/options/index.html'),
        popup: r('src/popup/index.html'),
      },
    },
  },
  plugins: [
    ...sharedConfig.plugins!,

    // https://github.com/antfu/vite-plugin-windicss
    windiCSS({
      config: windiConfig,
    }),
  ],
}));
