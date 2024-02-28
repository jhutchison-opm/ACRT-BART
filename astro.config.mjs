import { defineConfig } from 'astro/config';

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  site: 'https://jhutchison-opm.github.io',
  base: import.meta.env.NODE_ENV === 'production' ? '/ACRT-BART' : '',
  outDir: './docs', // For github pages manual deploy
  build: {
    assets: 'assets' // Using a manual dir so .nojekyll isnt needed to deploy to GH pages
  }
});