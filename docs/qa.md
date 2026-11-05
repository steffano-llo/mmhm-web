# Control de calidad (T17)

Medido el 2026-11-05 en la rama `feat/t17-calidad`. Referencia: commit `f2f58e9`.

**Resultado:** rendimiento, accesibilidad y SEO no empeoraron. Accesibilidad llega a 100 en las páginas medidas y axe no marca ninguna violación.

## Método

`npm run preview` no funciona desde T12 (`The @astrojs/cloudflare adapter does not support the preview command`). Se usó el método de `docs/linea-base.md`: `astro preview` con una configuración sin adaptador, guardada fuera del repositorio, en el puerto 4322.

| Herramienta | Uso |
|---|---|
| Lighthouse 13.6.0 | 2 corridas en móvil y 1 en escritorio, Chrome 156 headless |
| axe-core | 9 páginas en 360 y 1280 px |
| linkinator 8.1.0 | `dist/`, recursivo y con comprobación de anclas |
| Playwright con Chrome | Desborde, teclado y `prefers-reduced-motion` |

Se usaron perfiles temporales de Chrome y solo peticiones a localhost. Las herramientas se instalaron fuera del proyecto.

## Lighthouse

El rendimiento se compara con el "después" de T19, porque las cifras de T01 no se reproducen. Accesibilidad y SEO se comparan con la tabla de T01, porque T19 no los cambió. Formato: referencia → hoy.

| Página | Modo | Rendimiento | LCP | Accesibilidad | SEO con `noindex` | SEO con `PUBLIC_INDEXABLE=true` |
|---|---|---|---|---|---|---|
| `/` | Móvil | 98 a 100 → 100 | 0,8 s | 97 → 100 | 66 → 69 | 100 |
| `/` | Escritorio | 100 → 100 | 0,2 s | 97 → 100 | 66 → 69 | 100 |
| `/servicios/` | Móvil | 93 a 96 → 96 | 2,9 s | 94 → 100 | 66 → 69 | 100 |
| `/servicios/` | Escritorio | 100 → 100 | 0,8 s | 98 → 100 | 66 → 69 | 100 |
| `/proyectos/` | Móvil | 89 → 89 | 3,8 s | 95 → 100 | 66 → 69 | 100 |
| `/proyectos/` | Escritorio | 98 → 98 | 1,1 s | 99 → 100 | 66 → 69 | 100 |
| `/proyectos/costa-verde/` | Móvil | 96 → 95 a 96 | 2,9 s | 91 → 100 | 66 → 69 | 100 |
| `/proyectos/costa-verde/` | Escritorio | 100 → 100 | 0,6 s | 95 → 100 | 66 → 69 | 100 |

- **Accesibilidad:** ninguna auditoría falla.
- **Antes de corregir:** hoy se midieron 95, 95, 94, 98, 95, 99, 91 y 91, en el orden de la tabla.
- **Buenas prácticas:** 96 en todas las páginas. El único error de consola es el 404 de `/_vercel/insights/script.js`, que solo existe en Vercel.
- **SEO con `noindex`:** el único fallo es `is-crawlable`, a propósito hasta T18.
- **SEO con `PUBLIC_INDEXABLE=true`:** se midió antes del cambio de color de WhatsApp, que no afecta a estas auditorías.
- **`/proyectos/` móvil:** es la cifra menos estable. Una corrida con `PUBLIC_INDEXABLE=true` dio rendimiento 82 y LCP 5,0 s; la otra dio 89 y 3,8 s, con el mismo peso de página.

## axe

Páginas: Inicio, Nosotros, Contacto, Servicios, Proyectos, Costa Verde (con recorrido), Privacidad, Términos y 404.

| Regla | Antes | Después |
|---|---|---|
| `heading-order` | Pie y Servicios | 0 |
| `label-content-name-mismatch` | Todas las páginas | 0 |
| `aria-prohibited-attr` | Costa Verde | 0 |
| `region` | Todas las páginas en 1280 px | 0 |
| `color-contrast` | Antetítulo, etiqueta y WhatsApp | 0 |
| **Total de elementos** | **89** | **0** |

axe no decide en todos los casos, por ejemplo con texto sobre imagen. Esos casos no se revisaron uno por uno.

## Lo corregido

