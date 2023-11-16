// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';
import path from 'path';
import preprocess from "svelte-preprocess";


export default {
  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],
  kit: {
    adapter: adapter({
      // default options are shown. On some platforms
      // these options are set automatically — see below
    }),
    alias: {
      '$components': path.resolve('./src/lib/components')
    },
  },
  optimizeDeps: {
    exclude: ["codemirror", "@codemirror/language-javascript" /* ... */],
  },
};
