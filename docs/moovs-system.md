# Sistema Moovs — Mapa + Comparación con RideYeah

> Levantado en vivo el **2026-06-03** desde el navegador logueado del dueño
> (cuenta **RideYeah / R Y Quiroz Luxury LLC**). Solo lectura — no se creó,
> envió ni modificó nada en el sistema.
>
> Fuentes: `operator.moovs.app` (panel del operador) y
> `customer.moovs.app/ry-quiroz-luxury-llc/request/new` (formulario público del
> cliente), más el generador de prefill `buildUrl()` en `rideyeah-home.html`.

---

## 1. Panel del operador (`operator.moovs.app`)

**Módulos (sidebar):** Quotes · Reservations · Dispatch · Driver Tracking ·
Vehicles · Contacts · Invoices · Payables · CRM · Dashboard · Settings.

### Quotes
- Sub-estados (tabs): `NEW · SENT · DRAFT · ARCHIVED · ALL`.
- Estado actual: **vacío** ("No Quotes — Create one to get started!").
- Botón **Create** → abre el panel lateral *Create New Quote*.

### Create New Quote (formulario INTERNO del operador)
Panel lateral derecho, secciones en orden:

| Sección | Campos |
|---|---|
| **ORDER DETAILS** | Search for booking contact (dropdown) · Assigned Member = `R Y Quiroz Luxury LLC` |
| **TRIP TYPE** | `Hourly` \| `One Way` \| `Round Trip` |
| **TRIP DETAILS** | passenger (resumen) |
| **DATE & TIME** | Pick-up Date & Time · Drop-Off Date & Time |
| **PICK-UP** | Address\* (toggle dirección/mapa) · **+ Add Stop** |
| **DROP-OFF** | Address\* |
| **ADDITIONAL INFO** | Passenger Count · Driver Note · **Trip Notes** |
| **VEHICLE** | Add Vehicle |
| **PRICING** | Base Rate (BRA Calculations) · Enter Amount · **Add Pricing** · Total |
| **INTERNAL COMMENTS** | Comment |
| (acción) | **Save quote** |

> El campo **Trip Notes / note** del viaje es donde aterriza nuestra nota de
> aerolínea/vuelo (enviada como **`trip.note`** — ver §6). Verificado en el Step 3
> Confirm del cliente (aparece como **TRIP NOTE**).

### Flujo conceptual
`Quote` (creada por el operador **o** solicitada por el cliente) → el operador
**cotiza precio + asigna vehículo** → **Send** → se convierte en **Reservation**.

---

## 2. Formulario público del cliente (`customer.moovs.app/.../request/new`)

**Este es el espejo directo de nuestro hero form** y el destino del prefill `?trip=`.
URL canónica tras cargar: `.../ry-quiroz-luxury-llc/new/info`.

Flujo de **3 pasos**: `1 Request Information → 2 Choose Vehicle → 3 Confirm`.
(Arriba a la derecha: botón **Login** para clientes recurrentes.)

### Step 1 · Request Information
| Bloque | Detalle |
|---|---|
| **Trip Type** | `Hourly` \| `One Way` \| `Round Trip` (Hourly es el default) |
| → en **Hourly** | aparece **Duration\*** (dropdown, **obligatorio**) |
| → en **Round Trip** | añade fecha/hora de regreso (inferido — no explorado a fondo) |
| **Date & Time** | Pick-up Date & Time\* |
| **Pick-up** | toggle `Address` \| `Airport` |
| → Address | Address\* (autocomplete) |
| → **Airport** | **Arrival Airport\*** + **Airline** (dropdown) + **Flight** + botón **Confirm** + checkbox "I do not have my flight information" |
| **+ Add Stop** | añade paradas intermedias |
| **Drop-off** | toggle `Address` \| `Airport` |
| → Address | Address\* |
| → **Airport** | **Departure Airport\*** + Airline + Flight + Confirm + checkbox |
| **Passenger Count\*** | stepper − / + (obligatorio) |
| (acción) | **Next Step** |

**Modo Airport — clave:** Moovs distingue el lado del aeropuerto:
- **Pick-up Airport → "Arrival Airport"** (recoges a quien **llega**).
- **Drop-off Airport → "Departure Airport"** (llevas a quien **sale**).
- En ambos, Moovs tiene **su propia validación de vuelo** (botón **Confirm**) y
  **Airline es un dropdown** (lista cerrada), no texto libre.

### Step 2 · Choose Vehicle
- **Request Summary**: Pick-up Date & Time · Pick-up Address · Drop-off Address ·
  Passenger Count + botón **Edit** (vuelve a Step 1).
- Tarjetas de vehículo: p. ej. **BLACK SUV PREMIUM** — SUV, 6 Passengers,
  **"Request for Pricing"**, política "No alcohol, food, pets, or smoking allowed".
- Botón **Filters** · **Choose Vehicle** · **Previous Step**.

### Step 3 · Confirm
No explorado a fondo (datos de contacto del cliente + envío del request).

---

