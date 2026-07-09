(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  var yearEls = document.querySelectorAll("#year");
  yearEls.forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var navMobile = document.getElementById("navMobile");
  var nav = document.getElementById("nav");

  if (navToggle && navMobile) {
    navToggle.addEventListener("click", function () {
      var isOpen = navMobile.classList.toggle("is-open");
      nav.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    navMobile.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMobile.classList.remove("is-open");
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Navbar glass intensifies on scroll ---------- */
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Hero video: pause for reduced motion / small or slow connections ---------- */
  var heroVideo = document.getElementById("heroVideo");
  if (heroVideo) {
    var heroEl = heroVideo.closest(".hero");
    var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    var saveData = connection && connection.saveData;
    var isNarrow = window.matchMedia("(max-width: 560px)").matches;

    if (reduceMotion || saveData) {
      heroEl.classList.add("hero--static");
      heroVideo.pause();
      heroVideo.removeAttribute("autoplay");
    } else {
      heroVideo.play().catch(function () {
        heroEl.classList.add("hero--static");
      });
      if (isNarrow) {
        heroVideo.setAttribute("preload", "metadata");
      }
    }
  }

  /* ---------- Subtle 3D tilt on service cards (desktop pointer only) ---------- */
  if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".service-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--tilt-y", (px * 6).toFixed(2) + "deg");
        card.style.setProperty("--tilt-x", (py * -6).toFixed(2) + "deg");
      });
      card.addEventListener("mouseleave", function () {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });
  }
})();
