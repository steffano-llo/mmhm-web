Objetivo: colección `obras` en Keystatic con los campos esenciales, etiquetas en español y las 14 obras normalizadas.
Rama: `feat/t13-panel` (sin push ni unión a `main`). Entrega: commits por paso grande. Pruebas: sin ejecutor; manuales con evidencia.

## Specs

- S1. Traer T12 a la rama: "revisa git log main..feat/t12-spike-panel, dime qué commits traer y cómo resolver posibles conflictos".
- S2. Campos: "título, slug, tipo, resumen, ubicación, cliente, periodo y plazo, coordenadas, cifras (máximo 3), hicimos, reto, solución y resultado, servicios (selección múltiple basada en SERVICIO_IDS), fotos (lista con imagen() y fase: comprueba que imagen() funciona dentro de una lista de objetos), portada, antes y después, destacada, destacadaListado, destacadaInicio y borrador".
- S3. "etiquetas y ayudas en español".
- S4. "normaliza el YAML de las 14 obras en un commit aparte con un script de un solo uso, para que abrir y guardar no genere ruido".
- S5. "maneja las listas vacías (cifras: [], hicimos: []) sin romper el sitio (un hicimos vacío debe mostrar solucion)".
- S6. "comprueba que guardar no pierde la portada".
- S7. "Mantén el adaptador de Cloudflare y los scripts dev:panel y build:panel".
- S8. "No hagas el paso de recorrido (prioridad 3): déjalo como fields.ignored()".

## Tasks

- [x] T1 · S1, S7 · inline · cherry-pick de los 7 commits de T12 (`02b4c7c`..`feeafa3`). Sin conflictos; el build no difiere de la línea base.
- [x] T2 · S5 · inline · `hicimos` vacío en `[slug].astro`.
- [ ] T3 · S2, S3, S8 · inline · configuración del panel.
- [ ] T4 · S4 · inline · normalización en un commit aparte.
- [ ] T5 · S2, S6 · inline · pruebas en el panel (perfil temporal, solo localhost).
- [ ] T6 · inline · documentación y cierre.

## Log

- L1 (2026-11-03), pedido original: "Lee CLAUDE.md, TAREAS.md y docs/spike-cms.md. Ejecuta T13 en modo plan. Primero trae el trabajo de T12 a esta rama: revisa git log main..feat/t12-spike-panel, dime qué commits traer y cómo resolver posibles conflictos. Alcance, en este orden de prioridad: (1) los campos esenciales de la obra: título, slug, tipo, resumen, ubicación, cliente, periodo y plazo, coordenadas, cifras (máximo 3), hicimos, reto, solución y resultado, servicios (selección múltiple basada en SERVICIO_IDS), fotos (lista con imagen() y fase: comprueba que imagen() funciona dentro de una lista de objetos), portada, antes y después, destacada, destacadaListado, destacadaInicio y borrador; (2) etiquetas y ayudas en español; (3) recorrido de 5 fases solo si queda tiempo. Además: normaliza el YAML de las 14 obras en un commit aparte con un script de un solo uso, para que abrir y guardar no genere ruido; maneja las listas vacías (cifras: [], hicimos: []) sin romper el sitio (un hicimos vacío debe mostrar solucion); y comprueba que guardar no pierde la portada. Mantén el adaptador de Cloudflare y los scripts dev:panel y build:panel. Muéstrame el plan antes de editar. Commits en español solo con archivos de T13, sin CLAUDE.md ni TAREAS.md. Sin push. Sin revisiones de rama completa."
- L2 (2026-11-03), corrección del usuario: "No hagas el paso de recorrido (prioridad 3): déjalo como fields.ignored(). Haz commit después de cada paso grande, para que el estado se conserve si se corta la sesión. Si usas el navegador, confirma que usa un perfil temporal y solo navega a localhost. Mantén todo en feat/t13-panel; no la unas a main."
- L3: T2 reproducido antes del arreglo: `hicimos: []` generaba `<ul class="ob-check"></ul>` vacío.
