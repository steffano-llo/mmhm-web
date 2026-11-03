Objetivo: validar Keystatic en Cloudflare antes de T13/T14.
Rama: feat/t12-spike-panel. Entrega: sin push ni merge salvo pedido expreso. Pruebas: manuales con Chrome en el panel y `npm run build`.

## Specs
- S1: "Rama feat/t12-spike-panel. Tope de 4 horas."
- S2: "Keystatic en modo GitHub usa una GitHub App que crea su propio asistente, no una OAuth App. Ajusta T12 y T14 en consecuencia."
- S3: "No actualices Astro ni npm. Si el adaptador exige otra versión de Astro, detente y avísame."
- S4: "Nunca muestres ni imprimas el contenido de .env. Antes de empezar, confirma que .env está en .gitignore."
- S5: "No cambies .gitattributes ni configuración global de git sin preguntarme. Si npm bloquea scripts de instalación de un paquete nuevo, dime cuál y por qué antes de aprobarlo."
- S6: "Verifica y reporta en docs/spike-cms.md, con sí o no, estas pruebas: (a) el modo local escribe el frontmatter correcto, incluyendo rutas de imagen relativas; (b) abrir y guardar una obra existente sin editar no produce diferencias en git diff (revisa saltos de línea CRLF/LF y orden de claves); (c) las rutas del panel funcionan en Cloudflare con el sitio público estático; (d) el login con GitHub funciona; (e) un guardado desde el panel crea un commit en una rama de mi fork."
- S7: "Mantén la aprobación manual de comandos en toda la tarea."

## Tasks
- T1 (S1, S7) inline: rama creada desde 0c4894f, con T02 a T08 confirmados. Hecho.
- T2 (S3, S5) inline: instalación sin aprobar scripts, Astro 5.18.2. Hecho, commit 4ac677b.
- T3 (S6a, S6b) inline: configuración y pruebas locales. Hecho, commit f850561.
- T4 (S2) inline: ajustar TAREAS.md. Hecho en local: ese archivo está ignorado por git y no entra en commits.
- T5 (S6c) inline: vista previa desplegada y verificada. Hecho, commit d36fca9.
- T6 (S6d, S6e) inline: login del usuario y commits 28bd1de y 59bdf23 en spike/t12-guardado, verificados con gh api. Hecho.
- T7 (S6) inline: recomendación, revisión visual y verificación independiente. Pendiente.

## Log
- L1 (2026-11-02), pedido original: "Ejecuta la tarea T12 (prueba técnica del panel) con estas aclaraciones", ver S1 a S6. "Antes de actuar, muéstrame el plan."
- L2 (2026-11-02), usuario: "Aprobado, con estos cambios:Antes de crear feat/t12-spike-panel, confirma con git log --oneline que la rama de origen incluye T02 a T08. Si no, dime cuál rama las tiene.Mantén la aprobación manual de comandos en toda la tarea."
- L3 (2026-11-02), usuario: "Sí, instala sin aprobar scripts, con las versiones exactas del plan (--save-exact). Después prueba workerd --version, esbuild --version, npm run build y npm ls astro. Si algo falla, dime qué script hace falta y por qué antes de aprobarlo. Sin --force ni --legacy-peer-deps."
- L4: este documento se creó después de T3, tarde respecto a lo previsto en el plan.
- L4b: revisión nativa con base 768c613 otorgada por el usuario y rechazada por `lens_context_budget_exceeded`, sin crear autoridad. Evaluación del rango 0c4894f..HEAD: riesgo medio, `review_due: false`, `under_budget`. Queda pendiente en el tramo.
- L5: evidencia y detalle de las pruebas en docs/spike-cms.md. Siguiente paso: `wrangler login` y GitHub App.
