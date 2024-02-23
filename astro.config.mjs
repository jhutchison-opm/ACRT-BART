import { defineConfig } from 'astro/config';

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  site: 'https://jhutchison-opm.github.io',
  outDir: './docs' // For github pages manual deploy
});