## 3. Prefill `?trip=<JSON>` (Booking Widget) — ingeniería inversa

El parámetro `trip` **no está documentado públicamente** (lo construimos nosotros).
Generado por `buildUrl()` en `rideyeah-home.html`.

### Campos que enviamos
```jsonc
{
  "tripCategory": "ONE_WAY | ROUND_TRIP | HOURLY",
  "stops": [
    { "description": "<dirección>", "pickUpGooglePlaceTypes": ["airport", ...] },
    { "description": "<dirección>" }
  ],
  "dateTime": "2026-07-04T15:00:00.000Z",   // hora LITERAL (sin conversión TZ)
  "totalGroupSize": 2,                        // nunca vacío (default 1)
  "totalDuration": 3,                         // solo HOURLY
  "returnDateTime": "...",                    // solo ROUND_TRIP
  "orderType": "airport",                     // en viajes de aeropuerto (sí se aplica → badge "Airport")
  "note": "Airport transfer — Airline: X, Flight: Y. Please track the flight."
}
```

> ⚠️ **La clave correcta es `note`, NO `tripNote`** (ver §6). El widget `?trip=`
> (`useBookingWidgetTrip`) lee `Mt.note`; `tripNote` es de la **otra** integración
> (`?dudaTrip=` → `useDudaTrip`). Hasta el 2026-06-03 enviábamos `tripNote` y la
> nota se caía silenciosamente.

### Comportamiento verificado (en vivo, 2026-06-03)
- Un `trip` válido con ≥1 stop **SALTA el Step 1 completo** y aterriza en
  **Step 2 (Choose Vehicle)**; la URL pasa a `.../new/vehicle?trip=success`.
- ✅ **Mapea perfecto:** `tripCategory`, direcciones (`stops[].description`),
  `dateTime` (mostró "Saturday, Jul 4th, 2026 **3:00 PM**" — hora literal, sin
  desfase), `totalGroupSize` (Passenger Count = 2).
- ✅ `orderType:'airport'` **sí se aplica**: el viaje queda etiquetado **"Airport"**
  (badge ✈ en el Step 3 Confirm). Pero **no** cambia el toggle visual Pick-up/Drop-off
  a modo Airport (quedan en "Address") ni llena los campos estructurados de vuelo.
- ❌ **NO se puede prefillear** el modo Airport ni `airline`/`flightNumber`/
  `trackedFlight` — confirmado leyendo el JS (§6).
- ✅ **`note` sí viaja** (con la clave correcta): aparece como **TRIP NOTE** en el
  Step 3 Confirm. *(Antes usábamos `tripNote`, que el widget ignora → la nota se
  caía. Corregido el 2026-06-03.)*

---

## 4. Comparación RideYeah hero form ↔ Moovs

| RideYeah (`#bookingForm`) | Moovs (Step 1) | Estado |
|---|---|---|
| Tabs **One way / Round trip / Hourly** | Trip Type **Hourly / One Way / Round Trip** | ✅ (orden distinto — cosmético) |
| Pickup (Google autocomplete) | Pick-up → Address\* | ✅ mapea |
| Drop-off (autocomplete) | Drop-off → Address\* | ✅ mapea |
| Date + Time (pickers a medida) | Pick-up Date & Time\* | ✅ hora literal correcta |
| Return date/time (round trip) | Round Trip (regreso) | ✅ vía `returnDateTime` |
| Duration (hourly) | **Duration\*** (obligatorio) | ✅ ahora también obligatorio en el hero (ver brecha 3) |
| Passengers (default 1) | **Passenger Count\*** | ✅ default evita bloqueo |
| **Airline + Flight** (modo aeropuerto) | **Airport mode**: Airline (dropdown) + Flight + **Confirm** | ⚠️ viajan como **`note`** (texto, visible para el operador). Los campos estructurados de Moovs **no** se pueden prefillear (límite del widget, §6) |
| Validación de vuelo (AeroDataBox, propia) | Botón **Confirm** (validación de Moovs) | 🔁 se solapan; la nuestra valida **antes** del handoff |

### Brechas y recomendaciones
1. **Nota de vuelo (`note`) — CORREGIDO 2026-06-03.** Enviábamos `tripNote` (clave
   equivocada) y la nota se caía. Ahora `buildUrl()` emite **`trip.note`** y la
   aerolínea/vuelo aparece como **TRIP NOTE** en Moovs (verificado en vivo).
2. **Modo Airport / vuelo estructurado: NO se puede prefillear** (límite real del
   widget — §6). La info de vuelo viaja como `note` (texto), que es lo máximo por
   esta vía. Para tracking estructurado, el cliente debe activar Airport + meter el
   vuelo en la página de Moovs, o haría falta una integración por la **API del
   operador** (`api-production-v2.moovs.app`, GraphQL), no el widget.
