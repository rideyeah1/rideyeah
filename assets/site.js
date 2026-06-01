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
  var MOOVS_SLUG = "rideyeah"; // ← replace with the real Moovs slug when ready
  if (!window.goMoovs) {
    window.goMoovs = function (presetTab) {
      var params = new URLSearchParams();
      if (presetTab) params.set("type", presetTab);
      var qs = params.toString();
      window.open(
        "https://customer.moovs.app/" + encodeURIComponent(MOOVS_SLUG) + (qs ? "?" + qs : ""),
        "_blank",
        "noopener"
      );
    };
  }

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
