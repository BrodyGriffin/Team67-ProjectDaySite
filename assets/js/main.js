/* TraceStock Projects Day — page behaviour (no framework). */
(function () {
  "use strict";

  var config = window.TRACESTOCK_CONFIG || { team: [], contact: {} };
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var ICONS = {
    linkedin:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
    github:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3"/></svg>',
  };

  function el(tag, attrs, html) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] !== undefined && attrs[k] !== null) node.setAttribute(k, attrs[k]);
      });
    }
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function initials(name) {
    return String(name || "?")
      .split(/\s+/)
      .filter(Boolean)
      .map(function (part) { return part.charAt(0).toUpperCase(); })
      .slice(0, 2)
      .join("");
  }

  function firstName(name) {
    return String(name || "").split(/\s+/)[0] || "";
  }

  function isSafeHttpUrl(url) {
    return /^https:\/\/[^\s"'<>]+$/i.test(url || "");
  }

  function isEmail(value) {
    return /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(value || "");
  }

  function socialLink(kind, value, member) {
    var labelName = escapeHtml(firstName(member.name));
    if (kind === "linkedin") {
      if (isSafeHttpUrl(value)) {
        return '<a class="ts-social ts-social-linkedin" href="' + escapeHtml(value) + '" target="_blank" rel="noopener" aria-label="' + labelName + ' on LinkedIn">' + ICONS.linkedin + "LinkedIn</a>";
      }
      return '<span class="ts-social is-pending" title="LinkedIn link coming soon">' + ICONS.linkedin + "LinkedIn soon</span>";
    }
    if (kind === "email") {
      if (isEmail(value)) {
        return '<a class="ts-social ts-social-email" href="mailto:' + escapeHtml(value) + '" aria-label="Email ' + labelName + '"><span class="material-symbols-rounded" aria-hidden="true">mail</span>Email</a>';
      }
      return '<span class="ts-social is-pending" title="Email address coming soon"><span class="material-symbols-rounded" aria-hidden="true">mail</span>Email soon</span>';
    }
    if (kind === "github" && isSafeHttpUrl(value)) {
      return '<a class="ts-social ts-social-github" href="' + escapeHtml(value) + '" target="_blank" rel="noopener" aria-label="' + labelName + ' on GitHub">' + ICONS.github + "GitHub</a>";
    }
    return "";
  }

  /* ---------- Team ---------- */
  function renderTeam() {
    var grid = document.getElementById("team-grid");
    if (!grid) return;
    grid.innerHTML = "";
    (config.team || []).forEach(function (member, i) {
      var col = el("div", { class: "col-sm-6 col-lg-3 ts-team-card ts-reveal", "data-delay": String(i % 4) });
      var avatar = member.photo
        ? '<img src="' + escapeHtml(member.photo) + '" alt="Portrait of ' + escapeHtml(member.name) + '" loading="lazy" width="112" height="112">'
        : '<span aria-hidden="true">' + escapeHtml(initials(member.name)) + "</span>";
      col.innerHTML =
        '<article class="ts-card ts-card-floating h-100">' +
        '<div class="ts-card-body">' +
        '<div class="ts-avatar">' + avatar + "</div>" +
        "<h3>" + escapeHtml(member.name) + "</h3>" +
        '<p class="ts-team-meta mb-0">' + escapeHtml(config.degree || "") + "<br>" + escapeHtml(config.university || "") + "</p>" +
        '<p class="ts-team-meta mb-0 mt-1"><span class="ts-badge ts-badge-info">Student ' + escapeHtml(member.studentNumber) + "</span></p>" +
        '<div class="ts-team-links">' +
        socialLink("linkedin", member.linkedin, member) +
        socialLink("email", member.email, member) +
        socialLink("github", member.githubProfile, member) +
        "</div></div></article>";
      grid.appendChild(col);
    });
  }

  /* ---------- Contact ---------- */
  function renderContact() {
    var list = document.getElementById("contact-linkedin");
    if (list) {
      list.innerHTML = "";
      (config.team || []).forEach(function (member) {
        var row = el("div", { class: "ts-contact-row" });
        var link = isSafeHttpUrl(member.linkedin)
          ? '<a class="ts-social ts-social-linkedin" href="' + escapeHtml(member.linkedin) + '" target="_blank" rel="noopener" aria-label="' + escapeHtml(member.name) + ' on LinkedIn">' + ICONS.linkedin + "Connect</a>"
          : '<span class="ts-pending-text">Link coming soon</span>';
        row.innerHTML = "<span>" + escapeHtml(member.name) + "</span>" + link;
        list.appendChild(row);
      });
    }

    var contact = config.contact || {};
    var emailSlot = document.getElementById("contact-email");
    if (emailSlot) {
      emailSlot.innerHTML = isEmail(contact.teamEmail)
        ? '<a class="btn btn-ts-white btn-lg mb-0" href="mailto:' + escapeHtml(contact.teamEmail) + '"><span class="material-symbols-rounded me-1" aria-hidden="true">mail</span>' + escapeHtml(contact.teamEmail) + "</a>"
        : '<span class="ts-pending-text">Team email coming soon</span>';
    }
    var standSlot = document.getElementById("contact-stand");
    if (standSlot) {
      standSlot.textContent = contact.projectsDayStand || "Stand details coming soon";
      if (!contact.projectsDayStand) standSlot.classList.add("ts-pending-text");
    }
  }

  /* ---------- Navbar ---------- */
  function initNavbar() {
    var wrap = document.querySelector(".ts-navbar-wrap");
    var backTop = document.querySelector(".ts-back-top");
    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      if (wrap) wrap.classList.toggle("is-scrolled", y > 24);
      if (backTop) backTop.classList.toggle("is-visible", y > 900);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (backTop) {
      backTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      });
    }

    // Collapse the mobile menu after choosing a section.
    var collapseEl = document.getElementById("ts-nav");
    document.querySelectorAll("#ts-nav .nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        if (collapseEl && collapseEl.classList.contains("show") && window.bootstrap) {
          window.bootstrap.Collapse.getOrCreateInstance(collapseEl).hide();
        }
      });
    });
  }

  /* ---------- Scroll spy ---------- */
  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll("#ts-nav .nav-link[href^='#']"));
    if (!("IntersectionObserver" in window) || !links.length) return;
    var byId = {};
    links.forEach(function (link) { byId[link.getAttribute("href").slice(1)] = link; });
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (l) { l.classList.remove("active"); l.removeAttribute("aria-current"); });
          var active = byId[entry.target.id];
          if (active) { active.classList.add("active"); active.setAttribute("aria-current", "true"); }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  /* ---------- Count-up stats ---------- */
  function initCounters() {
    var counters = document.querySelectorAll("[data-count]");
    function finish(node) {
      node.textContent = node.getAttribute("data-prefix") + Number(node.getAttribute("data-count")).toLocaleString("en-US") + node.getAttribute("data-suffix");
    }
    counters.forEach(function (node) {
      if (!node.hasAttribute("data-prefix")) node.setAttribute("data-prefix", "");
      if (!node.hasAttribute("data-suffix")) node.setAttribute("data-suffix", "");
    });
    if (reduceMotion || !("IntersectionObserver" in window)) {
      counters.forEach(finish);
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          var node = entry.target;
          var target = Number(node.getAttribute("data-count"));
          var start = null;
          var duration = 1400;
          function step(ts) {
            if (start === null) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            node.textContent = node.getAttribute("data-prefix") + Math.round(target * eased).toLocaleString("en-US") + node.getAttribute("data-suffix");
            if (progress < 1) window.requestAnimationFrame(step);
          }
          window.requestAnimationFrame(step);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (node) { observer.observe(node); });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var nodes = document.querySelectorAll(".ts-reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      nodes.forEach(function (n) { n.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.01 }
    );
    nodes.forEach(function (n) { observer.observe(n); });
  }

  /* ---------- Screenshots: show the image only if it exists ---------- */
  function initScreenshots() {
    var shots = document.querySelectorAll(".ts-shot[data-src]");

    // Note: no loading="lazy" here. Chrome never fetches a lazy image that is not
    // attached to the document, so onload would never fire. Deferral is handled by
    // the IntersectionObserver below instead.
    function load(shot) {
      var img = new Image();
      img.alt = shot.getAttribute("data-alt") || "";
      img.decoding = "async";
      img.onload = function () {
        shot.insertBefore(img, shot.firstChild);
        shot.classList.add("has-image");
      };
      img.src = shot.getAttribute("data-src");
    }

    if (!("IntersectionObserver" in window)) {
      shots.forEach(load);
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          load(entry.target);
        });
      },
      { rootMargin: "600px 0px" }
    );
    shots.forEach(function (shot) { observer.observe(shot); });
  }

  function initYear() {
    var year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderTeam();
    renderContact();
    initNavbar();
    initScrollSpy();
    initCounters();
    initReveal();
    initScreenshots();
    initYear();
  });
})();
