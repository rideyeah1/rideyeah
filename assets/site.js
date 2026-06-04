/* RideYeah · shared subpage behavior (nav, mobile menu, scroll reveal) */
(function () {
  // nav scroll state
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // mobile menu
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");
  var mmClose = document.getElementById("mmClose");
  if (toggle && menu) {
    var open = function () {
      menu.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };
    var close = function () {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };
    toggle.addEventListener("click", open);
    if (mmClose) mmClose.addEventListener("click", close);
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
    addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) close();
    });
  }

  // scroll reveal
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 90 + "ms";
      io.observe(el);
    });
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.in)").forEach(function (el) {
        el.classList.add("in");
      });
    }, 3500);
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("in");
    });
  }
})();

/* ===== Booking (Moovs) + conversion UI for subpages ===== */
(function () {
  // Moovs request flow embedded on-site (modal). The home hero form passes a
  // prefilled `?trip=<JSON>` URL; subpage CTAs open the plain form.
  var MOOVS_REQUEST = "https://customer.moovs.app/ry-quiroz-luxury-llc/request/new";

  if (!window.goMoovs) {
    var es = (document.documentElement.lang || "").toLowerCase().slice(0, 2) === "es";
    var T = es
      ? { title: "Reserva tu viaje", tab: "Abrir en pestaña nueva", close: "Cerrar" }
      : { title: "Book your ride", tab: "Open in new tab", close: "Close" };
    var modal,
      frame,
      newTab,
      lastFocus,
      lastUrl = "";

    function build() {
      modal = document.createElement("div");
      modal.className = "bk-modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-label", T.title);
      modal.innerHTML =
        '<div class="bk-modal-backdrop"></div>' +
        '<div class="bk-modal-panel">' +
        '<div class="bk-modal-head">' +
        '<span class="bk-modal-title">' +
        T.title +
        "</span>" +
        '<a class="bk-modal-new" target="_blank" rel="noopener">' +
        T.tab +
        ' <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>' +
        '<button type="button" class="bk-modal-close" aria-label="' +
        T.close +
        '">' +
        '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>' +
        "</div>" +
        '<div class="bk-modal-body"><iframe title="' +
        T.title +
        '" loading="lazy"></iframe></div>' +
        "</div>";
      frame = modal.querySelector("iframe");
      newTab = modal.querySelector(".bk-modal-new");
      modal.querySelector(".bk-modal-close").addEventListener("click", close);
      modal.querySelector(".bk-modal-backdrop").addEventListener("click", close);
      document.body.appendChild(modal);
    }

    function close() {
      if (!modal) return;
      modal.classList.remove("open");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal && modal.classList.contains("open")) close();
    });

    window.goMoovs = function (url) {
      var target = url || MOOVS_REQUEST;
      lastFocus = document.activeElement;
      if (!modal) build();
      if (target !== lastUrl) {
        frame.src = target;
        lastUrl = target;
      }
      newTab.href = target;
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
      modal.querySelector(".bk-modal-close").focus();
    };
  }

  // Every booking CTA links to a "#book" anchor (#book, /#book, /es/#book,
  // index.html#book). Intercept those clicks and open the booking modal.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href$="#book"]');
    if (a) {
      e.preventDefault();
      window.goMoovs();
    }
  });

  var PHONE = "+18052851570";
  var msgSvg =
    '<svg viewBox="0 0 24 24" width="WW" height="WW" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"></path></svg>';

  // Desktop floating SMS bubble removed — the chat assistant ("Talk to a person")
  // already offers Call/SMS, so a separate SMS fab is redundant. The mobile
  // sticky-cta bar (below) keeps its Message link.
  var bar = document.createElement("div");
  bar.className = "sticky-cta";
  bar.id = "stickyCta";
  bar.innerHTML =
    '<a class="sc-call" href="sms:' +
    PHONE +
    '" aria-label="Text RideYeah">' +
    msgSvg.replace(/WW/g, "16") +
    ' Message</a><button type="button" class="sc-book">Get Your Fixed Quote</button>';
  document.body.appendChild(bar);
  // On subpages the hero booking form lives on the home — send the guest there.
  bar.querySelector(".sc-book").addEventListener("click", function () {
    window.location.href = "/#book";
  });

  var onScroll = function () {
    bar.classList.toggle("show", window.scrollY > 500);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* ===== Customer chat assistant (on-brand widget + Workers AI backend) ===== */
(function () {
  if (window.ryChat) return;
  window.ryChat = 1;
  var isES = (document.documentElement.lang || "en").toLowerCase().slice(0, 2) === "es";
  var PHONE = "+18052851570",
    PHONE_H = "(805) 285-1570";

  var T = isES
    ? {
        title: "Asistente RideYeah",
        sub: "Respuesta al instante",
        open: "Abrir chat",
        close: "Cerrar",
        ph: "Escribe tu mensaje…",
        greet:
          "¡Hola! 👋 Soy el asistente de RideYeah. ¿En qué puedo ayudarte? Toca una opción o escríbeme.",
        fallback:
          "Tengo problemas para conectar ahora mismo. Toca una opción abajo, reserva tu viaje, o llámanos/textea al " +
          PHONE_H +
          ".",
        human: "Con gusto te conecto con nuestro equipo (24/7):",
        call: "Llamar",
        sms: "Enviar SMS",
        chips: {
          book: "Reservar un viaje",
          fares: "Precios y rutas",
          airport: "Aeropuerto y vuelos",
          human: "Hablar con una persona",
          faq: "Preguntas frecuentes",
        },
      }
    : {
        title: "RideYeah Assistant",
        sub: "Replies instantly",
        open: "Open chat",
        close: "Close",
        ph: "Type your message…",
        greet:
          "Hi! 👋 I’m the RideYeah assistant. How can I help? Tap an option or type a message.",
        fallback:
          "I’m having trouble connecting right now. Tap an option below, book your ride, or call/text us at " +
          PHONE_H +
          ".",
        human: "Happy to connect you with our team (24/7):",
        call: "Call",
        sms: "Text us",
        chips: {
          book: "Book a ride",
          fares: "Prices & routes",
          airport: "Airport & flights",
          human: "Talk to a person",
          faq: "FAQ",
        },
      };

  var KB = isES
    ? {
        fares:
          "Tarifas fijas, todo incluido (peajes + propina) — ida desde LAX:\n• Beverly Hills — $95\n• Santa Monica — $89\n• Pasadena — $110\n• Anaheim — $119\n• Disneyland — $125\n• Orange County — $129\n• Irvine — $129\n• Newport Beach — $135\n• Malibu — $150\n\n¿Otra ruta? Reserva para ver tu precio fijo al instante, o llámanos al " +
          PHONE_H +
          ".",
        airport:
          "Cubrimos LAX, John Wayne (SNA), Burbank (BUR) y Long Beach (LGB), más terminales privadas. Tu chofer te recibe con un cartel con tu nombre, monitoreamos tu vuelo en tiempo real y la espera es de cortesía en recogidas de aeropuerto. Viajas en una SUV negra de lujo de tamaño completo (hasta 7 pasajeros + equipaje).",
        faq: "• Precios: fijos y todo incluido (peajes + propina), sin tarifa dinámica.\n• Vuelo demorado: lo monitoreamos y ajustamos la recogida sin costo extra.\n• Pago: seguro vía Moovs; aceptamos tarjetas; precio bloqueado al reservar.\n• Sillas de niño / equipaje extra: agrégalo como nota al reservar o contáctanos.\n• Cancelación: gratis con suficiente anticipación; detalles en tu confirmación o en info@rideyeah.com.",
      }
    : {
        fares:
          "Fixed, all-in fares (tolls + gratuity included) — one-way from LAX:\n• Beverly Hills — $95\n• Santa Monica — $89\n• Pasadena — $110\n• Anaheim — $119\n• Disneyland — $125\n• Orange County — $129\n• Irvine — $129\n• Newport Beach — $135\n• Malibu — $150\n\nAnother route? Book to see your instant fixed price, or call us at " +
          PHONE_H +
          ".",
        airport:
          "We cover LAX, John Wayne (SNA), Burbank (BUR) and Long Beach (LGB), plus private terminals. Your chauffeur meets you with a name sign, we track your flight in real time, and wait time is complimentary on airport pickups. You ride in a full-size luxury black SUV (up to 7 passengers + luggage).",
        faq: "• Pricing: fixed, all-in (tolls + gratuity), no surge.\n• Delayed flight: we track it and adjust pickup at no extra charge.\n• Payment: secure via Moovs; major cards; price locked at booking.\n• Child seats / extra luggage: add a note when booking or contact us.\n• Cancellation: free with enough notice; details in your confirmation or at info@rideyeah.com.",
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
    '<div class="chat-foot"><textarea class="chat-input" id="ryChatInput" rows="1" maxlength="600" placeholder="' +
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

  var msgs = [];
  try {
    msgs = JSON.parse(sessionStorage.getItem("ry_chat") || "[]") || [];
  } catch (e) {
    msgs = [];
  }
  function persist() {
    try {
      sessionStorage.setItem("ry_chat", JSON.stringify(msgs.slice(-30)));
    } catch (e) {}
  }
  function scrollDown() {
    body.scrollTop = body.scrollHeight;
  }
  function bubble(text, who) {
    var d = document.createElement("div");
    d.className = "chat-msg " + (who === "user" ? "user" : "bot");
    d.textContent = text;
    body.appendChild(d);
    scrollDown();
    return d;
  }
  function addMsg(text, who, role) {
    msgs.push({ who: who, text: text, role: role || null });
    persist();
    return bubble(text, who);
  }
  if (msgs.length) {
    msgs.forEach(function (m) {
      bubble(m.text, m.who);
    });
  } else {
    addMsg(T.greet, "bot", null);
  }
  function humanActions() {
    var wrap = document.createElement("div");
    wrap.className = "chat-acts";
    var a1 = document.createElement("a");
    a1.className = "chat-act";
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
        addMsg(KB.fares, "bot", null);
      },
    },
    {
      k: "airport",
      fn: function () {
        addMsg(KB.airport, "bot", null);
      },
    },
    {
      k: "human",
      fn: function () {
        addMsg(T.human, "bot", null);
        humanActions();
      },
    },
    {
      k: "faq",
      fn: function () {
        addMsg(KB.faq, "bot", null);
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

  var busy = false,
    typingEl = null;
  function showTyping() {
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
  function send() {
    var text = (input.value || "").trim();
    if (!text || busy) return;
    input.value = "";
    input.style.height = "auto";
    addMsg(text, "user", "user");
    busy = true;
    sendBtn.disabled = true;
    showTyping();
    var history = msgs
      .filter(function (m) {
        return m.role;
      })
      .map(function (m) {
        return { role: m.role, content: m.text };
      })
      .slice(-6);
    fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: history }),
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        hideTyping();
        if (d && d.configured !== false && d.reply) addMsg(d.reply, "bot", "assistant");
        else addMsg(T.fallback, "bot", null);
      })
      .catch(function () {
        hideTyping();
        addMsg(T.fallback, "bot", null);
      })
      .then(function () {
        busy = false;
        sendBtn.disabled = false;
        input.focus();
      });
  }
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
    setTimeout(function () {
      input.focus();
      scrollDown();
    }, 60);
  }
  function closeChat() {
    panel.classList.remove("open");
    fab.classList.remove("hidden");
    document.body.classList.remove("chat-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  fab.addEventListener("click", openChat);
  panel.querySelector(".chat-close").addEventListener("click", closeChat);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("open")) closeChat();
  });
})();
