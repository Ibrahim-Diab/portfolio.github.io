(function () {
  "use strict";

  var STATUS_NOTE = {
    delisted: "No longer on the App Store",
    upcoming: "In development",
    delivered: "Delivered to the client",
  };

  // App Store apps first, then work in progress, then everything else.
  var STATUS_ORDER = { live: 0, upcoming: 1, delivered: 2, delisted: 3 };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };

  function reduceMotion() {
    return !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function byId(id) {
    return PROJECTS.find(function (p) { return p.id === id; });
  }

  function metaLine(project) {
    var count = project.apps.length;
    var apps = count > 1 ? count + " apps" : "iOS app";
    return CATEGORIES[project.category] + " · " + apps;
  }

  function appStatus(project, app) {
    return app.status || project.status;
  }

  function byStatus() {
    return PROJECTS
      .map(function (p, i) { return { p: p, i: i }; })
      .sort(function (a, b) {
        return (STATUS_ORDER[a.p.status] - STATUS_ORDER[b.p.status]) || (a.i - b.i);
      })
      .map(function (x) { return x.p; });
  }

  // Stands in for screenshots (card and sheet) before an app launches.
  function iconPlate(project) {
    return '<span class="icon-plate"><img src="' + esc(project.icon) +
      '" alt="" width="96" height="96" loading="lazy"></span>';
  }

  function storeLabel(project, app) {
    return project.apps.length > 1 ? app.label + " app" : "App Store";
  }

  var SURFACES = {
    dark: "tile--dark on-dark",
    "dark-2": "tile--dark-2 on-dark",
    "dark-3": "tile--dark-3 on-dark",
    parchment: "tile--parchment",
    light: "tile--light",
  };

  // ── Featured tiles ──────────────────────────────────────────────
  function renderFeatured() {
    var host = $("#work");
    var featured = PROJECTS
      .filter(function (p) { return p.featured; })
      .sort(function (a, b) { return a.featured.order - b.featured.order; });

    host.innerHTML = featured.map(function (p, index) {
      var f = p.featured;
      var tileClass = "tile " + (SURFACES[f.surface] || SURFACES.parchment);
      var liveApps = p.apps.filter(function (a) { return a.url; });

      var buttons = liveApps.slice(0, 2).map(function (a, i) {
        var label = liveApps.length > 1 ? a.label + " app" : "View on the App Store";
        return '<a class="btn ' + (i === 0 ? "btn--primary" : "btn--secondary") + '" href="' + esc(a.url) +
          '" target="_blank" rel="noopener">' + esc(label) + "</a>";
      }).join("");
      if (liveApps.length < 2) {
        buttons += '<button class="btn ' + (liveApps.length ? "btn--secondary" : "btn--primary") +
          '" type="button" data-open="' + esc(p.id) + '">See screenshots</button>';
      }
      if (!liveApps.length && STATUS_NOTE[p.status]) {
        buttons += '<span class="t-caption t-muted">' + STATUS_NOTE[p.status] + "</span>";
      }

      var phones = p.apps[0].shots.slice(0, 5).map(function (src, i) {
        return '<button class="phones__item reveal reveal--soft" type="button" style="--anim-delay:' + (i * 0.07).toFixed(2) +
          's" data-open="' + esc(p.id) + '" data-app="0" aria-label="Open ' +
          esc(p.name) + " screenshot " + (i + 1) + '"><img src="' + esc(src) + '" alt="" loading="lazy" width="460" height="996"></button>';
      }).join("");

      var highlights = f.highlights.map(function (h) {
        return '<div><h3 class="t-body-strong">' + esc(h.title) + '</h3><p class="t-body t-muted">' + esc(h.text) + "</p></div>";
      }).join("");

      return (
        '<section class="' + tileClass + ' feature" aria-labelledby="feature-' + esc(p.id) + '"' + (index === 0 ? ' id="work-start"' : "") + ">" +
          '<div class="container">' +
            '<div class="reveal">' +
              '<img class="feature__icon" src="' + esc(p.icon) + '" alt="" width="80" height="80" loading="lazy">' +
              '<span class="eyebrow">' + esc(CATEGORIES[p.category]) + "</span>" +
              '<h2 class="t-display-lg feature__name" id="feature-' + esc(p.id) + '">' + esc(p.name) + "</h2>" +
              '<p class="t-lead">' + esc(f.tagline) + "</p>" +
              '<p class="t-body t-muted feature__summary">' + esc(p.summary) + "</p>" +
              '<div class="btn-row">' + buttons + "</div>" +
            "</div>" +
          "</div>" +
          '<div class="phones" data-parallax="-56">' +
            '<div class="phones__track">' + phones + "</div>" +
          "</div>" +
          '<div class="container">' +
            '<div class="highlights reveal">' + highlights + "</div>" +
          "</div>" +
        "</section>"
      );
    }).join("");

    $("#footer-work").innerHTML = featured.map(function (p) {
      return '<li><a href="#feature-' + esc(p.id) + '">' + esc(p.name) + "</a></li>";
    }).join("") + '<li><a href="#apps">All apps</a></li>';
  }

  // ── Grid + filters ──────────────────────────────────────────────
  // The name is the card's button, and its ::before stretches over the whole
  // card, so a click anywhere (thumbnails included) opens the sheet.
  function renderGrid() {
    $("#app-grid").innerHTML = byStatus().map(function (p, index) {
      var shotsApp = p.apps.find(function (a) { return a.shots.length; });
      var media = shotsApp
        ? shotsApp.shots.slice(0, 3).map(function (src) {
            return '<img src="' + esc(src) + '" alt="" loading="lazy" width="460" height="996">';
          }).join("")
        : iconPlate(p);

      var links = p.apps.filter(function (a) { return a.url; }).map(function (a) {
        return '<a class="link link--external" href="' + esc(a.url) + '" target="_blank" rel="noopener">' +
          esc(storeLabel(p, a)) + "</a>";
      }).join("");

      var status = STATUS_NOTE[p.status]
        ? '<p class="t-caption t-muted app-card__status">' + STATUS_NOTE[p.status] + "</p>"
        : "";

      return (
        '<article class="app-card reveal reveal--soft" data-category="' + esc(p.category) +
          '" style="--anim-delay:' + ((index % 4) * 0.06).toFixed(2) + 's">' +
          '<div class="app-card__media' + (shotsApp ? "" : " app-card__media--plate") + '" aria-hidden="true">' + media + "</div>" +
          '<div class="app-card__head">' +
            '<img class="app-card__icon" src="' + esc(p.icon) + '" alt="" width="56" height="56" loading="lazy">' +
            "<div>" +
              '<h3 class="t-body-strong"><button class="app-card__open" type="button" data-open="' + esc(p.id) + '">' +
                esc(p.name) + "</button></h3>" +
              '<p class="t-caption t-muted">' + esc(metaLine(p)) + "</p>" +
            "</div>" +
          "</div>" +
          '<p class="t-caption app-card__summary">' + esc(p.summary) + "</p>" +
          status +
          (links ? '<div class="app-card__links">' + links + "</div>" : "") +
        "</article>"
      );
    }).join("");
  }

  function renderFilters() {
    var host = $("#filters");
    var keys = ["all"].concat(Object.keys(CATEGORIES));

    host.innerHTML = keys.map(function (key) {
      var count = key === "all"
        ? PROJECTS.length
        : PROJECTS.filter(function (p) { return p.category === key; }).length;
      var label = key === "all" ? "All" : CATEGORIES[key];
      return '<button class="chip" type="button" data-filter="' + key + '" aria-pressed="' + (key === "all") + '">' +
        esc(label) + '<span class="chip__count">' + count + "</span></button>";
    }).join("");

    host.addEventListener("click", function (e) {
      var chip = e.target.closest("[data-filter]");
      if (!chip) return;
      var key = chip.dataset.filter;
      host.querySelectorAll("[data-filter]").forEach(function (el) {
        el.setAttribute("aria-pressed", String(el === chip));
      });
      var shown = [];
      document.querySelectorAll(".app-card").forEach(function (card) {
        card.hidden = key !== "all" && card.dataset.category !== key;
        if (!card.hidden) shown.push(card);
      });
      shown.forEach(function (card, i) {
        card.style.setProperty("--anim-delay", ((i % 8) * 0.04).toFixed(2) + "s");
      });
      replay(shown);
    });
  }

  function renderCounts() {
    // Shipped = reached users: live, once live (delisted) or handed over.
    var shipped = PROJECTS.reduce(function (sum, p) {
      return sum + p.apps.filter(function (a) { return appStatus(p, a) !== "upcoming"; }).length;
    }, 0);
    $("#stat-shipped").textContent = shipped;
    $("#apps-subtitle").textContent =
      shipped + " apps shipped across " + PROJECTS.length + " products, including client, captain and provider apps, live App Store apps first. Open any card to see its screenshots.";
  }

  // ── Project sheet ───────────────────────────────────────────────
  var sheet = $("#sheet");
  var track = $("#sheet-track");
  var current = null;

  function showApp(index) {
    var app = current.apps[index];

    $("#sheet-tabs").querySelectorAll("[data-app-tab]").forEach(function (el) {
      el.setAttribute("aria-pressed", String(Number(el.dataset.appTab) === index));
    });

    var status = appStatus(current, app);
    track.innerHTML = app.shots.length
      ? app.shots.map(function (src, i) {
          return '<img src="' + esc(src) + '" alt="' + esc(current.name + " " + app.label + " screenshot " + (i + 1)) +
            '" loading="lazy" width="460" height="996" style="--anim-delay:' + (i * 0.05).toFixed(2) + 's">';
        }).join("")
      : '<div class="sheet__empty">' + iconPlate(current) +
          '<p class="t-caption t-muted">' + (status === "upcoming"
            ? "Screenshots will be added when this app launches."
            : "Screenshots aren't public for this app.") + "</p></div>";
    track.scrollLeft = 0;
    // Let the initial state paint, then stagger the screenshots in.
    requestAnimationFrame(function () {
      track.querySelectorAll("img").forEach(function (img) { img.classList.add("is-in"); });
    });

    var actions = $("#sheet-actions");
    if (app.url) {
      actions.innerHTML = '<a class="btn btn--primary" href="' + esc(app.url) + '" target="_blank" rel="noopener">' +
        (current.apps.length > 1 ? "Get the " + esc(app.label) + " app" : "View on the App Store") + "</a>";
    } else {
      actions.innerHTML = '<p class="t-caption t-muted">' + esc(STATUS_NOTE[status] || "") + "</p>";
    }
    updateControls();
  }

  function openSheet(id, appIndex) {
    current = byId(id);
    if (!current) return;

    $("#sheet-icon").src = current.icon;
    $("#sheet-title").textContent = current.name;
    $("#sheet-meta").textContent = metaLine(current);
    $("#sheet-summary").textContent = current.summary;

    var tabs = $("#sheet-tabs");
    tabs.hidden = current.apps.length < 2;
    tabs.innerHTML = current.apps.map(function (a, i) {
      return '<button class="chip" type="button" data-app-tab="' + i + '" aria-pressed="false">' + esc(a.label) + "</button>";
    }).join("");

    showApp(appIndex || 0);
    if (!sheet.open) {
      sheet.showModal();
      requestAnimationFrame(function () { sheet.classList.add("is-open"); });
    }
  }

  // Plays the close transition before the dialog actually closes.
  function closeSheet() {
    if (!sheet.open) return;
    if (reduceMotion()) { sheet.close(); return; }
    sheet.classList.remove("is-open");
    var done = false;
    var finish = function () {
      if (done) return;
      done = true;
      sheet.close();
    };
    sheet.addEventListener("transitionend", finish, { once: true });
    setTimeout(finish, 320);
  }

  function updateControls() {
    var max = track.scrollWidth - track.clientWidth - 1;
    $("#sheet-prev").disabled = track.scrollLeft <= 0;
    $("#sheet-next").disabled = track.scrollLeft >= max;
  }

  function page(direction) {
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  }

  function initSheet() {
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-open]");
      if (trigger) openSheet(trigger.dataset.open, Number(trigger.dataset.app || 0));
    });

    $("#sheet-tabs").addEventListener("click", function (e) {
      var tab = e.target.closest("[data-app-tab]");
      if (tab) showApp(Number(tab.dataset.appTab));
    });

    sheet.addEventListener("click", function (e) {
      if (e.target === sheet || e.target.closest("[data-close]")) closeSheet();
    });

    // Escape: run the close transition instead of the instant native close.
    sheet.addEventListener("cancel", function (e) {
      e.preventDefault();
      closeSheet();
    });
    sheet.addEventListener("close", function () { sheet.classList.remove("is-open"); });

    $("#sheet-prev").addEventListener("click", function () { page(-1); });
    $("#sheet-next").addEventListener("click", function () { page(1); });
    track.addEventListener("scroll", updateControls, { passive: true });
    track.addEventListener("load", updateControls, true);
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); page(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); page(-1); }
    });
  }

  // ── Navigation ──────────────────────────────────────────────────
  function initNav() {
    var nav = $("#nav");
    var toggle = $(".nav__toggle", nav);

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    }

    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });
    $("#nav-links").addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  // ── Motion ──────────────────────────────────────────────────────
  // Entrance states live in CSS; this only decides when to release them,
  // and drives the scroll-linked effects (drift, progress, back-to-top).
  var revealObserver = null;

  function reveal(elements) {
    if (!elements.length) return;
    if (reduceMotion() || !("IntersectionObserver" in window)) {
      elements.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.05, rootMargin: "0px 0px -40px 0px" });
    }
    elements.forEach(function (el) { revealObserver.observe(el); });
  }

  function replay(elements) {
    if (reduceMotion()) return;
    elements.forEach(function (el) { el.classList.remove("is-visible"); });
    void document.body.offsetHeight; // flush the reset before re-adding
    requestAnimationFrame(function () {
      elements.forEach(function (el) { el.classList.add("is-visible"); });
    });
  }

  function initHero() {
    var items = [].slice.call(document.querySelectorAll(".hero__copy > *"));
    items.forEach(function (el, i) { el.style.setProperty("--anim-delay", (i * 0.08).toFixed(2) + "s"); });
    // Two frames: the first paints the start state, the second releases it,
    // otherwise the browser has nothing to transition from.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { document.body.classList.add("is-loaded"); });
    });
  }

  // Counts the stat numbers up once they scroll into view.
  function initCounters() {
    var stats = [].slice.call(document.querySelectorAll(".stat__value"));
    stats.forEach(function (el) {
      var match = el.textContent.match(/^(\d+)(\D*)$/);
      if (!match) return;
      var target = Number(match[1]);
      var suffix = match[2] || "";
      if (reduceMotion() || !("IntersectionObserver" in window)) return;

      var started = false;
      var observer = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting || started) return;
        started = true;
        observer.disconnect();
        var start = performance.now();
        var step = function (now) {
          var t = Math.min((now - start) / 900, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (t < 1) requestAnimationFrame(step);
        };
        el.textContent = "0" + suffix;
        requestAnimationFrame(step);
      }, { threshold: 0.6 });
      observer.observe(el);
    });
  }

  // ── Scroll loop ─────────────────────────────────────────────────
  // One passive listener and one rAF pass per frame; every scroll-linked
  // effect registers a task here instead of adding its own listener.
  var scrollTasks = [];

  function initScrollLoop() {
    if (!scrollTasks.length) return;
    var queued = false;
    function run() {
      queued = false;
      var state = { y: window.scrollY, viewport: window.innerHeight };
      scrollTasks.forEach(function (task) { task(state); });
    }
    function schedule() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(run);
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    run();
  }

  // Drift: writes --parallax; CSS applies translate3d.
  function initParallax() {
    if (reduceMotion()) return;
    var targets = [].slice.call(document.querySelectorAll("[data-parallax]"));
    if (!targets.length) return;
    scrollTasks.push(function (state) {
      targets.forEach(function (el) {
        var box = el.getBoundingClientRect();
        if (box.bottom < -200 || box.top > state.viewport + 200) return;
        var amount = Number(el.dataset.parallax || 46);
        // -1 above the viewport centre, +1 below it.
        var progress = (box.top + box.height / 2 - state.viewport / 2) / state.viewport;
        el.style.setProperty("--parallax", (progress * amount).toFixed(1) + "px");
      });
    });
  }

  // Reading progress under the nav, and the back-to-top button.
  function initScrollChrome() {
    var bar = $("#nav-progress");
    var toTop = $("#to-top");
    var root = document.documentElement;
    scrollTasks.push(function (state) {
      var max = root.scrollHeight - state.viewport;
      if (bar) bar.style.setProperty("--progress", max > 0 ? Math.min(state.y / max, 1).toFixed(4) : "0");
      if (!toTop) return;
      var show = state.y > state.viewport * 0.9;
      if (show === toTop.classList.contains("is-shown")) return;
      toTop.classList.toggle("is-shown", show);
      toTop.setAttribute("aria-hidden", String(!show));
      toTop.tabIndex = show ? 0 : -1;
    });
  }

  // Lights up the nav link for the section crossing the middle of the screen.
  function initActiveNav() {
    if (!("IntersectionObserver" in window)) return;
    var links = {};
    [].slice.call(document.querySelectorAll('#nav-links a[href^="#"]')).forEach(function (a) {
      links[a.getAttribute("href").slice(1)] = a;
    });
    var sections = Object.keys(links).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var current = null;
    function setActive(id) {
      if (id === current) return;
      if (current && links[current]) {
        links[current].classList.remove("is-active");
        links[current].removeAttribute("aria-current");
      }
      current = id;
      if (id && links[id]) {
        links[id].classList.add("is-active");
        links[id].setAttribute("aria-current", "location");
      }
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
        else if (entry.target.id === current) setActive(null);
      });
    }, { rootMargin: "-45% 0px -54% 0px" });
    sections.forEach(function (el) { observer.observe(el); });
  }

  // Types the hero eyebrow through a list of roles. The static first role
  // stays in the markup, so no-JS and reduced-motion visitors still read it.
  function initTyping() {
    var el = $("[data-roles]");
    if (!el || reduceMotion()) return;
    var roles = el.dataset.roles.split("|");
    var text = $(".typing__text", el);
    var word = 0;
    var chars = roles[0].length;
    var deleting = true;
    var visible = true;
    var timer = null;

    // A single pending timer, so pausing and resuming never runs two loops.
    function schedule(delay) {
      clearTimeout(timer);
      timer = setTimeout(tick, delay);
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        var was = visible;
        visible = entries[0].isIntersecting;
        if (visible && !was) schedule(400);
      }).observe(el);
    }

    function tick() {
      if (!visible || document.hidden) return;
      var role = roles[word];
      var delay;
      if (deleting) {
        chars -= 1;
        delay = 38;
        if (chars <= 0) { deleting = false; word = (word + 1) % roles.length; delay = 380; }
      } else {
        chars += 1;
        delay = 74;
        if (chars >= roles[word].length) { deleting = true; delay = 2200; }
      }
      text.textContent = roles[word].slice(0, Math.max(chars, 0));
      el.classList.toggle("is-typing", delay < 380);
      schedule(delay);
    }
    document.addEventListener("visibilitychange", function () { if (!document.hidden) schedule(400); });
    // Let the hero entrance settle and the first role be read before typing.
    schedule(2600);
  }

  // Cards lean toward a mouse pointer, with a soft light under it.
  // Touch is left alone so it never fights scrolling.
  function initTilt() {
    if (reduceMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var MAX = 5;
    var active = null;
    var timer = null;

    function reset(card) {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
      card.classList.remove("is-lit");
      clearTimeout(timer);
      timer = setTimeout(function () { card.classList.remove("is-tilting"); }, 360);
    }

    document.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      var card = e.target.closest(".app-card.is-visible");
      if (active && active !== card) reset(active);
      active = card;
      if (!card) return;
      clearTimeout(timer);
      var box = card.getBoundingClientRect();
      var x = (e.clientX - box.left) / box.width;
      var y = (e.clientY - box.top) / box.height;
      card.classList.add("is-tilting", "is-lit");
      card.style.setProperty("--tilt-x", ((0.5 - y) * MAX).toFixed(2) + "deg");
      card.style.setProperty("--tilt-y", ((x - 0.5) * MAX).toFixed(2) + "deg");
      card.style.setProperty("--glow-x", (x * 100).toFixed(1) + "%");
      card.style.setProperty("--glow-y", (y * 100).toFixed(1) + "%");
    }, { passive: true });
    document.documentElement.addEventListener("pointerleave", function () {
      if (active) reset(active);
      active = null;
    });
  }

  // Section heads cascade: each child gets its own step in the stagger.
  function initCascade() {
    document.querySelectorAll(".reveal--cascade").forEach(function (group) {
      [].slice.call(group.children).forEach(function (child, i) {
        child.style.setProperty("--cascade-i", i);
      });
    });
  }

  function initNavMotion() {
    document.querySelectorAll("#nav-links li").forEach(function (el, i) {
      el.style.setProperty("--anim-delay", (i * 0.04).toFixed(2) + "s");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderFeatured();
    renderFilters();
    renderGrid();
    renderCounts();
    initSheet();
    initNav();
    initHero();
    initNavMotion();
    initCounters();
    initCascade();
    reveal([].slice.call(document.querySelectorAll(".reveal")));
    initActiveNav();
    initTyping();
    initTilt();
    initParallax();
    initScrollChrome();
    initScrollLoop();
    $("#year").textContent = new Date().getFullYear();
  });
})();
