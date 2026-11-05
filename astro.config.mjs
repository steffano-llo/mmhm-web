import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import { loadEnv } from 'vite';

// Astro no carga .env antes de leer esta configuración.
const { SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
// Dominio de revisión como respaldo; el dominio oficial se define con SITE_URL al publicar.
const SITIO_RESPALDO = 'https://mmhm-p.vercel.app';
const sitio = SITE_URL || SITIO_RESPALDO;

export default defineConfig({
  site: sitio,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  image: { responsiveStyles: false },
  // El sitio sigue estático; solo las rutas del panel corren en servidor.
  output: 'static',
  // 'compile': sharp optimiza en el build, porque no corre dentro de Workers.
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: [
    react(),
    keystatic(),
    // El panel no va al sitemap: misma regla que RUTAS_PANEL en src/middleware.ts.
    sitemap({ filter: (url) => !/^\/(api\/)?keystatic(\/|$)/i.test(new URL(url).pathname) }),
  ],
  // astro:env/server es un módulo virtual: el prebundling de Vite no lo resuelve en modo dev.
  vite: { optimizeDeps: { exclude: ['@keystatic/astro/api'] } },
});
