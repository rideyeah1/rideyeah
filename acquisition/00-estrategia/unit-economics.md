# Economía unitaria — cuánto puede costar un cliente

Este es el documento que decide si una campaña sigue viva. Antes de gastar el
primer dólar hay que saber cuánto vale una reserva y cuánto se puede pagar por
conseguirla.

> ⚠️ Todo lo marcado **[hipótesis]** es una estimación para dimensionar el
> presupuesto inicial, no un dato observado. Se reemplaza con dato real después
> de 30 días de campaña. La columna que importa es la de la derecha, la que se
> llena con la realidad.

## Ingresos por viaje (dato real, del sitio)

Precios fijos vigentes, una vía, desde `scripts/routes-data.mjs`:

| Ruta | Precio | Tiempo | Millas |
|---|---:|---|---|
| LAX ⇄ Simi Valley | $250 | ~55 min | ~45 mi |
| LAX ⇄ Thousand Oaks | $250 | ~55 min | ~45 mi |
| LAX ⇄ Camarillo | $300 | ~65 min | ~55 mi |
| LAX ⇄ Santa Barbara | $400 | ~110 min | ~95 mi |
| LAX ⇄ Calabasas | $200 | ~40 min | ~30 mi |

**Pendiente:** Oxnard, Ventura, Moorpark, Westlake Village y Newbury Park no
tienen precio publicado. Antes de anunciar en esas ciudades hay que fijarlo —
anunciar sin precio fijo mata la ventaja competitiva principal.

## El número que manda: viaje sencillo vs. redondo

La diferencia entre un negocio rentable y uno que apenas empata:

| Escenario | Ingreso | Comentario |
|---|---:|---|
| Solo ida (Simi Valley → LAX) | $250 | El chofer regresa vacío |
| Ida y vuelta (mismo cliente) | $500 | **Mismo costo de adquisición**, doble ingreso |
| Cliente que repite 3×/año | $750–$1,500 | Adquisición pagada una sola vez |
| Cuenta corporativa, 4 viajes/mes | $12,000/año | Adquisición ≈ tiempo, no dinero de ads |

**Conclusión operativa:** en cada punto de contacto — landing, llamada, email
de confirmación, mensaje post-viaje — hay que empujar el viaje de vuelta. Es la
palanca más barata del sistema entero. Un cliente que reserva ida y vuelta
duplica el ingreso sin subir el CAC ni un centavo.

## Cuánto se puede pagar por una reserva

Con margen de contribución **[hipótesis: 45–55%]** sobre un viaje de $250 —
descontando chofer, combustible, mantenimiento, seguro y comisiones — quedan
unos $110–$135 por viaje sencillo.

Techos de CAC:

| Tipo de cliente | Valor esperado | CAC máximo sano | Razonamiento |
|---|---:|---:|---|
| Una vía, no repite | $250 | **$60–$80** | Debe dejar margen el primer viaje |
| Ida y vuelta | $500 | $120–$150 | El redondo aguanta más CAC |
| Cliente recurrente (3 viajes) | $750+ | $180–$220 | Se recupera en el segundo viaje |
| Cuenta corporativa | $5,000+/año | Semanas de trabajo comercial | No se mide en CPC |

**Regla de corte:** si a los 30 días una campaña está sobre **$80 por reserva**
y no muestra clientes repitiendo, se pausa o se rehace. No se "le da más
tiempo".

## Del clic a la reserva — el embudo hipotético

Cadena que hay que validar **[hipótesis completa]**:

```
Clic ($4–$8 CPC en búsqueda de alta intención)
  ↓ 8–15% del tráfico llena formulario o llama
Lead ($35–$70)
  ↓ 40–60% de los leads reservan (aquí manda la velocidad de respuesta)
Reserva ($70–$150)
```

Dos observaciones que salen de esa cadena:

1. **El CPA inicial va a estar cerca del techo, o encima.** Es normal y es la
   razón de empezar con $1,000–$1,500 y no con $5,000. Los primeros 30 días se
   compran datos, no ganancias.

2. **La palanca más fuerte no es el CPC, es la tasa de respuesta.** Este
   negocio se pierde por no contestar. Un lead de transporte al aeropuerto
   compara 2–3 opciones y reserva con quien contesta primero. Bajar el tiempo
   de respuesta de 2 horas a 5 minutos mueve el CPA más que cualquier ajuste de
   puja.

## Presupuesto inicial

$1,000–$1,500/mes. No $5,000. Distribución de arranque:

| Canal | Mes 1 | Función |
|---|---:|---|
| Google Search | $500–$700 | Intención de compra. Es el canal #1. |
| Meta / Instagram | $250–$400 | Demanda que aún no busca + prueba de creativos |
| Remarketing | $100–$150 | Recuperar al que ya visitó y no reservó |
| Pruebas | $100–$250 | Una hipótesis nueva por mes |

Por qué Google primero: quien escribe `luxury car service Simi Valley` ya
decidió comprar; solo falta a quién. Ese clic vale mucho más que una impresión
bonita mientras alguien hace scroll.

Después de 30 días el dinero se mueve hacia lo que produjo reservas. Ver
`05-operacion/kpis.md` para las reglas de reasignación.

## Cuándo sí se sube el presupuesto

Los cuatro candados — se necesitan **todos**, no dos de tres:

1. Hay ≥ 30 conversiones medidas en la campaña (menos que eso es ruido).
2. El CPA está dentro del techo de la tabla de arriba.
3. Al menos un cliente ya repitió, o hay una cuenta corporativa activa.
4. Hay capacidad real de vehículo y chofer para atender más volumen.

El punto 4 se olvida y es el que más duele: subir el gasto sin capacidad genera
reservas que hay que rechazar, y un cliente rechazado no vuelve.
