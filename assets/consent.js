/* RideYeah · assets/consent.js — cookie consent (12-sep-2026)
 *
 * Por qué existe: en California (CIPA, "pen register") y por buenas prácticas
 * (CalOPPA / CCPA), Google Analytics y el Meta Pixel no deben cargar hasta que
 * el visitante lo acepte. scripts/build.mjs deja esas etiquetas NEUTRALIZADAS
 * en el HTML (type="text/plain" data-consent="ads", y data-src si tenían src);
 * este archivo va en el <head>, ANTES de ellas, y decide:
 *   - hay decisión "all"       → reactiva esas etiquetas (clon en el mismo sitio)
 *   - hay decisión "essential" → no hace nada, no vuelve a preguntar
 *   - no hay decisión          → muestra el banner; activa solo al aceptar
 * Expone window.ryConsent ("all" | "essential" | null) y dispara el evento
 * "ry-consent" (detail = la decisión) al cambiar. assets/site.js lo escucha
 * para encender el Pixel que vive ahí.
 * La decisión se guarda en localStorage bajo "ry_consent" (con try/catch:
 * en navegación privada o sin storage, simplemente se pregunta cada vez). */
(function () {
  if (window.ryConsentLoaded) return;
  window.ryConsentLoaded = 1;

  var KEY = "ry_consent";
  var isES = ((document.documentElement && document.documentElement.lang) || "en").toLowerCase().slice(0, 2) === "es";

  function leer() {
    try {
      var v = localStorage.getItem(KEY);
      return v === "all" || v === "essential" ? v : null;
    } catch (e) {
      return null;
    }
  }
  function guardar(v) {
    try {
      localStorage.setItem(KEY, v);
    } catch (e) {}
  }

  window.ryConsent = leer();

  /* Reactiva las etiquetas neutralizadas por el build, respetando su orden. */
  var activado = false;
  function activar() {
    if (activado) return;
    activado = true;
    var lista = document.querySelectorAll('script[type="text/plain"][data-consent="ads"]');
    Array.prototype.forEach.call(lista, function (viejo) {
      var s = document.createElement("script");
      Array.prototype.forEach.call(viejo.attributes, function (a) {
        if (a.name === "type" || a.name === "data-consent" || a.name === "data-src") return;
        s.setAttribute(a.name, a.value);
      });
      var src = viejo.getAttribute("data-src");
      if (src) s.src = src;
      else s.text = viejo.text || viejo.textContent || "";
      viejo.parentNode.insertBefore(s, viejo);
      viejo.parentNode.removeChild(viejo);
    });
  }
  function cuandoHayaDOM(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  function decidir(v) {
    window.ryConsent = v;
    guardar(v);
    try {
      window.dispatchEvent(new CustomEvent("ry-consent", { detail: v }));
    } catch (e) {
      /* navegadores sin CustomEvent: site.js también mira window.ryConsent */
    }
    if (v === "all") cuandoHayaDOM(activar);
    cerrar();
  }

  /* ---------- banner ---------- */
  var T = isES
    ? {
        label: "Preferencias de cookies",
        txt: "Usamos cookies para analítica y publicidad (Google Analytics, Meta Pixel). ¿Solo cookies esenciales, o aceptar todas?",
        link: "Política de privacidad",
        ess: "Solo esenciales",
        all: "Aceptar todas",
      }
    : {
        label: "Cookie preferences",
        txt: "We use cookies for analytics and advertising (Google Analytics, Meta Pixel). Essential cookies only, or accept all?",
        link: "Privacy policy",
        ess: "Essential only",
        all: "Accept all",
      };

  var banner = null;
  function cerrar() {
    if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
    banner = null;
  }
  function mostrar() {
    if (banner || document.getElementById("ryConsent")) return;
    if (!document.getElementById("ryConsentCss")) {
      var css = document.createElement("style");
      css.id = "ryConsentCss";
      css.textContent =
        ".ry-consent{position:fixed;left:0;right:0;bottom:0;z-index:200;background:#0a0a0b;color:#f7f6f3;border-top:1px solid rgba(201,168,106,.45);box-shadow:0 -12px 40px -20px rgba(0,0,0,.8);font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;line-height:1.5;padding:16px 20px calc(16px + env(safe-area-inset-bottom))}" +
        ".ry-consent-in{max-width:1120px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap}" +
        ".ry-consent p{margin:0;flex:1 1 380px;color:#f7f6f3}" +
        ".ry-consent p a{color:#c9a86a;text-decoration:underline;text-underline-offset:3px}" +
        ".ry-consent-btns{display:flex;gap:10px;flex-wrap:wrap}" +
        ".ry-consent button{font:inherit;font-weight:600;font-size:13px;letter-spacing:.02em;border-radius:999px;padding:10px 18px;cursor:pointer;border:1px solid #c9a86a;background:none;color:#f7f6f3;transition:background .2s,color .2s}" +
        ".ry-consent button:hover{background:rgba(201,168,106,.14)}" +
        ".ry-consent button:focus-visible{outline:2px solid #c9a86a;outline-offset:2px}" +
        ".ry-consent button.ry-consent-all{background:#c9a86a;color:#0a0a0b}" +
        ".ry-consent button.ry-consent-all:hover{background:#d9c193}" +
        "@media (max-width:640px){.ry-consent{font-size:13px;padding:14px 16px calc(14px + env(safe-area-inset-bottom))}.ry-consent-btns{width:100%}.ry-consent button{flex:1}}";
      document.head.appendChild(css);
    }
    banner = document.createElement("div");
    banner.id = "ryConsent";
    banner.className = "ry-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", T.label);
    banner.setAttribute("aria-live", "polite");
    banner.innerHTML =
      '<div class="ry-consent-in"><p id="ryConsentTxt">' +
      T.txt +
      ' <a href="/privacy">' +
      T.link +
      "</a></p>" +
      '<div class="ry-consent-btns">' +
      '<button type="button" class="ry-consent-ess">' +
      T.ess +
      "</button>" +
      '<button type="button" class="ry-consent-all">' +
      T.all +
      "</button></div></div>";
    banner.setAttribute("aria-describedby", "ryConsentTxt");
    banner.querySelector(".ry-consent-ess").addEventListener("click", function () {
      decidir("essential");
    });
    banner.querySelector(".ry-consent-all").addEventListener("click", function () {
      decidir("all");
    });
    document.body.appendChild(banner);
  }

  /* Permite reabrir el banner desde un enlace (p. ej. "Cookie settings" en el pie). */
  window.ryConsentOpen = function () {
    cuandoHayaDOM(mostrar);
  };

  if (window.ryConsent === "all") cuandoHayaDOM(activar);
  else if (window.ryConsent === null) cuandoHayaDOM(mostrar);
})();
