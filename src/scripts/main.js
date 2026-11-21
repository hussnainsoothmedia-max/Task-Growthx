import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

import "./nav.js";

  (function () {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var shell = document.querySelector(".nav-shell");

    // In-page links: scroll with JS so Home always returns to the top and the sticky nav never covers a heading
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a || a.hasAttribute("data-placeholder")) return;
      var id = a.getAttribute("href").slice(1);
      if (id === "main") return;
      var toTop = id === "hero" || id === "top" || id === "";
      var target = toTop ? null : document.getElementById(id);
      if (!toTop && !target) return;
      e.preventDefault();
      var y = target
        ? target.getBoundingClientRect().top +
          window.scrollY -
          shell.offsetHeight +
          1
        : 0;
      window.scrollTo({
        top: Math.max(0, y),
        behavior: reduce ? "auto" : "smooth",
      });
    });

    // Placeholder social links do nothing until real URLs are added
    document.querySelectorAll("[data-placeholder]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
      });
    });

    if ("IntersectionObserver" in window) {
      // Active nav link
      var links = document.querySelectorAll(".nav-links a[data-sec]");
      var map = {
        hero: "hero",
        trust: "hero",
        services: "services",
        work: "services",
        process: "process",
        about: "about",
        faq: "about",
        contact: "contact",
      };
      var io3 = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            var key = map[en.target.id];
            if (!key) return;
            links.forEach(function (a) {
              if (a.dataset.sec === key) a.setAttribute("aria-current", "true");
              else a.removeAttribute("aria-current");
            });
          });
        },
        { rootMargin: "-45% 0px -50% 0px" },
      );
      document.querySelectorAll("main section[id]").forEach(function (s) {
        io3.observe(s);
      });
    }

    // ---------- GSAP motion ----------
    if (window.gsap && window.ScrollTrigger && !reduce) {
      gsap.registerPlugin(ScrollTrigger);
      document.documentElement.classList.add("gsap-on");
      var ease = "power3.out";

      function splitWords(el) {
        if (!el) return [];
        var text = el.textContent.trim().replace(/\s+/g, " ");
        el.setAttribute("aria-label", text);
        el.innerHTML = text
          .split(" ")
          .map(function (w) {
            return (
              '<span class="w" aria-hidden="true"><span class="wi">' +
              w +
              "</span></span>"
            );
          })
          .join(" ");
        return el.querySelectorAll(".wi");
      }

      // Hero intro timeline
      var heroWords = splitWords(document.getElementById("hero-h"));
      var tl = gsap.timeline({ defaults: { ease: ease } });
      // Safety net: if the browser pauses animation frames (background tab, throttled frame),
      // jump the intro to its finished state so nothing in the hero stays hidden.
      setTimeout(function () {
        if (tl.progress() < 1) tl.progress(1);
      }, 3500);
      tl.from(".hero .eyebrow", { y: 12, autoAlpha: 0, duration: 0.5 })
        .from(
          heroWords,
          { yPercent: 115, duration: 0.9, stagger: 0.045 },
          "-=.25",
        )
        .from(
          ".hero-copy .body-lg",
          { y: 18, autoAlpha: 0, duration: 0.7 },
          "-=.6",
        )
        // CTAs never go invisible: they only lift into place, so they can't get stuck hidden
        .from(
          ".hero .cta-row .btn",
          {
            y: 18,
            duration: 0.6,
            stagger: 0.08,
            ease: "back.out(1.8)",
            clearProps: "transform",
          },
          "-=.45",
        )
        .from(
          ".hero-visual",
          { y: 48, autoAlpha: 0, scale: 0.97, duration: 1.1 },
          0.25,
        )
        .from(
          ".facts > div",
          { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.08 },
          1,
        );

      // Gentle parallax on the hero mockup
      gsap.to(".hero-visual .hv", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      // One-time reveals stay "active" from their start to the bottom of the page, so a page
      // that loads already scrolled past them still plays them instead of leaving them hidden.
      var toBottom = function () {
        return ScrollTrigger.maxScroll(window) + 1;
      };
      var once = function (trigger, start) {
        return { trigger: trigger, start: start || "top 85%", end: toBottom, once: true };
      };
      // Multi-step timelines are built paused and started by their own trigger, so a trigger
      // that fires instantly (page reloaded mid-scroll) can't interrupt the timeline being built.
      var playOnce = function (tl, trigger, start) {
        ScrollTrigger.create({
          trigger: trigger,
          start: start || "top 85%",
          end: toBottom,
          once: true,
          onEnter: function () {
            tl.play();
          },
        });
      };
      var fade = function (sel, trig, vars) {
        var els = gsap.utils.toArray(sel);
        if (!els.length) return;
        gsap.from(
          els,
          Object.assign(
            {
              y: 16,
              autoAlpha: 0,
              duration: 0.7,
              ease: ease,
              stagger: 0.08,
              scrollTrigger: once(trig || els[0], "top 90%"),
            },
            vars || {},
          ),
        );
      };

      // Eyebrows slide in from the left everywhere (one small shared cue)
      gsap.utils
        .toArray("main section:not(.hero) .eyebrow")
        .forEach(function (e) {
          gsap.from(e, {
            x: -18,
            autoAlpha: 0,
            duration: 0.6,
            ease: ease,
            scrollTrigger: once(e, "top 92%"),
          });
        });
      fade(".section-head > p");

      // TRUST: tool chips pop in, scattered, in random order
      gsap.from(".tools li", {
        scale: 0.4,
        rotation: function () {
          return gsap.utils.random(-14, 14);
        },
        autoAlpha: 0,
        duration: 0.7,
        ease: "back.out(2)",
        stagger: { each: 0.05, from: "random" },
        scrollTrigger: once(".tools", "top 92%"),
      });
      gsap.from(".industries > *", {
        x: -10,
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: ease,
        scrollTrigger: once(".industries", "top 96%"),
      });

      // PROBLEM: heading words come into focus; the problem cards drop in like
      // incoming alerts, slightly tilted, then settle
      gsap.from(splitWords(document.getElementById("problem-h")), {
        filter: "blur(10px)",
        autoAlpha: 0,
        duration: 0.9,
        ease: "power2.out",
        stagger: 0.07,
        scrollTrigger: once("#problem-h", "top 86%"),
      });
      fade(".problem-head > p, .problem-close");
      gsap.from(".pcard", {
        y: -40,
        rotation: function (i) {
          return [-3, 2, -2, 3][i % 4];
        },
        autoAlpha: 0,
        duration: 0.8,
        ease: "back.out(1.6)",
        stagger: 0.14,
        scrollTrigger: once(".problem-cards", "top 82%"),
      });

      // SERVICES: heading words rise from a mask; each row wipes open left to right,
      // its number counts up and the preview panel opens from the right
      gsap.from(splitWords(document.getElementById("svc-h")), {
        yPercent: 115,
        duration: 0.9,
        ease: ease,
        stagger: 0.05,
        scrollTrigger: once("#svc-h", "top 86%"),
      });
      gsap.utils.toArray(".svc").forEach(function (row, i) {
        var numEl = row.querySelector(".svc-num"),
          counter = { v: 0 };
        var tl = gsap.timeline({ defaults: { ease: ease }, paused: true });
        playOnce(tl, row, "top 84%");
        tl.fromTo(
          row,
          { clipPath: "inset(0% 100% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.1,
            ease: "power3.inOut",
          },
        )
          .to(
            counter,
            {
              v: i + 1,
              duration: 0.6,
              ease: "none",
              onUpdate: function () {
                numEl.textContent = "0" + Math.round(counter.v);
              },
            },
            0.25,
          )
          .from(
            row.querySelector("h3"),
            { y: 24, autoAlpha: 0, duration: 0.8, clearProps: "transform" },
            0.3,
          )
          .from(
            row.querySelectorAll(".svc-body > p, .svc-body details"),
            { y: 14, autoAlpha: 0, duration: 0.6, stagger: 0.08 },
            0.45,
          )
          .fromTo(
            row.querySelector(".svc-visual"),
            { clipPath: "inset(0% 0% 0% 100% round 16px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 16px)",
              duration: 1,
              ease: "power3.inOut",
            },
            0.25,
          )
          .from(
            row.querySelectorAll(
              ".svc-visual .node, .svc-visual .chip, .svc-visual .arrow, .svc-visual .prompt, .svc-visual .hub-lines, .svc-visual .mini-cap",
            ),
            {
              autoAlpha: 0,
              y: 12,
              duration: 0.45,
              stagger: 0.06,
              ease: "back.out(1.5)",
            },
            0.75,
          );
      });

      // WORK: heading is wiped on like ink; the wide card opens from the bottom,
      // the two smaller cards swing in from either side as you scroll
      gsap.fromTo(
        "#work-h",
        { clipPath: "inset(-10% 100% -25% 0%)" },
        {
          clipPath: "inset(-10% 0% -25% 0%)",
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: once("#work-h", "top 86%"),
        },
      );
      var wide = document.querySelector(".project--wide");
      var wideTl = gsap.timeline({ defaults: { ease: ease }, paused: true });
      playOnce(wideTl, wide, "top 85%");
      wideTl
        .fromTo(
          wide,
          { clipPath: "inset(100% 0% 0% 0% round 16px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 16px)",
            duration: 1.1,
            ease: "power3.inOut",
          },
        )
        .from(
          wide.querySelectorAll(".copy > *"),
          { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.08 },
          0.45,
        )
        .from(
          wide.querySelectorAll(".project-shot img"),
          { scale: 1.08, autoAlpha: 0, duration: 0.9 },
          0.55,
        );
      gsap.utils
        .toArray(".project:not(.project--wide)")
        .forEach(function (card, i) {
          var dir = i % 2 ? 1 : -1;
          gsap.fromTo(
            card,
            { x: 70 * dir, rotation: 3 * dir, autoAlpha: 0.2 },
            {
              x: 0,
              rotation: 0,
              autoAlpha: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top 98%",
                end: "top 55%",
                scrub: 0.7,
              },
            },
          );
          gsap.from(card.querySelectorAll(".project-shot img"), {
            scale: 1.08,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: once(card, "top 80%"),
          });
        });
      fade(".demo-note");

      // WHY: the band opens from a rounded card; the heading lights up word by word
      // with your scroll, and each principle brightens as it reaches the middle
      gsap.fromTo(
        "#why",
        { clipPath: "inset(4% 3% 0% 3% round 24px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: "none",
          scrollTrigger: {
            trigger: "#why",
            start: "top 95%",
            end: "top 25%",
            scrub: 0.5,
          },
        },
      );
      gsap.fromTo(
        splitWords(document.getElementById("why-h")),
        { autoAlpha: 0.12 },
        {
          autoAlpha: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: "#why-h",
            start: "top 80%",
            end: "bottom 40%",
            scrub: 0.5,
          },
        },
      );
      fade(".why-head > p", ".why-head > p", { y: 0, duration: 1 });
      gsap.utils.toArray(".why-list li").forEach(function (li) {
        gsap.fromTo(
          li,
          { autoAlpha: 0.15, x: 40 },
          {
            autoAlpha: 1,
            x: 0,
            ease: "none",
            scrollTrigger: {
              trigger: li,
              start: "top 88%",
              end: "top 55%",
              scrub: 0.5,
            },
          },
        );
      });

      // PROCESS: heading words flip up in 3D (the cards scrub below)
      var procH = document.getElementById("process-h");
      gsap.set(procH, { perspective: 700 });
      gsap.from(splitWords(procH), {
        rotationX: -95,
        transformOrigin: "50% 100%",
        autoAlpha: 0,
        duration: 0.9,
        ease: "back.out(1.4)",
        stagger: 0.07,
        scrollTrigger: once(procH, "top 86%"),
      });

      // ABOUT: heading words slide in from the right; principles pop on the grid;
      // the photo opens on the right
      gsap.from(splitWords(document.getElementById("about-h")), {
        xPercent: 60,
        autoAlpha: 0,
        duration: 0.9,
        ease: ease,
        stagger: 0.06,
        scrollTrigger: once("#about-h", "top 86%"),
      });
      fade(".about-copy > p");
      gsap.from(".principles > div", {
        scale: 0.85,
        autoAlpha: 0,
        duration: 0.6,
        ease: "back.out(1.6)",
        stagger: { each: 0.1, grid: "auto", from: "start" },
        scrollTrigger: once(".principles", "top 90%"),
      });
      // About: the photo opens like a curtain from the bottom while the image
      // settles from a zoom, then drifts gently on scroll; skills pop in on the left
      var mePhoto = document.querySelector(".me-photo");
      if (mePhoto) {
        var meTl = gsap.timeline({ defaults: { ease: ease }, paused: true });
        playOnce(meTl, mePhoto, "top 85%");
        meTl
          .fromTo(
            mePhoto,
            { clipPath: "inset(100% 0% 0% 0% round 24px)" },
            { clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 1.1, ease: "power3.inOut" },
          )
          .fromTo(".me-photo img", { scale: 1.35 }, { scale: 1.1, duration: 1.5, ease: "power3.out" }, 0)
          .from(".me-tag", { y: 16, autoAlpha: 0, duration: 0.5 }, 0.8);
        gsap.fromTo(
          ".me-photo img",
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: { trigger: "#about", start: "top bottom", end: "bottom top", scrub: 0.6 },
          },
        );
      }
      gsap.from(".about-copy .me-skills li", {
        scale: 0.7,
        autoAlpha: 0,
        duration: 0.45,
        stagger: 0.06,
        ease: "back.out(1.8)",
        scrollTrigger: once(".about-copy .me-skills", "top 90%"),
      });
      gsap.from(".about-copy .me-link", {
        x: -16,
        autoAlpha: 0,
        duration: 0.5,
        ease: ease,
        scrollTrigger: once(".about-copy .me-link", "top 95%"),
      });

      // FAQ: heading words drop in from above; questions slide in from the right
      gsap.from(splitWords(document.getElementById("faq-h")), {
        yPercent: -115,
        duration: 0.8,
        ease: ease,
        stagger: 0.05,
        scrollTrigger: once("#faq-h", "top 88%"),
      });
      fade(".faq-grid .stack > p");
      gsap.from(".faq", {
        x: 60,
        autoAlpha: 0,
        duration: 0.7,
        ease: ease,
        stagger: 0.08,
        scrollTrigger: once(".faq-grid", "top 80%"),
      });

      // CTA: heading words grow out from the centre; checklist ticks in; form fields stack up
      gsap.from(splitWords(document.getElementById("cta-h")), {
        scale: 0.5,
        autoAlpha: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: { each: 0.05, from: "center" },
        scrollTrigger: once("#cta-h", "top 88%"),
      });
      fade(".cta-copy > p");
      gsap.from(".cta-copy li", {
        x: -16,
        autoAlpha: 0,
        duration: 0.5,
        ease: ease,
        stagger: 0.1,
        scrollTrigger: once(".cta-copy ul", "top 92%"),
      });
      gsap.from(".form .field, .form-note", {
        y: 28,
        autoAlpha: 0,
        duration: 0.6,
        ease: ease,
        stagger: 0.08,
        scrollTrigger: once(".form", "top 88%"),
      });

      // FOOTER columns cascade
      gsap.from(".foot-brand, .foot-col", {
        y: 24,
        autoAlpha: 0,
        duration: 0.7,
        ease: ease,
        stagger: 0.08,
        scrollTrigger: once(".foot-grid", "top 95%"),
      });

      // Process: pinned and scrubbed. Scrolling drives the track, each card rising in,
      // and an ink highlight that hands off from step to step.
      var mm = gsap.matchMedia();
      var steps = gsap.utils.toArray(".step");
      var WHITE = {
        "--sbg": "#ffffff",
        "--sfg": "#111111",
        "--smuted": "#626260",
        "--sline": "#d3cec6",
        "--snum": "#9c9fa5",
      };
      var INK = {
        "--sbg": "#111111",
        "--sfg": "#ffffff",
        "--smuted": "#9c9fa5",
        "--sline": "#2c2c2c",
        "--snum": "#626260",
      };
      mm.add("(min-width: 1101px)", function () {
        var bars = gsap.utils.toArray(".track b");
        var num = document.getElementById("scrub-n");
        gsap.set(steps, Object.assign({ y: 70, autoAlpha: 0.25 }, WHITE));
        gsap.set(bars, { scaleX: 0 });
        var tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: "#process",
            start: "top top",
            end: "+=1800",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            snap: {
              snapTo: [0, 0.25, 0.5, 0.75, 1],
              duration: { min: 0.2, max: 0.5 },
              ease: "power1.inOut",
              delay: 0.05,
            },
            onUpdate: function (self) {
              num.textContent =
                "0" + Math.min(4, Math.floor(self.progress * 4) + 1);
            },
          },
        });
        steps.forEach(function (st, i) {
          var at = i;
          tl.to(bars[i], { scaleX: 1, duration: 1 }, at)
            .to(
              st,
              { y: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out" },
              at,
            )
            .to(st.querySelector(".step-num"), { scale: 1, duration: 0.5 }, at)
            .to(st, Object.assign({ duration: 0.35 }, INK), at + 0.45);
          if (i > 0)
            tl.to(
              steps[i - 1],
              Object.assign({ duration: 0.35 }, WHITE),
              at + 0.45,
            );
        });
        tl.set({}, {}, 4.2);
        return function () {
          gsap.set(steps.concat(bars), { clearProps: "all" });
        };
      });
      mm.add("(max-width: 1100px)", function () {
        steps.forEach(function (st) {
          gsap.fromTo(st, Object.assign({ x: -36, autoAlpha: 0.25 }, WHITE), {
            x: 0,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              trigger: st,
              start: "top 92%",
              end: "top 60%",
              scrub: 0.6,
            },
          });
          gsap
            .timeline({
              scrollTrigger: {
                trigger: st,
                start: "top 62%",
                end: "bottom 38%",
                scrub: 0.4,
              },
            })
            .to(st, Object.assign({ duration: 0.3 }, INK))
            .to(st, { duration: 0.4 })
            .to(st, Object.assign({ duration: 0.3 }, WHITE));
        });
        return function () {
          gsap.set(steps, { clearProps: "all" });
        };
      });
      ScrollTrigger.sort();

      // CTA card grows into place
      gsap.from(".cta-card", {
        scale: 0.94,
        y: 40,
        ease: "none",
        scrollTrigger: {
          trigger: ".cta-card",
          start: "top 98%",
          end: "top 55%",
          scrub: 0.5,
        },
      });

      // Footer wordmark letters rise
      var fw = document.querySelector(".foot-word");
      if (fw) {
        // Animate the word already in the footer (minus the trailing dot)
        var word = fw.textContent.trim().replace(/\.$/, "");
        fw.innerHTML =
          word
            .split("")
            .map(function (c) {
              return '<span class="ch">' + c + "</span>";
            })
            .join("") +
          '<span class="ch" style="color:var(--accent-ai)">.</span>';
        gsap.from(fw.querySelectorAll(".ch"), {
          yPercent: 100,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.05,
          scrollTrigger: { trigger: fw, start: "top 98%", once: true },
        });
      }

      if (document.fonts && document.fonts.ready)
        document.fonts.ready.then(function () {
          ScrollTrigger.refresh();
        });
      window.addEventListener("load", function () {
        ScrollTrigger.refresh();
      });
    }

    // Before / after week
    var week = document.getElementById("week");
    if (week) week.querySelectorAll(".toggle button").forEach(function (b) {
      b.addEventListener("click", function () {
        var mode = b.dataset.mode;
        week.dataset.mode = mode;
        week.querySelectorAll(".toggle button").forEach(function (x) {
          x.setAttribute("aria-pressed", x === b);
        });
        week.querySelectorAll("[data-before]").forEach(function (el) {
          el.textContent = el.dataset[mode];
        });
        if (window.gsap && !reduce)
          gsap.fromTo(
            week.querySelectorAll(".tasks li"),
            { y: 10, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.45,
              stagger: 0.06,
              ease: "power2.out",
              overwrite: true,
            },
          );
      });
    });

    // Contact form: validates, then redirects to Cal.com
    var form = document.getElementById("contact-form"),
      done = document.getElementById("form-done");
    var email = document.getElementById("f-email"),
      emailErr = document.getElementById("f-email-err"),
      nameI = document.getElementById("f-name");
    if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      email.setAttribute("aria-invalid", !okEmail);
      emailErr.hidden = okEmail;
      nameI.setAttribute("aria-invalid", !nameI.value.trim());
      if (!nameI.value.trim()) {
        nameI.focus();
        return;
      }
      if (!okEmail) {
        email.focus();
        return;
      }
      // Send the visitor to Cal.com with their details prefilled
      var url = new URL(form.dataset.calUrl);
      url.searchParams.set("name", nameI.value.trim());
      url.searchParams.set("email", email.value.trim());
      var task = document.getElementById("f-task").value.trim();
      if (task) url.searchParams.set("notes", task);
      document.getElementById("done-h").textContent =
        "Thanks, " + nameI.value.trim().split(" ")[0] + ".";
      form.hidden = true;
      done.hidden = false;
      window.location.href = url.toString();
    });
    document
      .getElementById("form-reset")
      .addEventListener("click", function () {
        done.hidden = true;
        form.hidden = false;
        nameI.focus();
      });
    }
  })();
