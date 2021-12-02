import { resolve } from 'node:path';
import { defineConfig } from 'windicss/helpers';

export default defineConfig({
  darkMode: 'class',
  // https://windicss.org/posts/v30.html#attributify-mode
  attributify: true,
  extract: {
    include: [resolve(__dirname, 'src/**/*.html')],
  },
});