import gsap from "gsap";

// ── Manual character splitter ────────────────────────────────────────────────
// Wraps every letter in two nested spans so we can clip + flip each char
// Returns { chars, revert } — call revert() on cleanup
function splitChars(el) {
  const original = el.innerHTML;
  const text = el.textContent.trim();
  el.innerHTML = "";
  el.style.display = "flex";
  el.style.flexWrap = "wrap";
  el.style.alignItems = "baseline";

  const chars = text.split("").map((char) => {
    const outer = document.createElement("span");
    outer.style.cssText =
      "display:inline-block; overflow:hidden; vertical-align:bottom; line-height:inherit;";

    const inner = document.createElement("span");
    inner.style.cssText = "display:inline-block;";
    inner.textContent = char === " " ? "\u00A0" : char;

    outer.appendChild(inner);
    el.appendChild(outer);
    return inner;
  });

  return {
    chars,
    revert: () => {
      el.innerHTML = original;
      el.style.display = "";
      el.style.flexWrap = "";
      el.style.alignItems = "";
    },
  };
}

// ── Main export ──────────────────────────────────────────────────────────────
export function initHeroAnimation() {
  // Grab elements
  const nav        = document.querySelector("#nav");
  const metas      = document.querySelectorAll(".hero-meta");
  const line1El    = document.querySelector(".hl-line1");
  const line2El    = document.querySelector(".hl-word2");
  const line3El    = document.querySelector(".hl-line3");
  const star       = document.querySelector(".star-icon");
  const intro      = document.querySelector(".hl-intro");
  const resumeBtn  = document.querySelector(".hero-resume-btn");
  const hstats     = document.querySelectorAll(".hstat");
  const btns       = document.querySelectorAll(".btn");

  if (!line1El || !line2El || !line3El) return () => {};

  // Split all three headlines into chars
  const s1 = splitChars(line1El);
  const s2 = splitChars(line2El);
  const s3 = splitChars(line3El);

  // ── Set initial states ────────────────────────────────────────────────────
  // Chars: 3D flip from above, hidden by parent overflow
  gsap.set([s1.chars, s2.chars, s3.chars], {
    y: "110%",
    rotationX: -90,
    opacity: 0,
    transformOrigin: "50% 100%",
    transformPerspective: 800,
  });

  if (nav)       gsap.set(nav,        { y: -28, opacity: 0 });
  if (metas)     gsap.set(metas,      { y: 14, opacity: 0 });
  if (star)      gsap.set(star,       { scale: 0, rotation: -120, opacity: 0 });
  if (intro)     gsap.set(intro,      { y: 22, opacity: 0 });
  if (resumeBtn) gsap.set(resumeBtn,  { y: 14, opacity: 0 });
  if (hstats)    gsap.set(hstats,     { y: 20, opacity: 0 });
  if (btns)      gsap.set(btns,       { y: 14, opacity: 0 });

  // ── Master timeline ───────────────────────────────────────────────────────
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // Nav
  tl.to(nav, { y: 0, opacity: 1, duration: 0.75 }, 0.05)

  // Meta labels
  .to(metas, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, 0.15)

  // ── PIXELS — chars flip up one by one
  .to(s1.chars, {
    y: "0%",
    rotationX: 0,
    opacity: 1,
    duration: 0.7,
    stagger: 0.038,
    ease: "back.out(1.5)",
  }, 0.35)

  // Star spins in with PIXELS
  .to(star, {
    scale: 1,
    rotation: 0,
    opacity: 1,
    duration: 0.85,
    ease: "back.out(1.8)",
  }, 0.35)

  // ── WITH
  .to(s2.chars, {
    y: "0%",
    rotationX: 0,
    opacity: 1,
    duration: 0.7,
    stagger: 0.04,
    ease: "back.out(1.4)",
  }, 0.75)

  // ── PURPOSE
  .to(s3.chars, {
    y: "0%",
    rotationX: 0,
    opacity: 1,
    duration: 0.72,
    stagger: 0.028,
    ease: "back.out(1.3)",
  }, 1.12)

  // Subtext
  .to(intro, { y: 0, opacity: 1, duration: 0.55 }, 1.3)
  .to(resumeBtn, { y: 0, opacity: 1, duration: 0.45 }, 1.45)

  // Stats
  .to(hstats, {
    y: 0, opacity: 1,
    duration: 0.55,
    stagger: 0.1,
  }, 1.55)

  // CTA buttons
  .to(btns, {
    y: 0, opacity: 1,
    duration: 0.45,
    stagger: 0.08,
  }, 1.72);

  // ── Star slow spin after load ─────────────────────────────────────────────
  gsap.to(star, {
    rotation: 360,
    duration: 9,
    repeat: -1,
    ease: "none",
    delay: 1.8,
  });

  // ── Cleanup ───────────────────────────────────────────────────────────────
  return () => {
    tl.kill();
    s1.revert();
    s2.revert();
    s3.revert();
  };
}
