# RIDEYEAH · Sistema de Adquisición de Clientes

Proyecto **separado** del sitio web. Aquí vive la estrategia comercial, la
estructura de campañas, el CRM y el material de prospección. Nada de esta
carpeta se publica: `scripts/build.mjs` copia a `dist/` solo las páginas que
lista explícitamente, así que `acquisition/` nunca sale al aire.

**Relación con el resto del repo:** este proyecto *decide* y el sitio *ejecuta*.
Cuando el análisis SEO de aquí dice "falta la página Simi Valley → LAX", esa
página se crea en el proyecto web (`scripts/cities-data.mjs` /
`scripts/routes-data.mjs`), no aquí. Aquí queda el plan, la prioridad y la
medición.

## Idioma

Los documentos de estrategia y operación están en español (para el dueño).
El material que va al mercado — keywords, anuncios, emails, guiones de video —
está en inglés, porque el cliente final busca y compra en inglés. Los dos
idiomas conviven a propósito; no traducir el material de mercado.

## Estructura

| Carpeta | Qué contiene | Cuándo se toca |
|---|---|---|
| `00-estrategia/` | Prioridad de mercados, plan de 90 días, economía unitaria | Al arrancar y cada trimestre |
| `01-paid-media/` | Campañas Google/Meta, keywords, anuncios, tracking | Semanal |
| `02-seo-local/` | Qué páginas existen, cuáles faltan, Google Business Profile | Mensual |
| `03-prospeccion/` | Segmentos B2B, CRM, secuencias de outreach | Diario |
| `04-compliance/` | Permisos LAX/TCP antes de firmar contratos de aeropuerto | Antes de cada contrato |
| `05-operacion/` | Calendario de contenido, KPIs, reporte semanal | Semanal |
| `prompts/` | El prompt maestro del sistema de marketing con IA | Al cambiar la estrategia |
| `tools/` | `pipeline.mjs` — resumen del CRM desde la terminal | Diario |

## Uso

```sh
node acquisition/tools/pipeline.mjs            # resumen del pipeline
node acquisition/tools/pipeline.mjs --segment hotel
node acquisition/tools/pipeline.mjs --due      # seguimientos vencidos hoy
```

El script no tiene dependencias (Node ≥ 18, igual que el resto del repo) y solo
lee `03-prospeccion/prospects.csv`.

## Regla de honestidad sobre los datos

`prospects.csv` viene **vacío de contactos a propósito**. No hay nombres,
emails ni teléfonos inventados en ningún archivo de este proyecto. Los datos de
contacto se llenan siguiendo `03-prospeccion/protocolo-investigacion.md`, con
fuente y fecha por fila. Un CRM con datos inventados es peor que un CRM vacío:
quema dominio de email y hace perder semanas.

Lo mismo aplica a los números de rendimiento. Todo lo que aparece marcado como
**hipótesis** es una estimación para planear presupuesto, no un dato observado.
Se reemplaza con dato real en cuanto haya 30 días de campaña.

## Orden de ataque (resumen de una línea)

1. **Ventura County → LAX** — mercado chico donde sí se puede dominar.
2. **Cuentas corporativas** — un cliente = decenas de viajes.
3. **Hoteles, travel advisors, event planners** — fuentes de referidos.
4. **Airline crew / contratos** — volumen recurrente, pero exige permisos primero.
5. **Farm-out / brokers** — llenar capacidad ociosa.

El detalle está en `00-estrategia/prioridad-mercados.md`.
