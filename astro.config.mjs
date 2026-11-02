import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

export default defineConfig({
  // Dominio de revisión; cambiar a https://www.mmhighmetrik.com al publicar en el dominio oficial
  site: 'https://mmhm-p.vercel.app',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  image: { responsiveStyles: false },
  // El sitio sigue estático; solo las rutas del panel corren en servidor.
  output: 'static',
  // 'compile': sharp optimiza en el build, porque no corre dentro de Workers.
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: [react(), keystatic()],
});
