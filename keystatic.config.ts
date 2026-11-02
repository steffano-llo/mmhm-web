// Configuración de la prueba técnica T12. Cubre el esquema actual de obras, sin etiquetas finales (eso es T13).
import { collection, config, fields } from '@keystatic/core';

// Por defecto trabaja en local. El modo GitHub solo se activa con PUBLIC_KEYSTATIC_MODO=github.
const modoGithub = import.meta.env.PUBLIC_KEYSTATIC_MODO === 'github';

const textoOpcional = (label: string) => fields.text({ label });
const textoLargo = (label: string) => fields.text({ label, multiline: true });

export default config({
  storage: modoGithub
    ? { kind: 'github', repo: { owner: 'steffano-llo', name: 'mmhm-web' } }
    : { kind: 'local' },
  collections: {
    obras: collection({
      label: 'Obras',
      path: 'src/content/obras/*/datos',
      slugField: 'titulo',
      format: { data: 'yaml', contentField: 'cuerpo' },
      schema: {
        orden: fields.number({ label: 'Orden', validation: { isRequired: true } }),
        titulo: fields.slug({ name: { label: 'Título', validation: { isRequired: true } } }),
        tipo: fields.select({
          label: 'Tipo',
          options: [
            { label: 'Geotecnia', value: 'geo' },
            { label: 'Ríos', value: 'rio' },
            { label: 'Espacio público', value: 'pub' },
            { label: 'Edificaciones', value: 'edif' },
          ],
          defaultValue: 'geo',
        }),
        resumen: fields.text({ label: 'Resumen', multiline: true, validation: { isRequired: true } }),
        ubicacion: textoOpcional('Ubicación'),
        cliente: textoOpcional('Cliente'),
        tramo: textoOpcional('Tramo'),
        alcance: textoOpcional('Alcance'),
        periodo: textoOpcional('Periodo'),
        coords: fields.array(fields.number({ label: 'Coordenada' }), {
          label: 'Coordenadas',
          validation: { length: { max: 2 } },
        }),
        portada: fields.image({ label: 'Portada' }),
        antes: fields.image({ label: 'Antes' }),
        antesAlineado: fields.checkbox({ label: 'Antes alineado', defaultValue: true }),
        despuesComparar: fields.image({ label: 'Después para comparar' }),
        prensa: fields.object(
          {
            t: textoOpcional('Título'),
            fuente: textoOpcional('Fuente'),
            fecha: textoOpcional('Fecha'),
            url: fields.url({ label: 'Enlace' }),
          },
          { label: 'Nota de prensa' },
        ),
        destacada: fields.checkbox({ label: 'Destacada en el Inicio' }),
        destacadaListado: fields.checkbox({ label: 'Destacada en el listado' }),
        reto: textoLargo('Reto'),
        solucion: textoLargo('Solución'),
        resultado: textoLargo('Resultado'),
        plazo: textoOpcional('Plazo'),
        cifras: fields.array(
          fields.object({
            v: textoOpcional('Valor'),
            u: textoOpcional('Unidad'),
            t: textoOpcional('Texto'),
          }),
          { label: 'Cifras', validation: { length: { max: 3 } }, itemLabel: (p) => p.fields.t.value },
        ),
        hicimos: fields.array(textoOpcional('Actividad'), {
          label: 'Lo que hicimos',
          itemLabel: (p) => p.value,
        }),
        recorrido: fields.object(
          {
            set: fields.select({
              label: 'Set',
              options: [
                { label: 'Ríos', value: 'rios' },
                { label: 'Bolognesi', value: 'bolognesi' },
                { label: 'Genérico', value: 'generico' },
              ],
              defaultValue: 'generico',
            }),
            stat: fields.array(textoOpcional('Dato'), { label: 'Dato destacado', validation: { length: { max: 2 } } }),
            fases: fields.array(
              fields.object({
                t: textoOpcional('Título'),
                s: textoOpcional('Subtítulo'),
                lead: textoLargo('Entrada'),
                inc: fields.array(textoOpcional('Incluye'), { label: 'Incluye', itemLabel: (p) => p.value }),
                out: textoOpcional('Resultado'),
                foto: fields.image({ label: 'Foto' }),
              }),
              { label: 'Fases', itemLabel: (p) => p.fields.t.value },
            ),
          },
          { label: 'Recorrido' },
        ),
        borrador: fields.checkbox({ label: 'Borrador' }),
        // Las obras son Markdown solo con frontmatter: sin cuerpo.
        cuerpo: fields.emptyContent({ extension: 'md' }),
      },
    }),
  },
});
