# Reporte semanal — plantilla

Se llena cada lunes con los datos de la semana anterior. **60 minutos.** Copiar
esta plantilla, llenarla, y tomar las decisiones al final. Un reporte que se
llena pero no cambia nada no sirve de nada.

---

```
RIDEYEAH · Reporte semanal
Semana: ____________  al  ____________
```

## 1. Resultado

| Métrica | Esta semana | Semana previa | Δ |
|---|---:|---:|---:|
| Gasto publicitario total | | | |
| Leads (todas las fuentes) | | | |
| Llamadas recibidas | | | |
| Formularios / solicitudes | | | |
| **Reservas confirmadas** | | | |
| **Ingreso** | | | |
| Costo por lead | | | |
| **Costo por reserva** | | | |
| ROAS | | | |

## 2. Por canal

| Canal | Gasto | Leads | Reservas | CPA | Ingreso | ROAS |
|---|---:|---:|---:|---:|---:|---:|
| Google Search | | | | | | |
| Meta / Instagram | | | | | | |
| Remarketing | | | | | | |
| Orgánico / SEO | | | | | | |
| Google Business Profile | | | | | | |
| Referidos | | | | | | |
| Directo / repetido | | | | | | |

## 3. Por campaña

| Campaña | Gasto | Clics | CTR | Leads | Reservas | CPA | Decisión |
|---|---:|---:|---:|---:|---:|---:|---|
| A · Simi Valley → LAX | | | | | | | subir / igual / bajar / pausar |
| B · Thousand Oaks → LAX | | | | | | | |
| C · Camarillo/Oxnard | | | | | | | |
| D · Ventura | | | | | | | |
| E · Corporate VC | | | | | | | |
| F · Hourly | | | | | | | |

## 4. Por geografía

| Ciudad | Gasto | Leads | Reservas | CPA |
|---|---:|---:|---:|---:|
| Simi Valley | | | | |
| Thousand Oaks | | | | |
| Westlake Village | | | | |
| Moorpark | | | | |
| Camarillo | | | | |
| Oxnard | | | | |
| Ventura | | | | |

**Mejor ciudad:** ______  **Peor ciudad:** ______

## 5. Lo mejor y lo peor

- Mejor keyword (más reservas): ______
- Peor keyword (más gasto, cero reservas): ______
- Mejor anuncio (CTR y conversión): ______
- Peor anuncio: ______
- Mejor landing (tasa de conversión): ______
- Negativas agregadas esta semana: ______

## 6. Calidad de leads

| | Cantidad |
|---|---:|
| Leads contestados en < 5 min | |
| Leads contestados en > 1 h | |
| Leads nunca contestados | |
| Llamadas > 60 s | |
| Leads fuera del área servible | |
| **Tasa lead → reserva** | % |

> Si hay leads sin contestar, ese es **el** hallazgo de la semana. Todo lo demás
> pasa a segundo plano hasta arreglarlo.

## 7. Prospección B2B

| Métrica | Esta semana | Acumulado |
|---|---:|---:|
| Empresas investigadas | | |
| Empresas contactadas | | |
| Respuestas recibidas | | |
| Reuniones agendadas | | |
| Propuestas enviadas | | |
| **Cuentas ganadas** | | |
| Tasa de rebote de email | % | |

Conversaciones activas que hay que mover:

1. ______
2. ______
3. ______

## 8. Orgánico y GBP

| Métrica | Esta semana |
|---|---:|
| Vistas del perfil de Google | |
| **Llamadas desde el GBP** | |
| Solicitudes de indicaciones | |
| Reseñas nuevas | |
| Calificación promedio | |
| Posts publicados | |
| Artículos publicados | |

## 9. Operación

- Viajes completados: ______
- Viajes cancelados: ______
- Incidencias (retraso, no-show, queja): ______
- Utilización de flota: ______ %
- ¿Se rechazó algún viaje por falta de capacidad? ______

> Un viaje rechazado por capacidad es una señal de negocio, no un detalle
> operativo. Si se repite, la restricción ya no es marketing: es flota.

## 10. Decisiones para la semana entrante

Máximo tres. Concretas, con responsable:

| # | Decisión | Por qué | Responsable |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |

**A dónde va el próximo dólar de presupuesto, y por qué:**

______________________________________________

---

## Cómo se llena

| Sección | Fuente |
|---|---|
| Gasto, clics, CTR | Google Ads · Meta Ads Manager |
| Leads | Conversiones de plataforma + call tracking + bandeja de entrada |
| **Reservas e ingreso** | **Moovs** — la fuente de verdad, no las plataformas |
| Geografía | Reporte de ubicación de Google Ads |
| GBP | Panel de rendimiento del perfil |
| B2B | `prospects.csv` → `node acquisition/tools/pipeline.mjs` |

**Las reservas siempre se cuentan desde Moovs.** Las plataformas reportan de
más (atribuyen conversiones que no fueron suyas) y de menos (pierden lo que
pasó por teléfono). Moovs sabe qué se cobró. Cuando los números difieran mucho,
el problema es de tracking — ver `01-paid-media/tracking.md`.
