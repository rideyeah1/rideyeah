# SEO — el plan y su estado

Documentos de Ángel, versión corregida del 26-ago-2026. Viven aquí y no en una
carpeta de Descargas porque gobiernan el código de al lado: el que toque
`gen-cities.mjs`, `gen-sitemap.mjs` o `robots.txt` tiene que leerlos primero.

| Archivo | Qué es |
|---|---|
| `plan-seo.md` | **Manda sobre los otros dos.** Las reglas y el orden de ejecución |
| `palabras-competencia.md` | Lista salida del análisis de Driven Miami, Empire CLS, Empire Limousines y Transfeero |
| `palabras-propias.md` | Lista salida del sitio, de Google y de la zona |

## Estado al 26-ago-2026

### Tanda 0 — arreglar lo que ya existe

| # | Qué | Estado |
|---|---|---|
| 0.1 | Meter `/travel/` en el sitemap | **Hecho.** El Travel Hub ya tenía su propio `sitemap.xml` con 56 URLs; lo que faltaba era declararlo en `robots.txt`. Una línea, no 32 páginas |
| — | *(extra)* El sitemap de `/travel/` apuntaba a 56 redirecciones | **Hecho.** Listaba las URLs sin barra final mientras el sitio las sirve con barra y la canónica la lleva. Normalizado en `build.mjs`, no en `travel-static/`, porque esa carpeta la reemplaza entera `sync-travel-hub.mjs` |
| 0.2 | Canibalización del blog | **NO hecho, y a propósito.** Ver abajo |
| 0.3 | Invertir el patrón del `<title>` de las 9 ciudades | **Hecho.** De `Chauffeur Service in <Ciudad> \| Luxury Black SUV \| RideYeah` (65 caracteres) a `<Ciudad> Car Service \| Book Online \| RideYeah` (43-51) |
| 0.4 | Enlazar `/travel/` desde el cuerpo, no sólo desde el pie | **Hecho** en `airport-transfers.html`, que era la única página principal sin ningún enlace de cuerpo al Travel Hub |

### Por qué la 0.2 no se hizo

El plan dice redirigir (301) el artículo del blog hacia la página de ruta.
**Los datos de Search Console dicen lo contrario**, medidos sobre 90 días:

- `/blog/best-lax-airport-transportation-to-thousand-oaks`: **2.329 impresiones,
  4 clics, posición media 13,6**. Rankea para `lax to thousand oaks` (516
  impresiones, posición 10,1), `car service lax to thousand oaks`,
  `lax airport to thousand oaks` y una decena más.
- `/lax-to-thousand-oaks`: **no aparece entre las diez primeras páginas del
  sitio.**

El diagnóstico del plan es correcto —las dos páginas se pisan— pero la
dirección del arreglo no: redirigir la que tiene las posiciones hacia la que no
tiene ninguna es apostar el activo. Y el problema de fondo no es la
canibalización sino **la posición 13,6**: las dos páginas son débiles, y moverlas
una dentro de otra no crea fuerza.

Lo que sí procede es fusionar de verdad —llevar la sustancia del artículo a la
página de ruta, dejarla fuerte, y entonces el 301—. Eso es escribir contenido,
no cambiar configuración.

### Dos hallazgos que confirman el plan

**"Shuttle" es la palabra del cliente en Ventura County.** El plan lo dedujo;
los datos del propio sitio lo confirman. Sólo para Thousand Oaks:
`airport shuttle thousand oaks ca` (52 impresiones),
`lax to thousand oaks shuttle` (32), `shuttle from lax to thousand oaks` (26),
`shuttle from thousand oaks to lax` (10), `lax to moorpark shuttle` (16).

**Las rutas al revés se buscan.** Aparecen `shuttle from thousand oaks to lax`,
`car service from thousand oakes to lax`, `newbury park to lax`. No existe ni una
página en ese sentido — es la Tanda 1.1.

## Dos cosas de `palabras-competencia.md` que NO se siguen

1. **`Simi Valley car service`** (sección 3). El `plan-seo.md` dice
   expresamente que ese término lo tienen copado los talleres y concesionarios,
   y que hay que usar `black car service`. Como el plan manda sobre las listas,
   gana el plan.

2. **"Todo en inglés. Cero páginas en español"** (regla 6). El sitio ya tiene
   **20 páginas en español** con `hreflang` correctamente puesto, generadas por
   `gen-sitemap.mjs` y `generate-es-pages.mjs`. Seguir esa regla significaría
   borrar trabajo que funciona. El `plan-seo.md` no repite esa regla, así que se
   trata como descartada. **No se tocan las páginas en español.**

## Herramienta para decidir con datos

En el repo del panel (`rideyeah-web`):

```bash
node scripts/analizar-pagina-en-google.mjs /lax-to-thousand-oaks
```

Dice con qué búsquedas encuentra Google una página y en qué posición sale. Antes
de mover, redirigir o reescribir cualquier página, mírala ahí primero.
