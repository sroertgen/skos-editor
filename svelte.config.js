// svelte.config.js
import adapter from '@sveltejs/adapter-static';
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
      pages: 'build',
      assets: 'build',
      fallback: null,
      precompress: false
    }),
    alias: {
      '$components':  path.resolve('./src/lib/components')
    },
  },
  optimizeDeps: {
    exclude: ["codemirror", "@codemirror/language-javascript" /* ... */],
},
};