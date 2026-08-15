# Protocolo de investigación de prospectos

Este documento existe por una razón: **un CRM con datos inventados es peor que
un CRM vacío.** Los emails adivinados rebotan, los rebotes hunden la reputación
del dominio, y un dominio quemado tarda meses en recuperarse — con lo cual se
pierde también el correo que sí importa: el de los clientes.

Regla única: **si no está verificado, la celda va vacía.**

---

## Ritmo

**10 empresas investigadas y 10 contactadas por día.** Suena poco. En 30 días
hábiles son 300 empresas y 300 contactos personalizados — más que suficiente
para cerrar las primeras cuentas.

Lo que no se hace: comprar una lista de 5,000 emails y dispararla. Eso quema el
dominio en una semana, produce cero cuentas, y deja al negocio sin poder mandar
confirmaciones de reserva.

---

## Paso 1 — Identificar la empresa

**Corporativo:** parques y corredores de oficinas de las ciudades objetivo,
directorios de cámaras de comercio locales, listas de "mayores empleadores" del
condado, LinkedIn filtrado por ubicación y tamaño (20–500 empleados es el punto
dulce: suficientemente grandes para tener viajes, suficientemente chicas para
que la decisión no pase por compras corporativas).

**Hoteles:** buscar por ciudad, de Ventura County hacia LAX. Priorizar hoteles
de negocios y de aeropuerto sobre moteles de carretera. Sitios de reserva
sirven para inventariar; el contacto se busca en el sitio del hotel.

**Travel / eventos:** directorios de asociaciones profesionales, listados de
planners locales, redes de asesores de viaje de lujo.

**Crew / brokers:** buscar los términos que la industria usa de verdad —
*crew transportation*, *ground transportation vendor*, *airline crew shuttle*,
*transportation management company*. Revisar quién ya presta ese servicio en el
sur de California. Sus sitios suelen tener sección de "partners" o
"owner-operators", que es exactamente la puerta de entrada.

Criterios para descartar rápido:
- Fuera del área servible
- Sin viajes plausibles (comercio local, restaurantes)
- Ya es competidor directo (salvo que se busque farm-out)

## Paso 2 — Encontrar a la persona correcta

Orden de prioridad para corporativo:

1. Executive Assistant / Assistant to the CEO — **la mejor**, reserva a diario
2. Office Manager — en empresas chicas hace las dos funciones
3. Travel Manager / Corporate Travel — solo en empresas grandes
4. Operations Manager
5. HR (eventos y traslados de candidatos)

**No escribirle al CEO.** El correo se va a un filtro o lo reenvía a la
asistente — que se llevará la impresión de que no se hizo la tarea.

Fuentes: sitio de la empresa (páginas About/Team/Contact), LinkedIn, firmas de
email en directorios públicos, comunicados de prensa.

## Paso 3 — Verificar el email

En este orden:

1. **Publicado en el sitio de la empresa** — el mejor caso, cero riesgo.
2. **Formulario de contacto general** — más lento pero legítimo.
3. **Herramienta de verificación** que confirme que el buzón existe.
4. **Teléfono:** llamar a la recepción y preguntar. *"Hi, I'd like to send some
   information about corporate transportation — who handles travel arrangements
   there?"* Funciona sorprendentemente bien y da el nombre correcto.

**Prohibido:** adivinar el patrón (`nombre.apellido@empresa.com`) y mandar sin
verificar. Es exactamente lo que produce rebotes.

Registrar siempre en `source`: `sitio web /about, 2026-08-20` o
`llamada a recepción, 2026-08-21`.

## Paso 4 — Calificar antes de escribir

Cinco preguntas. Si la mayoría es "no", no vale el tiempo:

1. ¿Tienen ejecutivos o clientes que viajan?
2. ¿Están en la zona servible o mandan gente ahí?
3. ¿El volumen justifica el esfuerzo? (≥ 2 viajes/mes)
4. ¿Existe una persona identificable que decide?
5. ¿Se puede decir algo específico de *esta* empresa en el primer mensaje?

La #5 es la que separa un email que se contesta de uno que se borra.

## Paso 5 — Cargar al CRM

Fila completa en `prospects.csv`, `status=researching`, `next_followup` puesto.
Sin `source`, la fila no entra.

---

## Nota legal

- **CAN-SPAM** aplica a email comercial B2B: identificación real del remitente,
  asunto no engañoso, dirección postal física, y mecanismo de baja que se
  respeta en menos de 10 días.
- **Baja inmediata y permanente** para quien la pida. Sin excepciones, sin
  "un último email".
- **California** es estado de consentimiento de todas las partes para grabación
  de llamadas: si se graba, se avisa al inicio.
- Los datos que se guarden de personas caen bajo CCPA/CPRA. Guardar solo lo
  necesario para la relación comercial.

Nada de esto es burocracia: es lo que mantiene el dominio limpio y el negocio
sin problemas legales mientras escala.
