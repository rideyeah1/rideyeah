/* RideYeah · assets/chat.js — el chat con Sofia, en TODAS las páginas.
 * Lo inyecta scripts/build.mjs antes de </body> (sitio principal, es/, blog/ y /travel),
 * así que ninguna página nace sin chat y no hay que tocar 60 HTML. Trae su propio CSS
 * (el mismo de site.css) porque /travel no carga site.css. */
(function(){
  if (document.getElementById('ryChatCss')) return;
  var s = document.createElement('style');
  s.id = 'ryChatCss';
  s.textContent = '.chat-fab,.chat-panel{--ink:#0a0a0b;--ink-2:#121214;--ink-3:#1a1a1d;--bone:#f7f6f3;--mute:#a9a7a0;--mute-2:#8c8a86;--gold:#c9a86a;--gold-soft:#d9c193;--line:rgba(247,246,243,.1);--serif:"Fraunces",Georgia,serif;--sans:"Manrope",system-ui,sans-serif;--ease:cubic-bezier(.16,1,.3,1);font-family:var(--sans)}\n/* ---------- Customer chat assistant ---------- */\n.chat-fab {\n  position: fixed;\n  right: 22px;\n  bottom: 22px;\n  z-index: 90;\n  width: 56px;\n  height: 56px;\n  border-radius: 50%;\n  background: var(--gold);\n  color: var(--ink);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border: none;\n  cursor: pointer;\n  box-shadow: 0 12px 30px -8px rgba(201, 168, 106, 0.55);\n  transition:\n    transform 0.25s var(--ease),\n    background 0.25s,\n    opacity 0.22s,\n    visibility 0.22s;\n}\n.chat-fab:hover {\n  transform: translateY(-3px) scale(1.05);\n  background: var(--gold-soft);\n}\n.chat-fab.hidden {\n  opacity: 0;\n  visibility: hidden;\n  transform: scale(0.6);\n}\n.chat-panel {\n  position: fixed;\n  right: 22px;\n  bottom: 22px;\n  z-index: 120;\n  display: flex;\n  flex-direction: column;\n  width: min(380px, calc(100vw - 32px));\n  height: min(560px, calc(100vh - 120px));\n  background: var(--ink-2);\n  border: 1px solid var(--line);\n  border-radius: 14px;\n  overflow: hidden;\n  box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.7);\n  opacity: 0;\n  visibility: hidden;\n  transform: translateY(16px) scale(0.98);\n  transform-origin: bottom right;\n  transition:\n    opacity 0.28s var(--ease),\n    transform 0.28s var(--ease),\n    visibility 0.28s;\n}\n.chat-panel.open {\n  opacity: 1;\n  visibility: visible;\n  transform: none;\n}\n.chat-head {\n  display: flex;\n  align-items: center;\n  gap: 11px;\n  padding: 14px 14px 14px 18px;\n  background: var(--ink);\n  border-bottom: 1px solid var(--line);\n}\n.chat-head .chat-dot {\n  width: 9px;\n  height: 9px;\n  border-radius: 50%;\n  background: #86c98a;\n  box-shadow: 0 0 0 3px rgba(134, 201, 138, 0.18);\n  flex-shrink: 0;\n}\n.chat-h-txt {\n  margin-right: auto;\n  display: flex;\n  flex-direction: column;\n  line-height: 1.25;\n}\n.chat-title {\n  font-family: var(--serif);\n  font-size: 16px;\n  font-weight: 500;\n  color: var(--bone);\n}\n.chat-sub {\n  font-size: 11px;\n  color: var(--mute-2);\n  letter-spacing: 0.02em;\n}\n.chat-close {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 4px;\n  background: none;\n  border: none;\n  color: var(--bone);\n  cursor: pointer;\n  border-radius: 4px;\n  transition: color 0.2s;\n}\n.chat-close:hover {\n  color: var(--gold);\n}\n.chat-body {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  padding: 16px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  scroll-behavior: smooth;\n}\n.chat-msg {\n  max-width: 84%;\n  padding: 10px 13px;\n  border-radius: 13px;\n  font-size: 14px;\n  line-height: 1.5;\n  white-space: pre-wrap;\n  word-wrap: break-word;\n  overflow-wrap: anywhere;\n}\n.chat-msg.bot {\n  align-self: flex-start;\n  background: var(--ink-3);\n  color: var(--bone);\n  border-bottom-left-radius: 4px;\n}\n.chat-msg.user {\n  align-self: flex-end;\n  background: rgba(201, 168, 106, 0.16);\n  color: var(--bone);\n  border-bottom-right-radius: 4px;\n}\n.chat-msg a {\n  color: var(--gold);\n  text-decoration: underline;\n}\n.chat-acts {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n  align-self: flex-start;\n  max-width: 84%;\n}\n.chat-act {\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  font-family: var(--sans);\n  font-size: 13px;\n  font-weight: 600;\n  color: var(--ink);\n  background: var(--gold);\n  border-radius: 999px;\n  padding: 9px 15px;\n  cursor: pointer;\n}\n.chat-act.ghost {\n  color: var(--bone);\n  background: none;\n  border: 1px solid var(--line);\n}\n.chat-act.ghost:hover {\n  border-color: var(--gold);\n  color: var(--gold);\n}\n.chat-typing {\n  align-self: flex-start;\n  display: inline-flex;\n  gap: 4px;\n  padding: 13px 14px;\n  background: var(--ink-3);\n  border-radius: 13px;\n  border-bottom-left-radius: 4px;\n}\n.chat-typing span {\n  width: 7px;\n  height: 7px;\n  border-radius: 50%;\n  background: var(--gold);\n  opacity: 0.5;\n  animation: chatdot 1s infinite;\n}\n.chat-typing span:nth-child(2) {\n  animation-delay: 0.15s;\n}\n.chat-typing span:nth-child(3) {\n  animation-delay: 0.3s;\n}\n@keyframes chatdot {\n  0%,\n  60%,\n  100% {\n    opacity: 0.35;\n    transform: translateY(0);\n  }\n  30% {\n    opacity: 1;\n    transform: translateY(-3px);\n  }\n}\n.chat-chips {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 7px;\n  padding: 0 16px 12px;\n}\n.chat-chip {\n  font-family: var(--sans);\n  font-size: 12.5px;\n  font-weight: 500;\n  color: var(--bone);\n  background: none;\n  border: 1px solid var(--line);\n  border-radius: 999px;\n  padding: 7px 13px;\n  cursor: pointer;\n  transition:\n    border-color 0.2s,\n    background 0.2s,\n    color 0.2s;\n}\n.chat-chip:hover {\n  border-color: var(--gold);\n  background: rgba(201, 168, 106, 0.12);\n  color: var(--gold);\n}\n.chat-notice {\n  font-size: 11px;\n  line-height: 1.4;\n  color: var(--mute-2);\n  padding: 8px 16px 0;\n  border-top: 1px solid var(--line);\n  background: var(--ink-2);\n}\n.chat-notice a {\n  color: var(--gold);\n  text-decoration: underline;\n  text-underline-offset: 2px;\n}\n.chat-foot {\n  display: flex;\n  gap: 8px;\n  padding: 12px;\n  border-top: 1px solid var(--line);\n  background: var(--ink-2);\n}\n.chat-notice + .chat-foot {\n  border-top: none;\n}\n.chat-input {\n  flex: 1;\n  background: var(--ink);\n  border: 1px solid var(--line);\n  border-radius: 8px;\n  padding: 11px 13px;\n  color: var(--bone);\n  font-family: var(--sans);\n  font-size: 14px;\n  line-height: 1.4;\n  resize: none;\n  outline: none;\n  max-height: 96px;\n  transition:\n    border-color 0.2s,\n    box-shadow 0.2s;\n}\n.chat-input::placeholder {\n  color: var(--mute-2);\n}\n.chat-input:focus {\n  border-color: var(--gold);\n  box-shadow: 0 0 0 3px rgba(201, 168, 106, 0.14);\n}\n.chat-send {\n  flex-shrink: 0;\n  width: 44px;\n  border: none;\n  border-radius: 8px;\n  background: var(--gold);\n  color: var(--ink);\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: background 0.2s;\n}\n.chat-send:hover {\n  background: var(--gold-soft);\n}\n.chat-send:disabled {\n  opacity: 0.45;\n  cursor: default;\n}\n@media (max-width: 880px) {\n  .chat-fab {\n    right: 16px;\n    bottom: calc(80px + env(safe-area-inset-bottom));\n  }\n  .chat-panel {\n    right: 10px;\n    left: 10px;\n    bottom: 10px;\n    top: 10px;\n    width: auto;\n    height: auto;\n  }\n  body.chat-open .sticky-cta {\n    transform: translateY(120%);\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .chat-fab,\n  .chat-panel,\n  .chat-typing span {\n    transition: none;\n    animation: none;\n  }\n}\n';
  document.head.appendChild(s);
})();
/* ===== Sofia: el chat del sitio (12-sep-2026) =====
 * Mismo widget de siempre (mismo CSS), pero el cerebro ya no es Workers AI
 * con una lista de precios escrita a mano: es SOFIA, la misma asistente que
 * contesta el teléfono, a través de rysistema.com/api/chat/web. Cotiza con el
 * cotizador real, reserva de verdad y manda el enlace de pago. Si la oficina
 * toma la conversación desde el panel, sus respuestas aparecen aquí mismo
 * (el widget pregunta por novedades cada pocos segundos mientras está abierto).
 * La conversación se recuerda en este navegador (localStorage) por 24 h. */
