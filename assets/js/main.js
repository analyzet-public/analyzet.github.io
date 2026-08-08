(function () {
  "use strict";

  var KEY = "analyzet-theme";
  var root = document.documentElement;

  function currentTimeTheme() {
    var hour = new Date().getHours();
    return (hour >= 19 || hour < 7) ? "dark" : "light";
  }

  function safeGetItem(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSetItem(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable (e.g. private mode) */ }
  }

  function applyTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    if (persist) safeSetItem(KEY, theme);
    document.querySelectorAll("[data-logo]").forEach(function (img) {
      img.src = img.getAttribute(theme === "dark" ? "data-src-dark" : "data-src-light");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    // sync logo swap + toggle icon state with whatever theme-init.js already set
    applyTheme(root.getAttribute("data-theme") || currentTimeTheme(), false);

    var toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next, true);
      });
    }

    // if the visitor never manually overrides, keep drifting with real time
    setInterval(function () {
      if (!safeGetItem(KEY)) applyTheme(currentTimeTheme(), false);
    }, 5 * 60 * 1000);

    // header scroll state
    var header = document.querySelector(".site-header");
    if (header) {
      var onScroll = function () {
        header.classList.toggle("scrolled", window.scrollY > 8);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // mobile nav toggle
    var navToggle = document.querySelector(".nav-toggle");
    var navLinks = document.querySelector(".nav-links");
    if (navToggle && navLinks) {
      navToggle.addEventListener("click", function () {
        navLinks.classList.toggle("open");
      });
      navLinks.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { navLinks.classList.remove("open"); });
      });
    }

    // scroll-reveal
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("visible"); });
    }

    // current year in footer
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    // mark active nav link
    var path = window.location.pathname.replace(/\/index\.html$/, "/");
    document.querySelectorAll(".nav-links a[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") && path.indexOf(a.getAttribute("data-nav")) !== -1) {
        a.classList.add("active");
      }
    });

    // back-to-top button (created once, works on every page automatically)
    var backToTop = document.createElement("button");
    backToTop.type = "button";
    backToTop.className = "back-to-top";
    backToTop.setAttribute("aria-label", "Back to top");
    backToTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(backToTop);
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    var toggleBackToTop = function () {
      backToTop.classList.toggle("visible", window.scrollY > 560);
    };
    toggleBackToTop();
    window.addEventListener("scroll", toggleBackToTop, { passive: true });
  });
})();
