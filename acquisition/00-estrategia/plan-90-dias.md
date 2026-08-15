# Plan de 90 días

Cuatro fases que **se solapan a propósito**: la prospección corporativa cuesta
tiempo, no presupuesto de anuncios, así que puede correr en paralelo con la
fase local sin competir por el mismo dinero.

```
Día:  1----15----30----45----60----75----90
F1 Local      ████████████░░░░░░░░░░░░░░░░░░░
F2 Corporate        ████████████████░░░░░░░░░
F3 Hoteles                ██████████████████
F4 Airline/Crew                 ██████ (solo research + permisos)
```

---

## Fase 1 — Local (días 1–30)

**Objetivo:** primeras reservas directas de Ventura County y, más importante,
un sistema de medición que funcione.

### Semana 1 — Medir antes de gastar

Esto va primero. Sin tracking, los siguientes $1,500 no enseñan nada.

- [ ] Conversion tracking en Google Ads (reserva enviada, llamada, formulario)
- [ ] Meta Pixel verificado con evento Lead (ya existe en el sitio — confirmar
      que dispara y que no cuenta doble)
- [ ] Número de call tracking con grabación (crítico: en este negocio la mitad
      de los leads llegan por teléfono, y sin esto son invisibles)
- [ ] Convención de UTMs en todos los anuncios — ver `01-paid-media/tracking.md`
- [ ] Google Business Profile: verificado, 20 áreas de servicio configuradas,
      fotos, horario, mensajería activada
- [ ] Definir quién contesta el teléfono y en cuánto tiempo. **Meta: 5 minutos
      en horario, 30 minutos fuera de horario.**

### Semana 2 — Landing pages

- [ ] Página Simi Valley → LAX (ver `02-seo-local/gap-analysis.md`: hoy solo
      existe la dirección LAX → Simi Valley)
- [ ] Página Thousand Oaks → LAX
- [ ] Hub "RIDEYEAH Ventura County"
- [ ] Verificar en móvil: formulario visible sin scroll, botón de llamada a un
      toque, precio fijo arriba

Estas páginas se crean en el proyecto web (`scripts/routes-data.mjs` y
`scripts/cities-data.mjs`), no en esta carpeta.

### Semana 3 — Encender campañas

- [ ] Campaña A: Simi Valley → LAX ($15–20/día)
- [ ] Campaña B: Thousand Oaks → LAX ($15–20/día)
- [ ] Lista de negativas cargada desde el día uno (ver
      `01-paid-media/keywords/negativas.txt` — es lo que evita quemar el 30%
      del presupuesto en "cheap", "job", "rental")
- [ ] 3 anuncios por campaña, mínimo
- [ ] Meta: campaña de tráfico frío con 3 videos verticales

### Semana 4 — Producción de contenido y primera lectura

- [ ] 20–30 fotos (ver briefing abajo)
- [ ] 10 videos verticales de 10–20 s (guiones en `01-paid-media/meta-ads-creativos.md`)
- [ ] Primer reporte semanal completo (`05-operacion/reporte-semanal.md`)
- [ ] Decisión: qué campaña sube, cuál baja, cuál se apaga

### Briefing de fotografía — 20–30 tomas, no 100

**Vehículo (12–15):** Escalade de frente · de lado · llegando a una casa
suburbana · en la curva de salidas de LAX · frente a un hotel · frente a un
edificio de oficinas · interior segunda fila · detalle de piel · maletas
cargadas · agua y amenities · chofer abriendo la puerta · chofer de pie junto
al vehículo

**Contexto local (8–10):** Tomas donde se reconozca que *esto es de aquí* —
Simi Valley, Conejo Valley, Camarillo, la costa de Ventura, LAX, Malibu. No
hacen falta logos de ciudades; basta con que el contexto visual sea
reconocible. Esta es la diferencia entre parecer una empresa local y parecer un
catálogo de stock.

**Regla:** todas verticales (4:5 y 9:16) además de horizontales. Meta consume
vertical; usar horizontal recortado se nota y baja el rendimiento.

---

## Fase 2 — Corporativo (días 15–60)

**Objetivo:** 300–500 empresas en la base, 100 contactadas, 5–10 conversaciones
reales.

Geografía: Simi Valley, Thousand Oaks, Westlake Village, Agoura Hills,
Camarillo, Oxnard, Ventura, Woodland Hills, Calabasas, West LA.

Puestos objetivo: Executive Assistant, Personal Assistant, Office Manager,
Travel Manager, Operations Manager, HR Manager, Event Manager.

Ritmo sostenible: **10 empresas investigadas y 10 contactadas por día**. Nada de
disparos masivos — ver `03-prospeccion/secuencias-outreach.md` para el porqué
(un dominio quemado tarda meses en recuperarse).

Hitos:
- Día 30 — 150 empresas en el CRM con contacto verificado
- Día 45 — 100 contactadas, secuencia de 5 pasos corriendo
- Día 60 — primera cuenta corporativa activa

---

## Fase 3 — Hoteles y referidores (días 30–90)

**Objetivo:** 100–200 hoteles de Ventura County a LAX, 3–5 acuerdos de
partner preferente.

Puestos: General Manager, Director of Sales, Director of Operations, Concierge
Manager, Guest Services Manager, Transportation Manager.

Aquí el canal presencial gana: para hoteles, presentarse con tarjetas y el
vehículo limpio en la puerta convierte mejor que cualquier email. El email sirve
para agendar la visita, no para cerrar.

Se suman travel advisors, DMCs, event planners y wedding planners con la misma
lógica de referido.

---

## Fase 4 — Airline / crew (días 45–90, solo investigación)

**En esta fase no se firma nada.** Se hacen dos cosas:

1. **Checklist de permisos completo** — `04-compliance/lax-permisos.md`. Sin
   esto no hay conversación que valga.
2. **Mapa del mercado:** aerolínea → hotel de crew → vendor/broker →
   contacto. La entrada casi nunca es la aerolínea directa; es el vendor de
   crew transportation que necesita capacidad local.

Entregable al día 90: una lista priorizada de vendors y brokers con su proceso
de alta documentado, y claridad total sobre qué permisos exige cada tipo de
contrato.

---

## Cómo se ve el éxito al día 90

Esto es lo que se revisa el día 90, en este orden:

1. **CPA por reserva conocido y estable** en al menos una campaña. Sin esto,
   todo lo demás es opinión.
2. **Ventura County → LAX rentable** en al menos una ciudad.
3. **1–2 cuentas corporativas activas** con viajes repetidos.
4. **3–5 hoteles o referidores** mandando negocio.
5. **Camino a contratos de crew documentado**, con permisos claros.

Lo que **no** cuenta como éxito: seguidores, alcance, impresiones, likes.
