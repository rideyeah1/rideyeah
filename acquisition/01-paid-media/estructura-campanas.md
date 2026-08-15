# Estructura de campañas

## Principio: campañas separadas por ciudad

Una campaña gigante que mezcla todas las ciudades y todos los servicios no
permite responder la única pregunta que importa:

> "Gastamos $200 en Simi Valley y produjo 8 leads. Gastamos $200 en Oxnard y
> produjo 1."

Con una campaña mezclada, esa comparación no existe y se termina adivinando.
Separadas, el presupuesto se mueve solo hacia lo que funciona.

El costo de separar es que cada campaña acumula datos más despacio. Se acepta:
es preferible aprender lento y correcto a aprender rápido y falso.

---

## Google Search — campañas

### Fase 1 (se encienden el día 15)

| ID | Campaña | Geo | Presupuesto/día | Landing |
|---|---|---|---:|---|
| **A** | Simi Valley → LAX | Simi Valley + 8 km, ZIPs 93063/93065 | $15–20 | `/lax-to-simi-valley` |
| **B** | Thousand Oaks → LAX | Thousand Oaks, Westlake Village, Newbury Park | $15–20 | `/lax-to-thousand-oaks` |

Las landings son las páginas de ruta **que ya existen** — no hay que esperar
páginas nuevas para lanzar. El porqué (y por qué *no* crear
`/simi-valley-to-lax` aparte) está en `02-seo-local/gap-analysis.md`.

### Fase 2 (día 30–45, solo si A y B tienen CPA sano)

| ID | Campaña | Geo | Presupuesto/día | Landing |
|---|---|---|---:|---|
| **C** | Camarillo / Oxnard → LAX | Camarillo, Oxnard, Somis | $10–15 | `/lax-to-camarillo` |
| **D** | Ventura → LAX | Ventura, Ojai | $10 | hub Ventura County (por crear) |
| **E** | Corporate transportation VC | Todo Ventura County + Woodland Hills, Calabasas | $10–15 | `/corporate-transportation` |
| **F** | Hourly chauffeur VC | Todo Ventura County | $8–10 | `/hourly-chauffeur` |

> **Requisito antes de encender C y D:** fijar precio para Oxnard y Ventura. No
> están en `scripts/fares-data.mjs`. Anunciar sin precio fijo tira la ventaja
> competitiva principal.

### Configuración común

- **Tipo:** Search únicamente. **Display Network apagado.** La red de display
  en una campaña de búsqueda se come el presupuesto en clics basura.
- **Puja:** arrancar en *Maximize Clicks* con CPC tope de $8. Cambiar a
  *Maximize Conversions* solo cuando la campaña tenga ≥ 30 conversiones.
  Antes de eso, el algoritmo no tiene con qué aprender.
- **Geo:** *Presence — people in or regularly in your targeted locations*.
  **Nunca** la opción por defecto que incluye "interested in", porque mete
  gente de otro estado buscando "LAX transportation".
- **Horario:** todo el día al inicio. Después de 30 días se recorta con datos
  reales, no con intuición.
- **Extensiones:** llamada (crítico), ubicación, sitelinks a flota / precios /
  FAQ, callouts (Fixed Price · Flight Tracking · Professional Chauffeurs ·
  Free Wi-Fi).
- **Negativas:** cargar `keywords/negativas.txt` a nivel de cuenta antes de
  encender nada.

### Estructura de ad groups (ejemplo, campaña A)

Un ad group por intención, no una bolsa de keywords:

| Ad group | Match | Intención |
|---|---|---|
| `A1 · Simi → LAX ruta` | frase + exacta | Sabe a dónde va — **la más valiosa** |
| `A2 · Simi car service` | frase | Busca servicio, no sabe precio |
| `A3 · Simi airport transport` | frase | Genérica de aeropuerto |
| `A4 · Simi black car / chauffeur` | frase | Busca lujo |

Las keywords de cada uno están en `keywords/simi-valley.csv`.

**Sobre broad match:** no usar al inicio. Broad sin historial de conversiones
gasta el presupuesto explorando. Se puede probar en el mes 3, con conversion
tracking maduro y negativas ya depuradas.

---

## Meta / Instagram — conjuntos

Meta cumple otra función que Google: no captura demanda existente, la crea y la
recuerda. Por eso su métrica no es CPA directo sino costo por lead asistido y
volumen de remarketing generado.

| Set | Audiencia | Objetivo | Presupuesto/día |
|---|---|---|---:|
| **M1** Frío local | Ventura County, 30–65, ingreso alto, intereses viaje/negocio | Leads o tráfico | $8–12 |
| **M2** Remarketing sitio | Visitantes 30 días que no reservaron | Conversión | $4–6 |
| **M3** Lookalike | LAL 1% de clientes que ya reservaron | Leads | $4–6 |

> M3 requiere una lista de clientes de al menos ~100 personas. Si no existe
> todavía, ese presupuesto va a M1 hasta que la haya.

Horarios de arranque para probar (después mandan los datos):
- 7:00–9:00 AM · 11:30 AM–1:30 PM · 5:30–8:30 PM

Y un patrón específico de este negocio: **domingo por la tarde y noche**. Es
cuando se planea el viaje de negocios del lunes y cuando alguien cae en cuenta
de que el vuelo del martes necesita transporte. Domingo–jueves concentra la
planeación de viaje.

---

## Reglas de optimización

Semanales, sin excepción — el detalle está en `05-operacion/kpis.md`:

| Situación | Acción |
|---|---|
| Keyword con > 40 clics y 0 conversiones | Pausar |
| Search term irrelevante | A negativas, mismo día |
| Campaña con CPA < techo por 2 semanas | Subir presupuesto 20% |
| Campaña con CPA > 2× techo | Pausar y rehacer |
| Anuncio con CTR < 3% después de 500 impresiones | Reemplazar |
| Ciudad con 0 conversiones tras $300 gastados | Cerrar esa geo |

**Subidas de presupuesto: máximo 20% cada 3–4 días.** Saltos mayores reinician
la fase de aprendizaje y tiran el rendimiento acumulado.
