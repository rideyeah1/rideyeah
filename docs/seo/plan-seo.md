# SEO de rideyeah.com — instrucción de ejecución

*Para el Claude de Reynaldo. Pegar este documento completo.*

---

## De dónde salen estas palabras

De un análisis real de la competencia hecho en agosto de 2026: Driven Miami,
Empire CLS, Empire Limousines y Transfeero. Se revisaron sus sitemaps, sus
títulos, sus URLs y sus anuncios activos. **No son palabras inventadas ni sacadas
de una lluvia de ideas** — son las que a esos operadores les están funcionando,
adaptadas a la zona donde opera Rideyeah.

Los archivos que acompañan a este:

| Archivo | Qué trae |
|---|---|
| `palabras-clave-v1.md` | Las que salieron del análisis de competencia |
| `palabras-clave-nuestras.md` | Las que salieron del sitio propio, de Google y de la zona |

> **Si algo en esos dos archivos contradice a este documento, manda este.**
> Los archivos de palabras son listas; el orden de ejecución vive aquí y sólo
> aquí. Ante cualquier duda de *qué se hace primero*, esta es la fuente.

---

## LO QUE HAY QUE ENTENDER PRIMERO

**Estas palabras no se "agregan" a la página que ya existe.**

Cada palabra clave de la lista es **una página nueva del sitio**, con su propia
URL, su propio título y su propio botón de reserva.

Es así porque así ganan los cuatro competidores que analizamos:

- Driven Miami: ~34 páginas de servicio, una por aeropuerto, barrio y ocasión.
- Transfeero: 3.772 páginas sólo de ruta aeropuerto→destino.
- Ninguno de los cuatro ranquea metiendo palabras en la home.

Si se meten las 40 palabras en la home, no pasa nada. Google no reparte una sola
página entre cuarenta búsquedas distintas.

---

## DÓNDE VA CADA PALABRA, DENTRO DE SU PÁGINA

Una vez creada la página, la palabra clave de esa página va en estos siete
lugares. **Sólo en estos.**

| # | Lugar | Cómo |
|---|---|---|
| 1 | **URL (slug)** | Minúsculas, guiones, sin palabras de relleno. `/lax-to-simi-valley/` |
| 2 | **`<title>`** | Patrón: `<Palabra clave> \| Book Online \| Rideyeah`. Máximo 60 caracteres. Es el patrón exacto de Driven Miami. |
| 3 | **`<meta name="description">`** | 150–160 caracteres. La palabra clave una vez, y una razón para hacer clic (precio fijo, espera incluida, reserva en línea). |
| 4 | **`<h1>`** | **Uno solo por página.** Contiene la palabra clave tal cual. |
| 5 | **Primeras 100 palabras del cuerpo** | La palabra clave aparece de forma natural en el primer párrafo. |
| 6 | **`alt` de las imágenes** | Describiendo la foto de verdad. `Black Chevrolet Suburban at LAX arrivals terminal`, no `lax car service lax car service`. |
| 7 | **Texto del enlace interno** | Cuando otra página enlace a ésta, el texto del enlace es la palabra clave. No "haz clic aquí". |

### Lo que NO se hace

- **Nada de `<meta name="keywords">`.** Google lo ignora desde 2009. Es una
  etiqueta muerta.
- **Nada de repetir la palabra clave.** Dos o tres veces en toda la página es
  suficiente. Más que eso es relleno y Google lo penaliza.
- **Nada de texto oculto**, ni blanco sobre blanco, ni bloques al pie llenos de
  ciudades.
- **Nunca la misma palabra clave en dos páginas.** Compiten entre sí y las dos
  pierden. Una palabra, una página.

---

## ESTRUCTURA MÍNIMA DE CADA PÁGINA NUEVA

```
<h1> con la palabra clave
Botón de reserva → Moovs. ARRIBA, sobre el pliegue.
Precio o rango de precio, visible.
Párrafo corto: qué incluye (espera, seguimiento de vuelo, equipaje).
Qué vehículos aplican + foto real.
3–5 preguntas frecuentes de esa ruta o zona.
Botón de reserva otra vez, al final.
Enlaces internos a 3 páginas hermanas.
```

**El precio o el rango tiene que estar visible.** Todas estas búsquedas llevan
intención de precio. La página que lo esconde pierde contra la que lo muestra.
Es el patrón de Transfeero y es por lo que ranquean primeros.

---

## DATOS ESTRUCTURADOS (schema.org)

En cada página de servicio, un bloque JSON-LD. Google lo usa para entender que
es un negocio local con un servicio concreto en una zona concreta.

- Tipo `LocalBusiness` en la home y en la página de contacto, con NAP
  (nombre, dirección, teléfono) **idéntico** al de la Ficha de Google.
- Tipo `Service` en cada página de servicio, con `areaServed`.
- Tipo `FAQPage` donde haya preguntas frecuentes.

**El NAP tiene que coincidir carácter por carácter** con la Ficha de Google
Business Profile. Una diferencia de "Ste 200" contra "Suite 200" le dice a Google
que puede que sean dos negocios distintos.

---

## ORDEN DE EJECUCIÓN

**Antes de crear una sola página nueva, hay que arreglar lo que ya existe.**
El sitio actual es más grande de lo que Google puede ver, y hay páginas
compitiendo entre sí. Eso se arregla primero — cuesta menos y rinde más rápido
que escribir contenido nuevo.

### Tanda 0 — arreglar lo que hay (hacer YA)

