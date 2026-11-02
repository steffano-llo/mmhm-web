# Prueba técnica del panel (T12): Keystatic + Cloudflare

Estado: **en curso**. Faltan las pruebas que requieren las cuentas de Cloudflare y GitHub.

## Resultados

| Prueba | Resultado | Resumen |
|---|---|---|
| (a) El modo local escribe el frontmatter correcto, con rutas de imagen relativas | **Sí, con ajustes** | Da `./durante-t12.jpg` solo con un envoltorio propio. De fábrica no funciona |
| (b) Abrir y guardar sin editar no produce diferencias | **Sí, pero no prueba nada** | El panel no escribe si no hay cambios. Con un cambio real, **no**: ver detalle |
| (c) Las rutas del panel funcionan en Cloudflare con el sitio estático | [PENDIENTE: desplegar] | En `workerd` local, sí. Falta la vista previa real |
| (d) El login con GitHub funciona | [PENDIENTE: GitHub App] | Sin probar |
| (e) Un guardado crea un commit en una rama del fork | [PENDIENTE: depende de (d)] | Sin probar |

## Versiones instaladas

Astro sigue en 5.18.2 (`npm ls astro` muestra una sola copia).

- `@astrojs/cloudflare` 12.6.13, `@astrojs/react` 4.4.2, `@keystatic/core` 0.6.9, `@keystatic/astro` 6.0.0, `react` y `react-dom` 19.3.1.
- No se aprobó ningún script de instalación. `workerd`, las tres versiones de `esbuild` y el build funcionan sin ellos. npm sigue avisando de 5 paquetes pendientes (`workerd`, `sharp`, 3 de `esbuild`).

## Detalle de (a)

Se creó una obra temporal desde el panel, se subió una foto y luego se eliminó la obra.

- **Frontmatter:** claves y valores correctos. El archivo queda como `datos.md` junto a la foto.
- **Imagen:** con bytes únicos, el build generó 11 variantes y la ficha la muestra.
- **Problema:** el panel escribe `coords: []` si no se llenan las coordenadas, y el build falla (`coords: Array must contain at least 2 element(s)`). Además, en Windows ese build fallido termina con un error de libuv y código 127. Hay que leer el log hacia arriba para ver la causa.

### Por qué las imágenes no funcionan de fábrica

Con `path: src/content/obras/*/datos`, Keystatic busca las fotos en `<obra>/datos/`, no junto a `datos.md`, y conserva el `./` dentro del nombre.

1. El panel muestra las fotos existentes como vacías.
2. Al guardar, envía un borrado hacia `.../datos/./durante-01.jpg`. Su propio API lo rechaza con `400 Bad data` y no escribe nada.

El ajuste está en `keystatic.config.ts`: la función `imagen()` usa `directory` y quita y vuelve a poner el `./`. También evita que Keystatic renombre la foto a `portada.jpg` y borre la original, lo que la sacaría de la galería (se clasifica por prefijo). Este envoltorio sobrescribe métodos internos del campo, así que **cada actualización de Keystatic debe volver a probarlo**.

## Detalle de (b)

**Sin editar:** el botón Guardar no envía nada (`isSavingDisabled = !hasChanged` en `@keystatic/core`). Se observaron 0 llamadas a `/api/keystatic/update` y hashes iguales en las tres obras.

**Con una edición de una sola línea** en `resumen`, en `rio-lurin`, `costa-verde` y `crematorio-surco`:

| Obra | Líneas cambiadas en el primer guardado | En el segundo guardado |
|---|---|---|
| `rio-lurin` | 30 | Solo la línea editada |
| `costa-verde` | 29 | Solo la línea editada |
| `crematorio-surco` | 143 | Solo la línea editada |

Qué cambia en el primer guardado:

- **Comillas:** se quitan o cambian (`"rio"` pasa a `rio`).
- **Textos largos:** pasan a bloques `>-` con corte de línea.
- **Listas:** `coords: [a, b]` pasa a formato de bloque, con otra sangría.
- **Orden de claves:** sigue el de la configuración (en `crematorio-surco`, `periodo` y `borrador` se mueven).
- **Saltos de línea:** el archivo de trabajo pasa de CRLF a LF. `git diff` no lo muestra porque el índice ya está en LF (`core.autocrlf=true`).
- **Claves nuevas:** `cifras: []` y `hicimos: []` en las obras que no las tenían.
- **Claves perdidas:** `destacada: false` desaparece en `costa-verde`, por el ajuste de casillas.

La comparación por contenido no encontró otras pérdidas: `crematorio-surco` conserva sus 66 valores, `recorrido` incluido. Las tres obras construyen bien.

### Fallos que T13 debe resolver

1. **`hicimos: []` cambia lo que se publica.** `src/pages/proyectos/[slug].astro:113` evalúa `d.hicimos ?` y un arreglo vacío da verdadero: la obra mostraría una lista vacía en lugar del texto de `solucion`. Las pruebas compilan, pero este error no lo detecta el build.
2. **`coords: []` rompe el build.**
3. **`recorrido` y `prensa` no son editables en esta prueba.** Con `fields.object`, las obras que no los tienen reciben `prensa: {}` y un `recorrido` sin fases, que incumplen el esquema Zod. Aquí se usa `fields.ignored()`, que los conserva sin mostrarlos.
4. **Primer guardado ruidoso.** Conviene normalizar las 14 obras una sola vez en un commit aparte. Después, cada guardado solo muestra lo editado. La aceptación de T13 ("sin diferencias inesperadas") debe redactarse sobre esa base.

## Detalle de (c): avance local

Se probó el build en modo GitHub con `wrangler dev --local` (runtime `workerd`), sin cuenta de Cloudflare y sin secretos.

- `/`, `/proyectos/`, `/proyectos/rio-lurin/`, `/keystatic` y `/keystatic/collection/obras` responden 200.
- `/_worker.js/index.js` y `/_routes.json` responden 404: el código del servidor no se expone.
- `/api/keystatic/github/login` responde 500 porque faltan las variables, con el mensaje propio de Keystatic. Es lo esperado sin secretos.
- Las 21 páginas públicas salieron idénticas byte a byte a la línea base al agregar el adaptador, antes de los ajustes posteriores de configuración.
- Keystatic lee los secretos en tiempo de ejecución con `getSecret`, no los incrusta en el build según su código. [PENDIENTE: comprobarlo sobre el build real con `.env`.]

Ajuste necesario en modo dev: excluir `@keystatic/astro/api` de `optimizeDeps`, porque Vite no resuelve `astro:env/server` al prebundlear.

## Riesgos anotados

- **`npm audit`:** 13 avisos (1 crítico, 6 altos, 5 moderados, 1 bajo). El crítico es del propio `astro` y `sharp` también tiene uno alto: ya estaban en el proyecto. `miniflare`, `undici` y `ws` llegan con el adaptador. El arreglo propuesto exige Astro 7 y adaptador 14, fuera del alcance de esta prueba. Conviene evaluarlo antes de T18.
- **Fork público:** los commits de prueba quedan visibles. T14 exige repo privado para producción.
- **`.assetsignore` y CRLF:** con `autocrlf` puede quedar en CRLF en una copia de Windows. [PENDIENTE: revisar si el despliegue desde Windows lo respeta.]

## GitHub App o Keystatic Cloud

[PENDIENTE: decidir con el resultado de (d) y (e).]

## Recomendación

[PENDIENTE: decidir al cerrar (c), (d) y (e).]

## No probado

"El sitio se reconstruye" tras un guardado (aceptación de T12) requiere conectar Cloudflare al fork y queda fuera de (a)–(e).
