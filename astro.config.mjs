// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { satteri } from '@astrojs/markdown-satteri';
import { removerComentariosHtml } from './src/plugins/remover-comentarios.mjs';

// TODO: trocar pela URL final do Vercel (ex.: https://natanjonatan.vercel.app)
// Precisa estar correta para o sitemap, as URLs canônicas e o Open Graph.
const SITE = 'https://natan-portfolio.vercel.app';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    // Os comentários <!-- TODO --> dos projetos ficam só no .md, fora do HTML publicado
    processor: satteri({ hastPlugins: [removerComentariosHtml] }),
  },

  // Fontes auto-hospedadas: o Astro baixa, otimiza e gera fallbacks
  // com métricas iguais (evita CLS). Nenhuma requisição ao Google em runtime.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains',
      weights: ['400', '500'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],
});