| # | Qué | Por qué |
|---|---|---|
| 0.1 | **Meter la sección `/travel/` en el `sitemap.xml`.** Son **32 páginas** (guías de 8 aeropuertos, 8 atracciones, 6 centros de convenciones, 5 hoteles) que existen, están escritas, y **no están en el sitemap**. Sólo se enlazan desde el pie de página. | Es la acción de mayor retorno por minuto de todo este documento. Contenido ya hecho que Google casi no ve. |
| 0.2 | **Resolver la canibalización.** Dos artículos del blog compiten contra `/lax-to-thousand-oaks` y `/lax-to-calabasas` por la misma palabra clave. Decidir cuál manda: el artículo se reescribe hacia otro ángulo, o se redirige (301) a la página de ruta. | Dos páginas peleando por una palabra clave hacen que pierdan las dos. |
| 0.3 | **Invertir el patrón del `<title>` en las 9 páginas de ciudad.** Hoy dicen `Chauffeur Service in X`. Google dice que la gente escribe **`car service`** y **`limo service`**, no "chauffeur service". | Cambio de una línea por página. La palabra del cliente gana sobre la palabra de la industria. |
| 0.4 | **Enlazar `/travel/` desde el cuerpo, no sólo desde el pie.** Cada página de aeropuerto debe enlazar su guía correspondiente. | Un enlace de pie pesa mucho menos que uno del cuerpo. |

### Tanda 1 — los huecos grandes

| # | Página nueva | Por qué |
|---|---|---|
| 1.1 | **Rutas al revés: ciudad → LAX.** Las 12 páginas de ruta que existen son todas `LAX → ciudad`. **No hay ni una en sentido contrario.** Google autocompleta el sentido inverso con al menos 11 orígenes (`car service to lax from orange county`, `car service camarillo to lax`, `...from thousand oaks`). | Es el cliente que **reserva con antelación y repite**. El que va del aeropuerto a casa reserva una vez; el que va a tomar un vuelo reserva cada vez que viaja. |
| 1.2 | **`/simi-valley-black-car-service/`** — no existe página de Simi Valley, que es **la base del negocio**. Sí hay de Beverly Hills y de Malibu. **Ojo:** usar `black car service`, nunca `Simi Valley car service` a secas — ese término lo tienen copado los talleres mecánicos y los concesionarios. | La ciudad donde está la empresa no tiene página. |
| 1.3 | **`/lax-car-service-with-car-seat/`** — 12 frases verificadas, cero cobertura hoy. `lax car service with car seat` es de las primeras sugerencias de Google. El ángulo que convierte: **Uber no lo resuelve.** | **No publicar sin confirmar antes con Reynaldo que Rideyeah efectivamente ofrece sillas de bebé, y verificar la ley de California al respecto.** |
| 1.4 | **`/lax-to-long-beach-cruise-terminal/`** y puerto de Los Ángeles. Verificado, y el sitio no tiene **ni una** página de crucero. | Hueco limpio, sin nadie del lado nuestro. |
| 1.5 | **`meet and greet` y `pick up`** son las **dos primeras sugerencias** de Google para "LAX car service" — antes que el precio y antes que las reseñas. Van como sección destacada en cada página de aeropuerto. | Es lo primero que la gente quiere saber. |

### Tanda 2 y siguientes

Dos páginas por semana, de la lista de `palabras-clave-v1.md` y del resto de
`palabras-clave-nuestras.md`. Google desconfía de un sitio que pasa de 5 páginas
a 45 en una semana.

### Después de cada tanda

1. Agregar las URLs nuevas al `sitemap.xml`.
2. Enviar el sitemap en Google Search Console.
3. Enlazar cada página nueva desde al menos otra página del sitio. Una página
   sin enlaces internos es una página que Google tarda semanas en encontrar.

---

## UNA ADVERTENCIA SOBRE VENTURA COUNTY

`airport transfer Ventura County` devuelve **cero sugerencias** en Google. Nadie
escribe esa frase. La palabra que usa el cliente ahí es **`shuttle`**.

Y el competidor real en esa zona no es una empresa de black car: es **Ventura
County Airporter** (shuttle compartido, 13 salidas diarias a LAX), más Roadrunner
y Smart Shuttle. Un análisis de competencia de black car nunca los muestra, pero
son los que se están llevando esas búsquedas.

Decisión pendiente de Ángel y Reynaldo: si se compite por esas búsquedas con un
ángulo de "privado en vez de compartido", o si esa zona se deja quieta.

---

## LO QUE SE DESCARTÓ, Y POR QUÉ

Para que nadie lo proponga después creyendo que se pasó por alto:

- **Hospitales** — la demanda la absorbe el shuttle gratuito del propio
  Cedars-Sinai.
- **Estudios de cine** — señal de búsqueda casi nula.
- **Cuentas corporativas** — cero sugerencias en Google. Eso se gana con venta
  directa, no con SEO. Que no se escriba una página esperando que llegue tráfico.

## QUÉ REPORTAR DE VUELTA

Cuando termine cada tanda, decir:

- Las URLs creadas.
- El `<title>` final de cada una.
- Si el sitemap se actualizó y se envió.
- Cualquier palabra clave de la lista que ya estuviera cubierta por una página
  existente — esa no se duplica, se mejora la que hay.

---

## LO QUE NO TENEMOS TODAVÍA, Y NO HAY QUE INVENTAR

**No hay volúmenes de búsqueda.** La lista está ordenada por intención de compra,
no por cantidad de búsquedas. Para tener volúmenes reales hace falta Google
Keyword Planner con una cuenta de Google Ads activa. Se hará cuando haya campaña
corriendo.

Si a alguien le hace falta un número de volumen para decidir algo: no lo estimes.
Dilo y se consigue el dato de verdad.

---

*26 ago 2026.*
