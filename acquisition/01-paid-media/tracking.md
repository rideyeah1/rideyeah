# Medición — auditoría y plan

> **Esto va antes que los anuncios.** Sin medición, $1,500 de campaña no
> producen aprendizaje: producen una factura y una opinión. Lo de esta página se
> arregla en la Semana 1 del plan de 90 días.

## Qué hay hoy (auditado en el repo, 2026-08-15)

| Pieza | Estado | Dónde |
|---|---|---|
| Meta Pixel | ✅ Instalado, ID `449193533104630` | `rideyeah-home.html:571` |
| Evento `PageView` | ✅ Funciona | `:573` |
| Evento `Lead` en clic de teléfono/SMS | ✅ Funciona | `:575` |
| Evento `Lead` en reserva | ⚠️ **Mide otra cosa** — ver abajo | `:1021` |
| Google Analytics 4 | ❌ **No existe** | — |
| Etiqueta de conversión de Google Ads | ❌ **No existe** | — |
| Call tracking | ❌ No existe | — |
| Conversión de reserva completada | ❌ **No es medible hoy** | — |

## Los tres hallazgos que hay que arreglar

### 1. El evento `Lead` de reserva cuenta intención, no reservas

En `rideyeah-home.html:1021`, dentro de `goMoovs()`:

```js
window.goMoovs = function(url){
  if (window.fbq) fbq('track','Lead',{content_name:'booking'});
  ...
  modal.classList.add('open');
```

El evento dispara **cuando se abre el modal**, antes de que el usuario escriba
nada. Cualquiera que le dé clic a "Reserve your ride" y cierre a los dos
segundos cuenta como Lead.

Consecuencia práctica: el conteo de Leads va a estar muy por encima de las
reservas reales, y si se optimiza la campaña de Meta hacia ese evento, el
algoritmo va a buscar gente que *abre modales*, no gente que reserva. Es una
forma silenciosa de gastar bien el presupuesto en el objetivo equivocado.

**Arreglo:** renombrar el evento actual a algo honesto — `InitiateCheckout` o
un custom `BookingModalOpen` — y reservar `Lead` / `Purchase` para la reserva
confirmada de verdad.

### 2. La reserva ocurre dentro de un iframe de otro dominio

El modal carga `customer.moovs.app` en un iframe. Por política de origen
cruzado, el sitio **no puede ver** si el usuario terminó la reserva. Es decir:
hoy no existe forma de que Google Ads o Meta sepan qué clic produjo una reserva
pagada.

Este es *el* problema de medición del negocio, no un detalle técnico.

Opciones, de mejor a peor:

| Opción | Cómo | Esfuerzo | Fiabilidad |
|---|---|---|---|
| **A. Webhook / API de Moovs** → conversión offline a Google Ads y Meta CAPI | Moovs avisa al crear la reserva; se manda con el `gclid`/`fbclid` guardado | Medio | ⭐ La correcta |
| **B. Página de gracias propia** | Terminar el flujo en un `/thank-you` del propio dominio | Medio | Alta |
| **C. Importación manual semanal** | Exportar reservas de Moovs y subir conversiones offline | Bajo | Media, pero **sirve desde el día 1** |
| **D. Optimizar por lead** (llamada + modal abierto) y revisar la relación lead→reserva a mano | Bajo | Baja — es lo que hay hoy |

**Recomendación:** arrancar con **C** en la semana 1 para no retrasar las
campañas, y construir **A** durante el mes 1. La opción C es fea pero honesta:
una vez por semana se cruzan las reservas de Moovs contra los leads y se sube
el resultado como conversión offline.

Para que A o C funcionen hay que **capturar y persistir `gclid` y `fbclid`** de
la URL de entrada (localStorage + campo oculto), y pasarlos al prefill de
Moovs. Sin ese identificador no hay forma de unir la reserva con el clic que la
originó. Es un cambio chico y es la pieza que habilita todo lo demás.

### 3. No hay Google Ads ni GA4 instalados

No se puede lanzar la campaña de Google sin la etiqueta de conversión. Va
primero, antes de cargar la primera keyword.

## Plan de instalación — Semana 1

- [ ] Google Tag (gtag.js) con GA4 en todas las páginas
- [ ] Etiqueta de conversión de Google Ads
- [ ] Captura de `gclid` / `fbclid` → localStorage → prefill de Moovs
- [ ] Renombrar el `Lead` del modal a `InitiateCheckout`
- [ ] Número de call tracking con reenvío y grabación
- [ ] Meta Conversions API (servidor) además del pixel — el pixel solo pierde
      eventos por bloqueadores e iOS
- [ ] Proceso semanal de conversión offline desde Moovs

## Eventos de conversión

| Evento | Google Ads | Meta | Valor | Primario |
|---|---|---|---|---|
| Reserva confirmada (desde Moovs) | `booking_confirmed` | `Purchase` | Precio real del viaje | ✅ **Sí** |
| Llamada > 60 s | `call_qualified` | `Lead` | $80 estimado | ✅ Sí |
| Formulario / solicitud de cotización | `quote_request` | `Lead` | $60 estimado | ✅ Sí |
| Modal de reserva abierto | `booking_started` | `InitiateCheckout` | — | ❌ Secundario |
| Clic en teléfono | `call_click` | `Contact` | — | ❌ Secundario |

Solo los marcados como primarios se usan para optimizar puja. Los secundarios
son para diagnóstico: sirven para ver dónde se cae la gente, no para entrenar
al algoritmo.

**Por qué la llamada de más de 60 segundos:** un clic en el teléfono no es un
lead — la mitad cuelga. Una llamada que pasa del minuto casi siempre es una
persona preguntando precio y disponibilidad. Ese es el umbral que separa ruido
de intención.

## Convención de UTMs

Formato fijo, sin excepciones — un UTM inconsistente arruina el reporte de
meses:

```
utm_source   = google | facebook | instagram | email | gbp | qr
utm_medium   = cpc | organic | social | email | referral
utm_campaign = vc-simi-lax | vc-thousandoaks-lax | vc-camarillo-lax |
               vc-corporate | vc-hourly | remarketing
utm_content  = <id-del-anuncio>        p.ej. rsa-a1, video-03, static-precio
utm_term     = {keyword}               solo Google, con ValueTrack
```

Ejemplo:

```
https://rideyeah.com/simi-valley-to-lax?utm_source=google&utm_medium=cpc&utm_campaign=vc-simi-lax&utm_content=rsa-a1&utm_term={keyword}
```

Todo en minúsculas. Sin espacios. Sin mayúsculas en `utm_campaign` — Google
Analytics trata `Simi` y `simi` como dos campañas distintas y el reporte se
parte en dos.

## Lo que se revisa cada semana

1. Reservas reales de Moovs vs. conversiones reportadas por las plataformas.
   Si la diferencia crece, el tracking se rompió.
2. Reporte de search terms → negativas nuevas.
3. Grabaciones de llamadas: ¿los leads son del tipo correcto? ¿Cuánto tardó en
   contestarse?
4. CPA por campaña y por ciudad.

Nota sobre grabación de llamadas: California es estado de **consentimiento de
todas las partes**. Si se graban llamadas, el aviso al inicio de la llamada es
obligatorio, no opcional.
