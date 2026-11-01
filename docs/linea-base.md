# Línea base (T01)

Referencia para comparar los cambios del rediseño (T10, T11 y T17).

## Entorno

| Dato | Valor |
|---|---|
| Fecha | 2026-10-31 |
| Commit | `59692ac` (rama `feat/t01-linea-base`) |
| Node / npm | 24.19.0 / 11.17.0 |
| Astro | 5.18.2 |
| SO | Windows 11 Pro |

## Build

- `npm install`: sin cambios en dependencias (280 paquetes auditados).
- `npm run build`: sin errores ni advertencias. 17 páginas, 230 imágenes optimizadas.
- Copia de `dist/` guardada fuera del repositorio en `C:\Users\ADMIN\mmhm-base\dist-base` (315 archivos, idéntica a `dist/` al momento de la copia).

Páginas generadas: `/`, `/servicios/`, `/proyectos/` y 14 fichas en `/proyectos/<slug>/`.

## Lighthouse

Medición sobre `npm run preview` (build de producción, `http://localhost:4321`), con `npx lighthouse` 13.6.0 y Chrome en modo headless. Móvil usa la configuración por defecto (con limitación simulada de red y CPU); escritorio usa `--preset=desktop`. Una sola corrida por página: el rendimiento puede variar unos puntos entre corridas.

| Página | Modo | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| `/` | Móvil | 64 | 97 | 96 | 66 | 14,9 s | 0,003 | 140 ms |
| `/` | Escritorio | 82 | 97 | 96 | 66 | 3,0 s | 0 | 0 ms |
| `/servicios/` | Móvil | 65 | 94 | 96 | 66 | 16,3 s | 0,001 | 80 ms |
| `/servicios/` | Escritorio | 83 | 98 | 96 | 66 | 3,0 s | 0,002 | 0 ms |
| `/proyectos/` | Móvil | 68 | 95 | 96 | 66 | 19,8 s | 0,06 | 10 ms |
| `/proyectos/` | Escritorio | 81 | 99 | 96 | 66 | 3,4 s | 0,014 | 0 ms |
| `/proyectos/costa-verde/` | Móvil | 72 | 91 | 96 | 66 | 14,4 s | 0 | 10 ms |
| `/proyectos/costa-verde/` | Escritorio | 86 | 95 | 96 | 66 | 2,5 s | 0,001 | 0 ms |

Peso total transferido (móvil): Inicio 7.601 KiB, `/proyectos/` 3.411 KiB, Costa Verde 2.257 KiB.

### Notas para interpretar

- **SEO 66**: penalizado a propósito porque `Base.astro` tiene `noindex, nofollow` fijo (se corrige en T16).
- **Buenas prácticas 96**: el único error de consola es un 404 de `/_vercel/insights/script.js`, que solo existe en Vercel. En local siempre falla.
- **LCP móvil alto (14–20 s)**: es el punto más débil. Coincide con el peso de las páginas, sobre todo el Inicio.
- Auditorías que fallan en varias páginas: `color-contrast`, `heading-order`, `label-content-name-mismatch` y, en Costa Verde móvil, `aria-prohibited-attr`.

## Observaciones

- `npm audit` reporta 7 vulnerabilidades (1 baja, 1 moderada, 4 altas, 1 crítica). No se corrigieron en T01 porque implican cambiar dependencias.
- npm 11 bloquea los scripts de instalación de `esbuild` y `sharp` (`allow-scripts`). El build funciona igual con los binarios ya presentes.