| Problema | Corrección |
|---|---|
| Títulos `h4` sin nivel previo | `h2` en el pie y el índice de servicios, `h3` en las columnas de cada servicio. El aspecto no cambia. |
| Nombre accesible de la marca distinto del texto visible | "MM High Metrik Engineers S.A.C., inicio", con espacio entre las dos líneas de la marca |
| `aria-label` en un `div` sin rol | `role="region"` en los mapas de la ficha y de `/proyectos/` |
| Botón flotante de WhatsApp fuera de todo landmark | Dentro de un `aside` con nombre |
| Antetítulo "Obra destacada" del Inicio (3,36:1) | `--blue-2`, igual que en las secciones oscuras (4,79:1). No cambia ningún color de marca. |
| Etiqueta azul de tipo en la ficha (4,40:1) | Fondo de `#E7EEFF` a `#EEF3FF` (4,61:1). Es un tinte propio de la etiqueta, no una variable de marca. |
| Blanco sobre el verde de WhatsApp (2,86:1) | Aprobado por el usuario: `--wa` de `#1FAF5A` a `#158043` (5,00:1) y hover de `.btn-wa` de `#18964C` a `#116A37` (6,69:1). Afecta a `.btn-wa`, `.mbar .m-wa` y `.wa-float`. |
| Índice de servicios en móvil: el enlace enfocado quedaba cortado | Se desplaza hasta mostrarlo completo y respeta el movimiento reducido |
| "Obras relacionadas" vacío | El bloque se omite. Hoy solo afecta a `instituciones-educativas`; los otros 13 servicios lo conservan. |

## Enlaces

- **Internos:** 388 comprobaciones correctas, con anclas incluidas. Entre ellas están el pie, Nosotros y Contacto, cambiados en T05, T07 y T08.
- **Rotos:** 47 referencias, todas a `/_vercel/insights/script.js`, una por página. Ver [Pendiente](#pendiente).
- **Externos, no comprobados** para no salir de localhost: WhatsApp, Facebook, Instagram, Google Maps, `www.mmhighmetrik.com`, `www.munlima.gob.pe` y las URL absolutas de `mmhm-p.vercel.app` (canónicas y `og:image`).

## Revisión funcional

| Revisión | Resultado |
|---|---|
| Desborde horizontal en 360, 768, 1280 y 1920 px, 10 páginas | Ninguno |
| Textos cortados, con las mismas páginas y anchos | Ninguno detectado, y sin defectos en las capturas revisadas |
| Altura de las páginas respecto al inicio de T17 | Igual en las 6 páginas con captura, salvo Servicios en 360 px: 60 px menos por el bloque omitido |
| Carrusel con teclado | Flechas, Inicio, Fin, Enter y Espacio funcionan. Foco visible, contador correcto y los extremos no pierden el foco. |
| Índice de servicios con teclado (1366 x 768 y 360 x 800) | Los 14 enlaces se alcanzan y muestran foco; Enter lleva al servicio y el ítem activo queda visible. Se corrigió el caso móvil. |
| `prefers-reduced-motion` | Sin animaciones ni transiciones activas en las 10 páginas, sin petición de video y carrusel sin desplazamiento suave |
| Recorrido con teclado y movimiento reducido | Enter abre la fase y mueve el foco al cierre; Escape vuelve a la fase |
| Errores de JavaScript | Ninguno |

## Marcadores `[PENDIENTE]`

No hay ninguno visible en el sitio: ni en `src/` ni en `public/` ni en el HTML de `dist/`. La palabra solo aparece en un texto de obra ("pendientes de drenaje"), con otro sentido.

## No probado

- **Mapas:** Leaflet viene de un CDN y las pruebas no salen de localhost. Falta abrirlos, y también revisar sus ventanas emergentes, que usan `h4` y podrían romper el orden de encabezados.
- **Formulario de contacto:** no se probó su envío a WhatsApp.
- **Lectores de pantalla y dispositivos reales:** no se usaron.

## Pendiente

1. **Recorridos sin validar.** Los 8 borradores de `docs/recorridos-por-validar.md` están publicados sin marcador visible y la empresa debe confirmarlos antes de producción.
2. **Script de Vercel (T18).** `Base.astro` carga `/_vercel/insights/script.js` en todas las páginas. En Cloudflare daría 404 y el error de consola seguiría.
3. **Brochure y enlaces externos (T18).** `BROCHURE` apunta al dominio antiguo, como ya indica T18. Conviene revisar los enlaces externos una vez publicado.
4. **Logos de clientes (T03b).** Logos de Osinergmin, Prolima y Surco son PNG incrustados en SVG; pedir las versiones vectoriales a la empresa. Logo de Lima: SVG de 253 KB sin viewBox.
