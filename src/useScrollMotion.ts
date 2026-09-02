import { useEffect, useRef } from "react";

/**
 * Ported from the design handoff's prototype motion script (single rAF loop,
 * smoothed scroll value, imperative style writes via refs instead of
 * querySelector). See design_handoff_portfolio_motion/README.md "Motion layer".
 */

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const SMOOTHING = 0.14;
const MOTION_AMOUNT = 1;
const NARROW_BREAKPOINT = 900;

export type ScrubEntry = { el: HTMLElement; index: number; window: number };

type ArrayRef<T> = { current: (T | null)[] };
type MapRef<K, V> = { current: Map<K, V> };
type ElRef<T> = { current: T | null };

export interface MotionRefs {
  nav: ElRef<HTMLElement>;
  navProgress: ElRef<HTMLDivElement>;
  navLinks: MapRef<string, HTMLAnchorElement>;
  heroFrame: ElRef<HTMLDivElement>;
  heroPhoto: ElRef<HTMLImageElement>;
  scrollArrow: ElRef<HTMLAnchorElement>;
  glows: ArrayRef<HTMLDivElement>;
  scrubs: MapRef<string, ScrubEntry>;
  expTimeline: ElRef<HTMLDivElement>;
  expFill: ElRef<HTMLDivElement>;
  expDots: ArrayRef<HTMLSpanElement>;
  expCards: ArrayRef<HTMLDivElement>;
  eduSection: ElRef<HTMLElement>;
  eduSweep: ElRef<HTMLDivElement>;
  gpa: ElRef<HTMLDivElement>;
  skillDrift: ElRef<HTMLDivElement>;
  skillRows: ArrayRef<HTMLDivElement>;
  projGrid: ElRef<HTMLDivElement>;
  projCards: ArrayRef<HTMLDivElement>;
  sections: MapRef<string, HTMLElement>;
}

const SECTION_ORDER = ["about", "education", "experience", "leadership", "projects", "skills", "contact"];

const GLOW_RATES = [0.05, 0.09, 0.14, 0.03];

type LoopState = { sm: number; target: number; spy: string };