(function () {
  if (window.ryChat) return;
  window.ryChat = 1;
  var API = window.RY_CHAT_API || "https://rysistema.com/api/chat/web";
  var isES = (document.documentElement.lang || "en").toLowerCase().slice(0, 2) === "es";
  var PHONE = "+18056606439",
    PHONE_H = "(805) 660-6439";

  var T = isES
    ? {
        title: "Sofia · RideYeah",
        sub: "Asistente virtual (IA) · los chats se guardan",
        intro: "Hola, soy Sofia, la asistente virtual de RideYeah. Este chat se guarda para tomar tu reserva. Una persona del equipo puede intervenir en cualquier momento. ¿En qué te ayudo?",
        notice: "Atendido por un asistente con IA · al chatear aceptas nuestra <a href=\"/privacy\">política de privacidad</a>",
        open: "Abrir chat",
        close: "Cerrar",
        ph: "Escribe tu mensaje…",
        fallback: "Tengo problemas para conectar ahora mismo. Reserva en línea, o llámanos/textea al " + PHONE_H + ".",
        human: "Si prefieres hablar con una persona del equipo:",
        call: "Llamar",
        sms: "Enviar SMS",
        chips: {
          book: "Reservar en línea",
          fares: "¿Cuánto cuesta desde LAX?",
          airport: "Recogida en el aeropuerto",
          human: "Hablar con una persona",
          faq: "Cancelación y espera",
        },
        say: {
          fares: "¿Cuánto cuesta un viaje desde LAX? ¿Cuáles son las rutas con precio fijo?",
          airport: "¿Cómo funciona la recogida en el aeropuerto? ¿Rastrean el vuelo?",
          human: "Quiero hablar con una persona, por favor.",
          faq: "¿Cuál es la política de cancelación, tiempo de espera y pago?",
        },
      }
    : {
        title: "Sofia · RideYeah",
        sub: "Virtual assistant (AI) · chats are saved",
        intro: "Hi, I'm Sofia, RideYeah's virtual assistant. This chat is saved to book your ride. A team member can step in anytime. How can I help?",
        notice: "Handled by an AI assistant · by chatting you agree to our <a href=\"/privacy\">privacy policy</a>",
        open: "Open chat",
        close: "Close",
        ph: "Type your message…",
        fallback: "I’m having trouble connecting right now. Book online, or call/text us at " + PHONE_H + ".",
        human: "If you’d rather talk to a person on our team:",
        call: "Call",
        sms: "Text us",
        chips: {
          book: "Book online",
          fares: "How much from LAX?",
          airport: "Airport pickup",
          human: "Talk to a person",
          faq: "Cancellation & waiting",
        },
        say: {
          fares: "How much is a ride from LAX? Which routes have a fixed price?",
          airport: "How does airport pickup work? Do you track the flight?",
          human: "I'd like to talk to a person, please.",
          faq: "What is your cancellation, waiting time and payment policy?",
        },
      };

  var ICON_CHAT =
    '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"></path></svg>';
  var ICON_CLOSE =
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
  var ICON_SEND =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';

  var fab = document.createElement("button");
  fab.type = "button";
  fab.className = "chat-fab";
  fab.setAttribute("aria-label", T.open);
  fab.innerHTML = ICON_CHAT;
  document.body.appendChild(fab);

  var panel = document.createElement("div");
  panel.className = "chat-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "false");
  panel.setAttribute("aria-label", T.title);
  panel.innerHTML =
    '<div class="chat-head"><span class="chat-dot"></span>' +
    '<span class="chat-h-txt"><span class="chat-title">' +
    T.title +
    '</span><span class="chat-sub">' +
    T.sub +
    "</span></span>" +
    '<button type="button" class="chat-close" aria-label="' +
    T.close +
    '">' +
    ICON_CLOSE +
    "</button></div>" +
    '<div class="chat-body" id="ryChatBody"></div>' +
    '<div class="chat-chips" id="ryChatChips"></div>' +
    '<div class="chat-notice">' +
    T.notice +
    '</div>' +
    '<div class="chat-foot"><textarea class="chat-input" id="ryChatInput" rows="1" maxlength="1000" placeholder="' +
    T.ph +
    '" aria-label="' +
    T.ph +
    '"></textarea>' +
    '<button type="button" class="chat-send" id="ryChatSend" aria-label="' +
    T.ph +
    '">' +
    ICON_SEND +
    "</button></div>";
  document.body.appendChild(panel);

  var body = panel.querySelector("#ryChatBody"),
    chipsRow = panel.querySelector("#ryChatChips"),
    input = panel.querySelector("#ryChatInput"),
    sendBtn = panel.querySelector("#ryChatSend");

  /* La ficha de la conversación (la da el servidor) y el último mensaje visto. */
  var sesion = null,
    lastId = 0,
    shown = {};
  try {
    var g = JSON.parse(localStorage.getItem("ry_chat_sesion") || "null");
    if (g && g.s && Date.now() - (g.t || 0) < 24 * 3600 * 1000) sesion = g.s;
  } catch (e) {}
  function recordar() {
    try {
      localStorage.setItem("ry_chat_sesion", JSON.stringify({ s: sesion, t: Date.now() }));
    } catch (e) {}
  }

  function scrollDown() {
    body.scrollTop = body.scrollHeight;
  }
  function linkify(text) {
    var esc = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return esc.replace(/(https?:\/\/[^\s)]+)/g, function (u) {
      return '<a href="' + u + '" target="_blank" rel="noopener">' + u + "</a>";
    });
  }
  function bubble(text, who) {
    var d = document.createElement("div");
    d.className = "chat-msg " + (who === "user" ? "user" : "bot");
    if (who === "user") d.textContent = text;
    else d.innerHTML = linkify(text);
    body.appendChild(d);
    scrollDown();
    return d;
  }
  function pintar(mensajes) {
    var nuevos = 0;
    (mensajes || []).forEach(function (m) {
      if (shown[m.id]) return;
      shown[m.id] = 1;
      if (m.id > lastId) lastId = m.id;
      bubble(m.texto, m.rol === "cliente" ? "user" : "bot");
      if (m.rol !== "cliente") nuevos++;
    });
    return nuevos;
  }
  /* "Hablar con una persona" NO es una ficha a la vista (dueño, 12-sep-2026):
   * si estuviera, todos la tocarían de entrada y Sofia no haría su trabajo.
   * El servidor manda `ofrecerHumano` cuando hace falta (el cliente lo pidió y
   * Sofia avisó a la oficina, Sofia falló, la oficina tomó el chat, o la
   * conversación se alargó) y entonces se enseña, chiquito y una sola vez. */
  var humanoOfrecido = false;
  function humanActions() {
    if (humanoOfrecido) return;
    humanoOfrecido = true;
    bubble(T.human, "bot");
    var wrap = document.createElement("div");
    wrap.className = "chat-acts";
    var a1 = document.createElement("a");
    a1.className = "chat-act ghost";
    a1.href = "tel:" + PHONE;
    a1.textContent = T.call;
    var a2 = document.createElement("a");
    a2.className = "chat-act ghost";
    a2.href = "sms:" + PHONE;
    a2.textContent = T.sms;
    wrap.appendChild(a1);
    wrap.appendChild(a2);
    body.appendChild(wrap);
    scrollDown();
  }

  var busy = false,
    typingEl = null;
  function showTyping() {
    if (typingEl) return;
    typingEl = document.createElement("div");
    typingEl.className = "chat-typing";
    typingEl.innerHTML = "<span></span><span></span><span></span>";
    body.appendChild(typingEl);
    scrollDown();
  }
  function hideTyping() {
    if (typingEl) {
      typingEl.remove();
      typingEl = null;
    }
  }

  function pedir(payload) {
    return fetch(API, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    }).then(function (r) {
      return r.json();
    });
  }

  /* Abrir: si hay ficha, trae el historial; si no, pide una nueva (el saludo
   * viene del servidor y no cuesta nada: no pasa por la IA). */
  var arrancando = null,
    introPintada = false;
  function arrancar() {
    if (arrancando) return arrancando;
    /* Aviso fijo (IA, chat guardado, humano disponible) ANTES de cualquier
     * respuesta del servidor, aunque el saludo lo mande el servidor. */
    if (!introPintada) {
      introPintada = true;
      bubble(T.intro, "bot");
    }
    showTyping();
    var p = sesion
      ? fetch(API + "?sesion=" + encodeURIComponent(sesion) + "&desde=0").then(function (r) {
          if (r.status === 404) {
            sesion = null;
            return pedir({ idioma: isES ? "es" : "en", pagina: location.pathname });
          }
          return r.json();
        })
      : pedir({ idioma: isES ? "es" : "en", pagina: location.pathname });
    arrancando = p
      .then(function (d) {
        hideTyping();
        if (!d || !d.ok) throw new Error("x");
        if (d.sesion) {
          sesion = d.sesion;
          recordar();
        }
        pintar(d.mensajes);
      })
      .catch(function () {
        hideTyping();
        arrancando = null;
        bubble(T.fallback, "bot");
      });
    return arrancando;
  }

  /* Mientras el chat está abierto, cada 5 s pregunta si hay algo nuevo (la
   * oficina puede contestar desde el panel). */
  var poll = null;
  function empezarPoll() {
    if (poll) return;
    poll = setInterval(function () {
      if (!sesion || busy) return;
      fetch(API + "?sesion=" + encodeURIComponent(sesion) + "&desde=" + lastId)
        .then(function (r) {
          return r.json();
        })
        .then(function (d) {
          if (d && d.ok) pintar(d.mensajes);
        })
        .catch(function () {});
    }, 5000);
  }
  function pararPoll() {
    if (poll) clearInterval(poll);
    poll = null;
  }

  function decir(text) {
    text = (text || "").trim();
    if (!text || busy) return;
    input.value = "";
    input.style.height = "auto";
    bubble(text, "user");
    busy = true;
    sendBtn.disabled = true;
    showTyping();
    Promise.resolve(sesion ? null : arrancar())
      .then(function () {
        return pedir({ sesion: sesion, texto: text, idioma: isES ? "es" : "en", pagina: location.pathname });
      })
      .then(function (d) {
        hideTyping();
        if (!d || !d.ok) throw new Error("x");
        if (d.sesion && d.sesion !== sesion) {
          sesion = d.sesion;
          recordar();
        }
        /* El propio mensaje del cliente vuelve en la lista: marcarlo como visto. */
        (d.mensajes || []).forEach(function (m) {
          if (m.rol === "cliente" && m.texto === text) {
            shown[m.id] = 1;
            if (m.id > lastId) lastId = m.id;
          }
        });
        var n = pintar(d.mensajes);
        if (d.aviso && !n) bubble(d.aviso, "bot");
        if (d.ofrecerHumano) humanActions();
        recordar();
      })
      .catch(function () {
        hideTyping();
        bubble(T.fallback, "bot");
      })
      .then(function () {
        busy = false;
        sendBtn.disabled = false;
        input.focus();
      });
  }
  function send() {
    decir(input.value);
  }

  var chipDefs = [
    {
      k: "book",
      fn: function () {
        if (window.goMoovs) window.goMoovs();
        else location.href = "/#book";
      },
    },
    {
      k: "fares",
      fn: function () {
        decir(T.say.fares);
      },
    },
    {
      k: "airport",
      fn: function () {
        decir(T.say.airport);
      },
    },
    {
      k: "faq",
      fn: function () {
        decir(T.say.faq);
      },
    },
  ];
  chipDefs.forEach(function (c) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "chat-chip";
    b.textContent = T.chips[c.k];
    b.addEventListener("click", c.fn);
    chipsRow.appendChild(b);
  });

  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });
  input.addEventListener("input", function () {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 96) + "px";
  });

  var lastFocus = null;
  function openChat() {
    lastFocus = document.activeElement;
    panel.classList.add("open");
    fab.classList.add("hidden");
    document.body.classList.add("chat-open");
    arrancar();
    empezarPoll();
    if (window.gtag) {
      try {
        gtag("event", "chat_open", { channel: "web" });
      } catch (e) {}
    }
    setTimeout(function () {
      input.focus();
      scrollDown();
    }, 60);
  }
  function closeChat() {
    panel.classList.remove("open");
    fab.classList.remove("hidden");
    document.body.classList.remove("chat-open");
    pararPoll();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  fab.addEventListener("click", openChat);
  panel.querySelector(".chat-close").addEventListener("click", closeChat);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("open")) closeChat();
  });
})();
