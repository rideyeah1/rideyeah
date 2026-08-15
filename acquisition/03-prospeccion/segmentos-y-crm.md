# Segmentos B2B y CRM

## Por qué esto importa más que los anuncios

Un cliente de anuncios cuesta dinero cada vez. Una cuenta corporativa cuesta
tiempo una vez y produce viajes durante años.

Comparación directa:

| | Cliente de anuncios | Cuenta corporativa |
|---|---|---|
| Costo de adquisición | $60–$150 **cada uno** | Semanas de trabajo comercial, una vez |
| Ingreso | $250–$500 | $5,000–$25,000/año |
| Repetición | Baja | Alta por diseño |
| Se apaga si | Se acaba el presupuesto | Casi nunca |
| Escala | Lineal con el gasto | Se compone |

Por eso la fase 2 arranca el día 15, sin esperar a que la fase 1 termine: no
compiten por el mismo recurso.

---

## Los cinco segmentos

### S1 · Corporativo — empresas y asistentes ejecutivos

**Quién decide:** casi nunca el CEO. Es la **Executive Assistant**, la
**Office Manager** o la **Travel Manager**. Esa persona ya tiene un proveedor,
o usa rideshare y sufre las consecuencias.

**Su dolor real:** no es el precio. Es que el ejecutivo llame furioso porque el
chofer no llegó. Se le vende **que no vuelva a pasar**, no lujo.

**Dónde:** Simi Valley, Thousand Oaks, Westlake Village, Agoura Hills,
Camarillo, Oxnard, Ventura, Woodland Hills, Calabasas, West LA.

**Industrias:** tecnología, estudios y productoras, despachos de abogados,
consultoras, healthcare, financieras, real estate, VC y private equity,
agencias de publicidad, dispositivos médicos (fuerte en Conejo Valley).

**Meta:** 300–500 empresas, 100 contactadas, 1–2 cuentas al día 60.

### S2 · Hoteles y resorts

**Quién decide:** Concierge Manager, Director of Sales, Guest Services Manager,
General Manager.

**Su dolor:** un huésped pide transporte al aeropuerto y el hotel necesita
alguien que **nunca lo deje mal**. Un chofer que falla se convierte en reseña
de 1 estrella para el hotel, no para RIDEYEAH.

**La forma de entrar:** presencial. Un email a un concierge se pierde entre
cincuenta. Presentarse con tarjetas y el vehículo limpio en la puerta convierte
muchísimo mejor. El email sirve para agendar la visita, no para cerrar.

**Meta:** 100–200 hoteles listados, 3–5 acuerdos de partner preferente.

### S3 · Travel advisors, DMCs y event planners

**Quién decide:** el dueño de la agencia o el planner.

**Su dolor:** su reputación depende de proveedores. Necesitan alguien
confiable, con factura en regla y seguro vigente.

**Ventaja:** un solo advisor puede mandar decenas de viajes al año, sin costo
de adquisición.

Incluye: travel agencies, luxury travel advisors, DMCs, agencias de viaje
corporativo, event planners, wedding planners, empresas de concierge VIP.

### S4 · Airline crew transportation

**Quién decide:** casi nunca la aerolínea directamente. La cadena real es:

```
Aerolínea → vendor / crew transportation management → operador local
```

Existen compañías especializadas en mover tripulaciones entre aeropuerto y
hotel, muchas operando 24/7 en el sur de California. **Esas son el cliente**,
no el departamento de compras de la aerolínea.

**Vía paralela:** los hoteles donde se hospedan las tripulaciones. El hotel
suele tener contrato de transporte o al menos influencia sobre quién lo tiene,
y además genera transporte de huéspedes, VIP, overflow y emergencias.

⚠️ **Bloqueo previo:** ningún contrato de este segmento se persigue antes de
completar `04-compliance/lax-permisos.md`. Los requisitos de LAWA no son
trámite: hay procesos de hasta 100 días y requisitos que un operador chico
puede no cumplir.

### S5 · Brokers y farm-out

**Quién decide:** dispatch o el dueño de otra compañía de transporte.

**Su dolor:** tienen el cliente en Ventura County pero no tienen vehículo ahí.
O necesitan overflow para LAX un día pico.

**Pitch:** *"¿Necesitas una Escalade mañana en Simi Valley? Nosotros estamos
ahí."*

**Trade-off honesto:** margen menor por viaje (el broker se queda con su parte)
a cambio de cero costo de adquisición y llenado de huecos de calendario. Es
ingreso de relleno, no la estrategia principal. Cuidado con que desplace viajes
directos de margen completo.

---

## Esquema del CRM (`prospects.csv`)

| Columna | Valores | Nota |
|---|---|---|
| `company` | texto | Nombre legal o comercial |
| `segment` | `corporate` `hotel` `travel` `crew` `broker` | Los cinco de arriba |
| `subsegment` | texto libre | p.ej. `medical devices`, `boutique hotel` |
| `city` | texto | Ciudad de la oficina |
| `website` | URL | |
| `contact_name` | texto | **Vacío hasta verificar** |
| `title` | texto | Puesto exacto |
| `email` | email | **Vacío hasta verificar** |
| `phone` | E.164 o (805) 555-0100 | |
| `source` | texto | De dónde salió el dato + fecha. **Obligatorio.** |
| `service_needed` | texto | Qué necesitan realmente |
| `est_monthly_value` | número USD | Estimado, para priorizar |
| `status` | ver abajo | |
| `last_contact` | AAAA-MM-DD | |
| `next_followup` | AAAA-MM-DD | Lo que dispara la acción del día |
| `owner` | texto | Quién lo trabaja |
| `notes` | texto | Contexto de la conversación |

### Estados

```
new           → cargado, sin investigar
researching   → buscando el contacto correcto
contacted     → primer mensaje enviado
replied       → contestó (cualquier respuesta)
interested    → mostró interés real
quote_requested → pidió precios
negotiating   → negociando términos
won           → cuenta activa
lost          → dijo que no
nurture       → "ahora no" — recontactar en 3–6 meses
not_qualified → no es cliente (fuera de zona, no usa transporte)
```

**`nurture` no es `lost`.** "Ya tenemos proveedor" es la respuesta más común y
casi siempre significa "ahora no". Los proveedores fallan. Estar presente
cuando eso pasa es la mitad del juego en B2B.

### Reglas de higiene

1. **Sin fuente, no entra.** La columna `source` es obligatoria: de dónde salió
   el dato y cuándo.
2. **Nada de datos inventados.** Un email adivinado rebota, y los rebotes
   destruyen la reputación del dominio para todos los envíos futuros.
3. **Un contacto por empresa** al inicio. Escribirle a cinco personas de la
   misma empresa el mismo día se ve como spam y quema la cuenta entera.
4. **`next_followup` siempre lleno** en cualquier estado activo. Un prospecto
   sin próxima fecha es un prospecto perdido.
5. **Baja inmediata.** Quien pide no ser contactado se marca `not_qualified` con
   nota `opt-out` y no se le vuelve a escribir nunca. Es requisito legal
   (CAN-SPAM) y es lo correcto.