function tick(refs: MotionRefs, state: LoopState, onSpyChange: ElRef<((id: string) => void) | undefined>) {
  const vh = window.innerHeight;
  const doc = Math.max(1, document.documentElement.scrollHeight - vh);
  const real = window.scrollY;

  state.sm = lerp(state.sm, state.target, SMOOTHING);
  if (Math.abs(state.sm - state.target) < 0.3) state.sm = state.target;
  const sm = state.sm;
  const shift = real - sm;
  const narrow = window.innerWidth < NARROW_BREAKPOINT;

  // hero pin
  const hp = clamp(sm / (vh * 0.45), 0, 1);
  const he = easeOut(hp);
  const heroFrame = refs.heroFrame.current;
  if (heroFrame) {
    if (narrow) {
      heroFrame.style.transform = "";
      heroFrame.style.opacity = "";
      heroFrame.style.filter = "";
    } else {
      const scale = 1 - 0.14 * he * MOTION_AMOUNT;
      heroFrame.style.transform = `translate3d(0, ${(-90 * he * MOTION_AMOUNT).toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
      heroFrame.style.opacity = String(clamp(1 - Math.max(0, hp - 0.45) / 0.4, 0, 1));
      heroFrame.style.filter = hp > 0.5 ? `blur(${((hp - 0.5) * 8 * MOTION_AMOUNT).toFixed(2)}px)` : "none";
    }
  }
  const heroPhoto = refs.heroPhoto.current;
  if (heroPhoto) {
    heroPhoto.style.transform = narrow ? "" : `translate3d(0, ${(-70 * he * MOTION_AMOUNT).toFixed(2)}px, 0)`;
  }
  const arrow = refs.scrollArrow.current;
  if (arrow) {
    arrow.style.opacity = narrow ? "" : String(clamp(1 - hp * 4, 0, 1));
  }

  // nav reveal (kept always-visible on narrow viewports via CSS instead — see styles.css)
  const nav = refs.nav.current;
  if (nav) {
    if (narrow) {
      nav.style.opacity = "";
      nav.style.transform = "";
      nav.style.pointerEvents = "";
    } else {
      const np = clamp((hp - 0.42) / 0.22, 0, 1);
      nav.style.opacity = String(np);
      nav.style.transform = `translate3d(0, ${((1 - np) * -14).toFixed(2)}px, 0) scale(${(0.97 + 0.03 * np).toFixed(4)})`;
      nav.style.pointerEvents = np > 0.6 ? "auto" : "none";
    }
  }
  const navProgress = refs.navProgress.current;
  if (navProgress) {
    navProgress.style.width = `${(clamp(sm / doc, 0, 1) * 100).toFixed(2)}%`;
  }

  // parallax backdrop — drift is capped so a gradient edge never slides into view
  refs.glows.current.forEach((g, i) => {
    if (!g) return;
    const rate = GLOW_RATES[i] ?? 0.05;
    const cap = (i === 3 ? 0.3 : 0.16) * vh;
    const y = -clamp(sm * rate * MOTION_AMOUNT, 0, cap);
    const x = i === 3 ? -clamp(sm * 0.02, 0, 0.12 * window.innerWidth) : 0;
    g.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
  });

  // scrubbed reveals
  refs.scrubs.current.forEach(({ el, index, window: w }) => {
    const top = el.getBoundingClientRect().top + shift;
    const raw = (vh * 0.96 - top) / (vh * w);
    const t = easeOut(clamp((raw - index * 0.06) / 0.95, 0, 1));
    el.style.opacity = String(0.06 + 0.94 * t);
    el.style.transform = `translate3d(0, ${((1 - t) * 22 * MOTION_AMOUNT).toFixed(2)}px, 0)`;
  });

  // experience timeline fill + dots (Experience only — Leadership has no rail)
  const expWrap = refs.expTimeline.current;
  const expFill = refs.expFill.current;
  if (expWrap && expFill) {
    const r = expWrap.getBoundingClientRect();
    const tp = clamp((vh * 0.72 - (r.top + shift)) / (r.height * 0.95), 0, 1);
    expFill.style.height = `${(tp * 100).toFixed(2)}%`;
    const fillY = r.top + shift + 8 + r.height * tp;
    refs.expDots.current.forEach((d) => {
      if (!d) return;
      const lit = d.getBoundingClientRect().top + shift <= fillY;
      d.style.borderColor = lit ? "oklch(72% 0.15 250)" : "oklch(40% 0.01 250)";
      d.style.boxShadow = lit ? "0 0 12px oklch(72% 0.15 250 / 0.5)" : "none";
    });
  }

  // experience card in view gets a quiet accent border
  refs.expCards.current.forEach((c) => {
    if (!c) return;
    const cr = c.getBoundingClientRect();
    const off = Math.abs(cr.top + shift + cr.height / 2 - vh / 2) / vh;
    c.style.borderColor = off < 0.45 ? "oklch(72% 0.15 250 / 0.4)" : "oklch(40% 0.01 250)";
  });

  // skills: two rows drift horizontally, disabled under the narrow breakpoint
  const skillDrift = refs.skillDrift.current;
  const rows = refs.skillRows.current;
  if (skillDrift && rows.length) {
    if (narrow) {
      rows.forEach((row) => {
        if (row) row.style.transform = "";
      });
    } else {
      const r = skillDrift.getBoundingClientRect();
      const sp = easeOut(clamp((vh * 0.92 - (r.top + shift)) / (vh * 0.5), 0, 1));
      rows.forEach((row, i) => {
        if (!row) return;
        row.style.transform = `translate3d(${((1 - sp) * (i === 0 ? -150 : 190) * MOTION_AMOUNT).toFixed(2)}px, 0, 0)`;
      });
    }
  }

  // projects: cards rise and settle one after another
  const projGrid = refs.projGrid.current;
  const projs = refs.projCards.current;
  if (projGrid && projs.length) {
    const r = projGrid.getBoundingClientRect();
    const pp = clamp((vh * 0.94 - (r.top + shift)) / (vh * 0.62), 0, 1);
    projs.forEach((c, i) => {
      if (!c) return;
      const t = easeOut(clamp((pp - i * 0.12) / 0.8, 0, 1));
      c.style.opacity = String(0.04 + 0.96 * t);
      c.style.transform = `translate3d(0, ${((1 - t) * 34 * MOTION_AMOUNT).toFixed(2)}px, 0) scale(${(0.985 + 0.015 * t).toFixed(4)})`;
    });
  }

  // education showpiece: light sweep + GPA count-up
  const edu = refs.eduSection.current;
  if (edu) {
    const r = edu.getBoundingClientRect();
    const ep = clamp((vh * 0.95 - (r.top + shift)) / (vh * 0.7), 0, 1);
    const sweep = refs.eduSweep.current;
    if (sweep) sweep.style.transform = `translate3d(${(-60 + ep * 120).toFixed(2)}%, 0, 0)`;
    const gpa = refs.gpa.current;
    if (gpa) {
      const val = (easeOut(clamp(ep * 1.25, 0, 1)) * 4).toFixed(1);
      if (gpa.textContent !== val) gpa.textContent = val;
    }
  }

  // scroll spy — last section whose top has crossed 40% of the viewport wins
  let active = SECTION_ORDER[0];
  SECTION_ORDER.forEach((id) => {
    const el = refs.sections.current.get(id);
    if (el && el.getBoundingClientRect().top + shift < vh * 0.4) active = id;
  });
  if (real + vh >= document.documentElement.scrollHeight - 4) active = "contact";
  if (active !== state.spy) {
    state.spy = active;
    refs.navLinks.current.forEach((a, id) => {
      const on = id === active;
      a.style.background = on ? "oklch(72% 0.15 250)" : "transparent";
      a.style.color = on ? "oklch(16% 0.02 250)" : "oklch(80% 0.006 250)";
    });
    onSpyChange.current?.(active);
  }
}

function applyRestState(refs: MotionRefs) {
  const nav = refs.nav.current;
  if (nav) {
    nav.style.opacity = "1";
    nav.style.transform = "none";
    nav.style.pointerEvents = "auto";
  }
  const heroFrame = refs.heroFrame.current;
  if (heroFrame) {
    heroFrame.style.transform = "none";
    heroFrame.style.opacity = "1";
    heroFrame.style.filter = "none";
  }
  if (refs.heroPhoto.current) refs.heroPhoto.current.style.transform = "none";
  if (refs.scrollArrow.current) refs.scrollArrow.current.style.opacity = "1";
  refs.glows.current.forEach((g) => {
    if (g) g.style.transform = "none";
  });
  refs.scrubs.current.forEach(({ el }) => {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
  if (refs.expFill.current) refs.expFill.current.style.height = "100%";
  refs.expDots.current.forEach((d) => {
    if (!d) return;
    d.style.borderColor = "oklch(72% 0.15 250)";
    d.style.boxShadow = "0 0 12px oklch(72% 0.15 250 / 0.5)";
  });
  refs.expCards.current.forEach((c) => {
    if (c) c.style.borderColor = "oklch(40% 0.01 250)";
  });
  refs.skillRows.current.forEach((row) => {
    if (row) row.style.transform = "none";
  });
  refs.projCards.current.forEach((c) => {
    if (!c) return;
    c.style.opacity = "1";
    c.style.transform = "none";
  });
  if (refs.eduSweep.current) refs.eduSweep.current.style.transform = "translate3d(60%, 0, 0)";
  if (refs.gpa.current) refs.gpa.current.textContent = "4.0";
}

export function useScrollMotion(refs: MotionRefs, onSpyChange?: (id: string) => void) {
  const onSpyChangeRef = useRef(onSpyChange);
  useEffect(() => {
    onSpyChangeRef.current = onSpyChange;
  }, [onSpyChange]);

  // refs are stable mutable containers, intentionally excluded from deps —
  // this effect must run exactly once so a single rAF loop owns the writes.
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      applyRestState(refs);
      return;
    }

    const state: LoopState = { sm: window.scrollY, target: window.scrollY, spy: "" };
    const onScroll = () => {
      state.target = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    const loop = () => {
      tick(refs, state, onSpyChangeRef);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
