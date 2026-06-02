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
  // Real Moovs customer portal. The /iframe form embeds on-site (in a modal);
  // /new/info is the full-page fallback opened in a new tab.
  var MOOVS_IFRAME = "https://customer.moovs.app/ry-quiroz-luxury-llc/iframe";
  var MOOVS_URL = "https://customer.moovs.app/ry-quiroz-luxury-llc/new/info";

  if (!window.goMoovs) {
    var es = (document.documentElement.lang || "").toLowerCase().slice(0, 2) === "es";
    var T = es
      ? { title: "Reserva tu viaje", tab: "Abrir en pestaña nueva", close: "Cerrar" }
      : { title: "Book your ride", tab: "Open in new tab", close: "Close" };
    var modal, frame, lastFocus;

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
            '<span class="bk-modal-title">' + T.title + "</span>" +
            '<a class="bk-modal-new" href="' + MOOVS_URL + '" target="_blank" rel="noopener">' + T.tab +
              ' <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>' +
            '<button type="button" class="bk-modal-close" aria-label="' + T.close + '">' +
              '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>' +
          "</div>" +
          '<div class="bk-modal-body"><iframe title="' + T.title + '" loading="lazy"></iframe></div>' +
        "</div>";
      frame = modal.querySelector("iframe");
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

    window.goMoovs = function () {
      lastFocus = document.activeElement;
      if (!modal) build();
      if (!frame.src) frame.src = MOOVS_IFRAME; // lazy: load Moovs only on first open
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
  var phoneSvg =
    '<svg viewBox="0 0 24 24" width="WW" height="WW" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>';

  var fab = document.createElement("a");
  fab.className = "call-fab";
  fab.href = "tel:" + PHONE;
  fab.setAttribute("aria-label", "Call RideYeah");
  fab.innerHTML = phoneSvg.replace(/WW/g, "22");
  document.body.appendChild(fab);

  var bar = document.createElement("div");
  bar.className = "sticky-cta";
  bar.id = "stickyCta";
  bar.innerHTML =
    '<a class="sc-call" href="tel:' + PHONE + '" aria-label="Call RideYeah">' +
    phoneSvg.replace(/WW/g, "16") +
    " Call</a><button type=\"button\" class=\"sc-book\">Get Your Fixed Quote</button>";
  document.body.appendChild(bar);
  bar.querySelector(".sc-book").addEventListener("click", function () {
    if (window.goMoovs) window.goMoovs();
  });

  var onScroll = function () {
    bar.classList.toggle("show", window.scrollY > 500);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
