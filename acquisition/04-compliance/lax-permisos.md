# Permisos y cumplimiento — LAX

> **Este documento es un bloqueo, no un trámite.** Ningún contrato de crew,
> aerolínea o tenant de aeropuerto se persigue antes de completar el checklist.
> Conseguir un contrato y después descubrir que la estructura de permisos no
> encaja es el peor resultado posible: se quema la relación y no se recupera.

Fuentes verificadas el 2026-08-15 contra LAWA (ver al final). **Los requisitos
cambian.** Este documento se re-verifica contra las fuentes oficiales antes de
cada solicitud — no se toma como verdad permanente.

---

## Las tres capas

Hay tres permisos distintos y se confunden con frecuencia:

| Capa | Quién la otorga | Para qué sirve |
|---|---|---|
| **1. TCP** (Charter-Party Carrier) | CPUC — estado de California | Operar transporte por contrato en el estado |
| **2. NELA / permiso LAX** | LAWA | Recoger y dejar pasajeros comerciales en LAX |
| **3. CSPLA** | LAWA | Prestar ciertos servicios contratados a aerolíneas o tenants |

La **1** es requisito de la **2**. La **3** es un programa aparte, para un tipo
de negocio distinto.

---

## Capa 1 — TCP (CPUC)

Requisito de base para cualquier operación de charter en California. Sin TCP
vigente no hay conversación posible con LAWA, ni con un broker, ni con un
hotel serio.

Checklist:

- [ ] Número de TCP vigente y en buen estado
- [ ] Seguro de responsabilidad en los montos exigidos, con CPUC como
      certificate holder
- [ ] Choferes: licencia correcta, inscritos en el programa de pruebas de
      drogas y alcohol exigido, y en el programa de récord de manejo (EPN/PPR)
- [ ] Vehículos registrados bajo el TCP, no a título personal
- [ ] Workers' comp si hay empleados

---

## Capa 2 — Permiso de LAX (LAWA)

Lo verificado sobre operación de TCP en LAX:

- Se requiere un **Non-Exclusive License Agreement (NELA)** vigente para poder
  agregar un vehículo que opere en LAX.
- **El proceso de solicitud nueva puede tardar hasta 100 días.** Es el dato que
  cambia la planeación: si se quiere operar en LAX en el trimestre, la solicitud
  empieza *ahora*, no cuando aparezca el contrato.
- Cada vehículo comercial necesita **permiso vigente y transponder de LAX
  activo**, colocado como LAWA lo especifica. **No son transferibles ni
  asignables** entre vehículos.
- Todos los operadores TCP deben inscribirse en el programa de **facturación y
  pago en línea (OLA)** para conservar la autorización de operar.
- **Cuota de acceso por viaje: $5 u $8 por recogida**, facturada mensualmente
  según los viajes que registre el transponder en el sistema AVI del
  aeropuerto.
- Existe un proceso anual de **re-decal**: actualizar documentos y flota y pagar
  la cuota administrativa anual, dentro del mes asignado. Fuera de plazo hay
  recargos.
- Operador y choferes son responsables de conocer y cumplir las
  **LAX Ground Transportation Rules and Regulations**.

### Impacto en la economía unitaria

La cuota de $5–$8 por recogida entra en el costo variable de cada viaje a LAX.
Sobre un viaje de $250 no mueve la aguja, pero **debe estar en el cálculo de
margen** de `00-estrategia/unit-economics.md`, sobre todo si algún día se
negocia con brokers a tarifas ajustadas: ahí sí decide si un viaje deja dinero.

Checklist:

- [ ] NELA vigente (o solicitud iniciada — contar hasta 100 días)
- [ ] Permiso y transponder por cada vehículo que opere en LAX
- [ ] Inscripción en OLA activa
- [ ] Re-decal anual en el mes asignado
- [ ] Reglas de ground transportation leídas por operador y choferes
- [ ] Costo por viaje incorporado al modelo de precios

---

## Capa 3 — CSPP / CSPLA

Programa distinto, y es el que aplica si algún día se busca un contrato directo
con una aerolínea o un tenant de LAX.

