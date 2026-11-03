// Configuración de la prueba técnica T12. Cubre el esquema actual de obras, sin etiquetas finales (eso es T13).
import { collection, config, fields } from '@keystatic/core';

// Por defecto trabaja en local. El modo GitHub se activa con --mode github (npm run dev:panel, build:panel).
const modoGithub = import.meta.env.MODE === 'github';

const textoOpcional = (label: string) => fields.text({ label });
const textoLargo = (label: string) => fields.text({ label, multiline: true });

// Las fotos viven junto a datos.md y el frontmatter las nombra como ./foto.jpg. Keystatic no lo soporta
// de fábrica: guarda el "./" dentro del nombre y arma rutas que su propio API rechaza.
const sinPunto = (v: unknown) => (typeof v === 'string' ? v.replace(/^\.\//, '') : v);
const imagen = (label: string) => {
  const base = fields.image({ label, directory: 'src/content/obras' });
  return {
    ...base,
    filename: (v: any, a: any) => base.filename(sinPunto(v), a),
    parse: (v: any, a: any) => base.parse(sinPunto(v), a),
    serialize: (v: any, a: any) => {
      // Sin sugerencia de nombre: Keystatic renombraría la foto a <campo>.jpg y la galería la clasifica por prefijo.
      const r = base.serialize(v, { ...a, suggestedFilenamePrefix: undefined });
      return r.value ? { ...r, value: './' + r.value } : r;
    },
  } as typeof base;
};

// Omite la casilla cuando tiene su valor por defecto, para no agregar claves a obras que no la tienen.
const casilla = (label: string, defaultValue = false) => {
  const base = fields.checkbox({ label, defaultValue });
  return {
    ...base,
    serialize: (v: boolean) => (v === defaultValue ? { value: undefined } : base.serialize(v)),
  } as typeof base;
};

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
        portada: imagen('Portada'),
        antes: imagen('Antes'),
        antesAlineado: casilla('Antes alineado', true),
        despuesComparar: imagen('Después para comparar'),
        // Un objeto vacío rompería el esquema Zod: se conserva tal cual (T13 debe resolver su edición).
        prensa: fields.ignored(),
        destacada: casilla('Destacada en el Inicio'),
        destacadaListado: casilla('Destacada en el listado'),
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
        // Ídem: un recorrido sin fases incumple .length(5).
        recorrido: fields.ignored(),
        borrador: casilla('Borrador'),
        // Las obras son Markdown solo con frontmatter: sin cuerpo.
        cuerpo: fields.emptyContent({ extension: 'md' }),
      },
    }),
  },
});
