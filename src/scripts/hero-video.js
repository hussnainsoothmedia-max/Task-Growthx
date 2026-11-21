// Hero "video": loops an n8n execution. Nodes switch between idle, running
// and done; edges fill green as data passes; WhatsApp messages pop in.
import gsap from "gsap";

const root = document.getElementById("hero-video");

if (root) {
  const $ = (id) => document.getElementById(id);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const status = $("hv-status");
  const statusText = status.querySelector("span");
  const foot = $("hv-foot");
  const time = $("hv-time");
  const progress = $("hv-progress");
  const playBtn = $("hv-play");
  const nodes = ["hv-n1", "hv-n2", "hv-n3", "hv-n5", "hv-n6"].map($);
  const subs = [$("hv-s1"), $("hv-s2")];
  const runs = ["hv-e1", "hv-e2", "hv-e3", "hv-e4"].map($);
  const chips = ["hv-chip1", "hv-chip2", "hv-chip3"].map($);
  const msgs = ["hv-m1", "hv-m2", "hv-m3"].map($);
  const route = $("hv-route");
  let execution = 1042;

  runs.forEach((p) => {
    const l = p.getTotalLength();
    gsap.set(p, { strokeDasharray: l, strokeDashoffset: l });
  });

  const setStatus = (text, mode) => {
    statusText.textContent = text;
    status.dataset.mode = mode;
  };
  const state = (el, s) => {
    el.classList.remove("is-run", "is-done");
    if (s) el.classList.add(s);
  };
  const reset = () => {
    nodes.forEach((n) => state(n));
    subs.forEach((n) => n.classList.remove("is-run"));
    route.classList.remove("is-on");
    runs.forEach((p) => gsap.set(p, { strokeDashoffset: p.getTotalLength() }));
    gsap.set(chips, { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 50%" });
    gsap.set(msgs, { autoAlpha: 0, y: 8 });
    setStatus("Waiting for message…", "wait");
  };

  const fill = (p) => ({ strokeDashoffset: 0, duration: 0.45, ease: "power2.inOut" });
  const pop = { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2)" };
  const msgIn = { autoAlpha: 1, y: 0, duration: 0.4, ease: "back.out(1.6)" };

  const tl = gsap.timeline({ repeat: -1, paused: true, onRepeat: () => foot && (foot.textContent = `Execution #${++execution} · sample data`) });
  tl.call(reset, null, 0)
    // patient message triggers the workflow
    .to(msgs[0], msgIn, 0.3)
    .call(() => { setStatus("Executing workflow…", "run"); state(nodes[0], "is-run"); }, null, 0.6)
    .call(() => state(nodes[0], "is-done"), null, 1.1)
    .to(runs[0], fill(), 1.1)
    .to(chips[0], pop, 1.35)
    // AI agent reads the request
    .call(() => { state(nodes[1], "is-run"); subs.forEach((s) => s.classList.add("is-run")); }, null, 1.5)
    .call(() => { state(nodes[1], "is-done"); subs.forEach((s) => s.classList.remove("is-run")); }, null, 2.7)
    .to(runs[1], fill(), 2.7)
    .to(chips[1], pop, 2.95)
    // not urgent: routine branch
    .call(() => state(nodes[2], "is-run"), null, 3.1)
    .call(() => { state(nodes[2], "is-done"); route.classList.add("is-on"); }, null, 3.6)
    .to(runs[2], fill(), 3.6)
    // find slots, reply to the patient
    .call(() => state(nodes[3], "is-run"), null, 4.05)
    .call(() => state(nodes[3], "is-done"), null, 4.7)
    .to(msgs[1], msgIn, 4.8)
    // patient picks a time, booking is written
    .to(msgs[2], msgIn, 5.7)
    .to(runs[3], fill(), 6)
    .to(chips[2], pop, 6.25)
    .call(() => state(nodes[4], "is-run"), null, 6.3)
    .call(() => { state(nodes[4], "is-done"); setStatus("Booked · Tue 09:30", "done"); }, null, 7)
    // hold on the result, then fade the chat before looping
    .to([...msgs, ...chips], { autoAlpha: 0, duration: 0.4, stagger: 0.03 }, 8.5)
    .to({}, { duration: 0.1 }, 9);

  const total = tl.duration();
  const fmt = (s) => `0:${String(Math.floor(s)).padStart(2, "0")}`;
  tl.eventCallback("onUpdate", () => {
    const t = tl.time();
    progress.style.transform = `scaleX(${t / total})`;
    time.textContent = `${fmt(t)} / ${fmt(total)}`;
  });

  let userPaused = false;
  const setPaused = (p) => {
    tl.paused(p);
    root.classList.toggle("is-paused", p);
    playBtn.setAttribute("aria-pressed", String(p));
    playBtn.setAttribute("aria-label", p ? "Play workflow video" : "Pause workflow video");
  };
  playBtn.addEventListener("click", () => {
    userPaused = !tl.paused();
    setPaused(userPaused);
  });

  reset();
  if (reduce) {
    // Show the finished run and let the visitor press play
    tl.progress(0.85, false); // false = run the callbacks so nodes show as done
    userPaused = true;
    setPaused(true);
  } else {
    // Only run while the hero is on screen
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => {
        if (!userPaused) setPaused(!e.isIntersecting);
      }).observe(root);
    } else {
      setPaused(false);
    }
  }
}