El **Certified Service Provider Program (CSPP)** de LAWA fija requisitos mínimos
para empresas que prestan ciertos servicios a aerolíneas, consorcios de
aerolíneas u otros clientes de aviación en LAX. Quien califica recibe un
**Certified Service Provider License Agreement (CSPLA)**.

Requisitos verificados:

- **Contrato de servicio directo** con una aerolínea, tenant, licensee o
  consorcio reconocido en LAX.
- **Espacio operativo en arrendamiento o subarrendamiento** para vehículos o
  equipo que se almacene o repare en propiedad del aeropuerto.
- Demostrar **capacidad y experiencia para ejecutar los servicios contratados
  sin usar subcontratistas**.
- Revisión de la solicitud completa: **hasta 60 días**.
- Cumplimiento continuo del programa durante toda la vigencia del CSPLA.

### La lectura estratégica

Los requisitos del CSPP describen a un operador con contrato de aerolínea ya
firmado y espacio arrendado en el aeropuerto. Para RIDEYEAH hoy, **ese no es el
camino de entrada**.

El camino realista es el que ya identificaba la estrategia:

```
Aerolínea → vendor / crew transportation management → RIDEYEAH como operador local
```

Ser el subcontratista del vendor evita tener que calificar al CSPP: el que
carga con esos requisitos es el vendor, que ya tiene el contrato y el espacio.
RIDEYEAH aporta lo que a ese vendor le falta — **capacidad de vehículo en
Ventura County y el corredor de la 101**.

Ojo con la letra chica: el CSPP exige al CSP ejecutar **sin subcontratistas**.
Antes de proponerse como capacidad de farm-out a alguien que opera bajo CSPLA,
hay que preguntar bajo qué figura contrataría — puede que su licencia no se lo
permita para ese servicio. Es exactamente el tipo de detalle que conviene
descubrir en la primera llamada y no después de firmar.

---

## Checklist antes de cualquier propuesta B2B

Marcar **todo** antes de mandar la primera propuesta de crew o contrato:

- [ ] TCP vigente, número a la mano
- [ ] Montos de seguro que cumplen lo que exige el contrato (los contratos de
      aerolínea suelen pedir más que el mínimo estatal)
- [ ] COI listo para emitir con el cliente como additional insured
- [ ] Permiso de LAX y transponders si el servicio toca el aeropuerto
- [ ] Choferes con verificación de antecedentes y pruebas de drogas al día
- [ ] Credenciales de aeropuerto si el servicio requiere acceso a zonas
      restringidas
- [ ] Workers' comp vigente
- [ ] Capacidad real de flota para el volumen que se promete
- [ ] Capacidad de dispatch 24/7 comprobable
- [ ] Entidad legal y W-9 en orden

Regla: **nunca prometer una capacidad que no exista todavía.** En este mercado
una promesa incumplida cierra la puerta con ese vendor y con los que hablen con
él.

---

## Fuentes

- [LAWA — Transportation Charter Party](https://www.lawa.org/groups-and-divisions/operations-and-emergency-management/airport-and-ground-transportation-permits/ground-transportation-permits/transportation-charter-party)
- [LAWA — Ground Transportation Permits](https://www.lawa.org/groups-and-divisions/operations-and-emergency-management/airport-and-ground-transportation-permits/ground-transportation-permits)
- [LAWA — Ground Transportation FAQ](https://www.lawa.org/groups-and-divisions/operations-and-emergency-management/airport-and-ground-transportation-permits/ground-transportation-permits/faqs)
- [LAWA — Certified Service Provider License Agreement (CSPLA)](https://www.lawa.org/groups-and-divisions/operations-and-emergency-management/airport-and-ground-transportation-permits/airfield-permits/certified-service-provider-license-agreement)
- [LAWA — CSPP Requirements (PDF)](https://www.lawa.org/media/26841)

**Advertencia:** esto es investigación de fuentes públicas, no asesoría legal.
Antes de firmar cualquier contrato de aeropuerto o aerolínea, revisión con
abogado y con el agente de seguros.
