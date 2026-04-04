document.addEventListener("DOMContentLoaded", function () {

  // ── Navbar active toggle ──
  var navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.forEach(function (el) { el.classList.remove("active"); });
      this.classList.add("active");
    });
  });

  // ── Scroll reveal ──
  var reveals = document.querySelectorAll(".reveal");
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  reveals.forEach(function (el) { revealObserver.observe(el); });

  // ── Prepare screenshot tracks (scroll on hover only) ──
  document.querySelectorAll(".screenshot-track").forEach(function (track) {
    var images = track.querySelectorAll("img");
    if (images.length === 0) return;

    var firstImg = images[0];
    function setup() {
      var totalWidth = 0;
      images.forEach(function (img) { totalWidth += img.offsetWidth + 12; });
      var halfWidth = totalWidth / 2;
      if (halfWidth <= 0) return;

      var speed = 60; // px per second
      var duration = halfWidth / speed;
      track.style.setProperty("--scroll-duration", duration + "s");
      track.classList.add("ready");
    }

    if (firstImg.complete) {
      setup();
    } else {
      firstImg.addEventListener("load", setup);
    }
  });

  // ── Screenshot modal ──
  document.querySelectorAll(".project-card[data-images]").forEach(function (card) {
    card.style.cursor = "pointer";
    card.addEventListener("click", function (e) {
      if (e.target.closest(".project-link")) return;

      var images = JSON.parse(this.dataset.images);
      var title = this.dataset.title;
      var icon = this.dataset.icon;

      document.querySelector("#screenshotModal .modal-title").innerHTML =
        '<img src="' + icon + '" alt="icon"> ' + title;

      var gallery = document.getElementById("modalGallery");
      gallery.innerHTML = "";
      images.forEach(function (src) {
        var img = document.createElement("img");
        img.src = src;
        img.alt = title + " screenshot";
        img.loading = "lazy";
        gallery.appendChild(img);
      });

      var modal = new bootstrap.Modal(document.getElementById("screenshotModal"));
      modal.show();
    });
  });

  // ── Smooth scroll for nav links ──
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});
