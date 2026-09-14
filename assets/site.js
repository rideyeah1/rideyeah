/* RideYeah · shared subpage behavior (nav, mobile menu, scroll reveal) */
(function () {
  // Meta Pixel — guarded against double-init, and (12-sep-2026) it only runs
  // with cookie consent: assets/consent.js sets window.ryConsent ("all" |
  // "essential" | null) and fires "ry-consent" when the visitor decides.
  // Every fbq('track', …) call in this file is guarded with window.fbq so it
  // is harmless while the pixel is off.
  var ryInitPixel = function () {
    if (window.ryPixel) return;
    window.ryPixel = 1;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '449193533104630');
    fbq('track', 'PageView');
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('a[href^="tel:"],a[href^="sms:"]');
      if (t && window.fbq) fbq('track', 'Lead', { content_name: 'call' });
    });
  };
  if (window.ryConsent === "all") ryInitPixel();
  window.addEventListener("ry-consent", function (e) {
    if ((e && e.detail) === "all" || window.ryConsent === "all") ryInitPixel();
  });
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
      document.body.classList.add("nav-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };
    var close = function () {
      menu.classList.remove("open");
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };
    toggle.addEventListener("click", open);
    if (mmClose) mmClose.addEventListener("click", close);
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
    // tapping the backdrop (anywhere that isn't a link/button) also closes
    menu.addEventListener("click", function (e) {
      if (e.target === menu) close();
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

/* ===== Booking (rysistema.com/book) + conversion UI for subpages ===== */
(function () {
  // Our own booking portal. Subpage CTAs open its step 1 (no prefill); the home
  // hero form builds the prefilled URL itself. Moovs se retiró tras la auditoría
  // 13-sep-2026 (RY-120). The old <iframe> modal is gone: the portal refuses to
  // be framed (X-Frame-Options: DENY), so the guest goes there in the same tab.
  var BOOK_URL = "https://rysistema.com/book";

  if (!window.goBook) {
    window.goBook = function (url) {
      var target = url || BOOK_URL;
      if (window.fbq) fbq('track', 'Lead', { content_name: 'booking' });
      var sent = false;
      var go = function () { if (sent) return; sent = true; window.location.href = target; };
      // GA4 enhanced measurement only sees <a> clicks, not location.href: without
      // this event the move to our own domain would look like nobody books.
      if (typeof window.gtag === "function") {
        gtag("event", "book_click", { destination: target.split("?")[0], event_callback: go });
        setTimeout(go, 300);
      } else go();
    };
    window.goMoovs = window.goBook; // alias for anything still calling the old name
  }

  // Every booking CTA links to a "#book" anchor (#book, /#book, /es/#book,
  // index.html#book). Intercept those clicks and send the guest to the portal.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href$="#book"]');
    if (a) {
      e.preventDefault();
      window.goBook();
    }
  });

  var PHONE = "+18056606439";
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

/* El chat con Sofia vive en assets/chat.js (lo inyecta el build en todas las páginas). */