3. **Campos obligatorios — CORREGIDO 2026-08-20.** Moovs **no revalida** un `?trip=`
   prefilleado: se salta el Step 1 y deja al huésped en "Choose Vehicle" con lo que
   le mandemos. Verificado en vivo contra el widget de RideYeah:
   - sin `totalDuration` en HOURLY → crea un viaje por horas **sin horas**
     (el resumen ni siquiera muestra la línea DURATION);
   - sin `dateTime` → Moovs **se inventa "ahora"** como hora de recogida.
   Por eso `checkRequired()` en `rideyeah-home.html` bloquea el submit y marca el
   campo que falta antes del handoff: pickup y drop-off siempre; duración en
   Hourly; fecha y hora; y fecha/hora de regreso en Round trip.
4. **Drop-off en Hourly — CORREGIDO 2026-08-20.** El Hourly de Moovs **sí** tiene
   sección **Drop-off** con `Address *` obligatoria (verificado en vivo cargando
   `request/new` limpio: Hourly es su default y renderiza Trip Type · Date & Time ·
   Pick-up · **Drop-off** · Passenger Count). Pero **solo la renderiza si le
   prefilleamos un segundo stop**: al mandarle un único stop la sección desaparece
   y el huésped acaba en Step 2 con un campo obligatorio que nunca vio — ese era el
   descontrol. Ojo con la trampa de diagnóstico: el resumen del Step 2 en Hourly
   **no imprime** línea de drop-off aunque el dato esté cargado; hay que pulsar
   *Edit* y mirar el Step 1 para comprobarlo. Ahora el hero muestra el drop-off en
   las tres pestañas y `buildUrl()` lo manda siempre como `stops[1]`.
5. **Orden de Trip Type** distinto (cosmético).
6. **"I do not have my flight information"** — Moovs ofrece esta salida; podríamos
   reflejar algo similar.
7. **Validación de vuelo** — la nuestra (AeroDataBox) es **complementaria**: pre-
   valida antes del handoff; Moovs revalida con su Confirm. Bien.

---

## 5. Incógnitas — RESUELTAS (2026-06-03)
- [x] **¿Modo Airport + Airline/Flight vía prefill?** → **NO.** El applier
  `useBookingWidgetTrip` por cada stop solo copia `description`,
  `pickUpGooglePlaceTypes` y `dateTime`; ignora `airport`/`airline`/`flightNumber`/
  `trackedFlight`. (§6)
- [x] **¿Llega la nota al operador?** → **SÍ, con la clave `note`** (no `tripNote`).
  Verificado en vivo en el Step 3 Confirm sin enviar el request. Fix aplicado.

### Pendientes (próximas sesiones)
- [ ] Step 3 **Confirm**: pide teléfono/email/nombre + CAPTCHA Cloudflare + Send
  Request (texto legal de SMS de R Y Quiroz Luxury LLC). Falta mapear el envío.
- [ ] **Settings** del operador: vehículos, pricing automático (BRA), widget config.
- [ ] Módulos no explorados: Reservations, Dispatch, Driver Tracking, Invoices, Payables, CRM.
- [ ] (Opcional) Integración profunda vía API del operador para flight-tracking estructurado.

---

## 6. Cómo Moovs parsea el `?trip=` (leído del bundle `assets/index-*.js`)

**Esquema interno de cada stop** (`getInitialStop`):
```
{ description/location, dateTime, trackedFlight, airport, airline,
  flightNumber, groupSize, note, pickUpGooglePlaceTypes,
  skipFlightDetails, isLocationAirport }
```

**Applier `useBookingWidgetTrip()`** (param `?trip=`). Por cada stop construye:
```js
{ ...getInitialStop(),           // airport/airline/flightNumber/trackedFlight = null
  location: stop.description,
  pickUpGooglePlaceTypes: stop.pickUpGooglePlaceTypes,
  dateTime: <stop 0 = trip.dateTime; en hourly el último = dateTime + totalDuration> }
```
y despacha al estado:
```js
{ orderType: find(allOrderTypes, { slug: trip.orderType }),
  trip: { stops, totalGroupSize: trip.totalGroupSize,
          note: trip.note || "",          // 👈 lee trip.note
          tripCategory: trip.tripCategory,
          ...(trip.totalDuration && { totalDuration, useTotalDuration: true }) },
  ...(trip.returnDateTime && { returnTrip: {...} }) }
```
→ **Solo se consumen:** `tripCategory`, `stops[].description`,
`stops[].pickUpGooglePlaceTypes`, `dateTime`, `totalGroupSize`, `totalDuration`,
`returnDateTime`, `orderType`, **`note`**. Todo lo demás se descarta.

**Detección de aeropuerto (interno):**
`isAirportPickUpStop = !!stop.trackedFlight || stop.pickUpGooglePlaceTypes?.includes("airport") || stop.airport?.icaoCode`.
El toggle **visual** Address/Airport se rige por `isLocationAirport`/`airport.icaoCode`,
que el applier deja en `null` → por eso no se ve el modo Airport aunque mandemos
`pickUpGooglePlaceTypes:["airport"]`.

**Otra integración — `useDudaTrip()`** (param `?dudaTrip=`, de sitios Duda): usa
`note: trip.tripNote || ""`. De ahí venía la confusión de la clave `tripNote`.
