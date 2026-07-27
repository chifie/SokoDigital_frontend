import { useEffect, useRef, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Enable smoother scroll performance with normalized scroll handling
ScrollTrigger.normalizeScroll();

export interface ScrollAnimDef {
  /** CSS selector for elements to animate */
  selector: string;
  /** Override initial state (default: { opacity: 0, y: 20 }) */
  from?: gsap.TweenVars;
  /** Override final state (default: { opacity: 1, y: 0 }) */
  to?: gsap.TweenVars;
  /** Stagger delay between each matched element (default: 0.06 for multiple, 0 for single) */
  stagger?: number;
  /** Duration in seconds (default: 0.5) */
  duration?: number;
  /** Easing function (default: "power2.out") */
  ease?: string;
  /** ScrollTrigger start position (default: "top 85%") */
  start?: string;
  /** Custom trigger selector. Defaults to the first matched element from selector */
  trigger?: string;
  /** If true, animate only the first matched element instead of all */
  single?: boolean;
}

type AnimationsInput = ScrollAnimDef[] | ScrollAnimDef;

/**
 * A reusable hook that creates scroll‑triggered GSAP fade‑in‑up animations
 * within a given scope element.  Pass either a single definition or an array.
 *
 * @example
 * ```tsx
 * const mainRef = useRef<HTMLDivElement>(null);
 * useGsapScroll(mainRef, [
 *   { selector: '.my-cards', stagger: 0.08 },
 *   { selector: '.hero-title', single: true, duration: 0.8 },
 * ]);
 * ```
 */
export function useGsapScroll(
  scopeRef: RefObject<HTMLElement | null>,
  animations: AnimationsInput,
) {
  // Store animations in a ref so the effect never needs to depend on the
  // array identity (allows callers to define animations inline).
  const animsRef = useRef(animations);
  animsRef.current = animations;

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const raw = animsRef.current;
    const defs: ScrollAnimDef[] = Array.isArray(raw) ? raw : [raw];

    const ctx = gsap.context(() => {
      for (const def of defs) {
        const {
          selector,
          from = {},
          to = {},
          stagger: customStagger,
          duration = 0.5,
          ease = 'power2.out',
          start = 'top 85%',
          trigger: customTrigger,
          single = false,
        } = def;

        const elements = single
          ? (scope.querySelector(selector) as Element | null)
          : scope.querySelectorAll(selector);

        if (!elements || (elements instanceof NodeList && elements.length === 0)) {
          continue;
        }

        const triggerEl = customTrigger
          ? scope.querySelector(customTrigger)
          : elements instanceof NodeList
            ? elements[0]
            : elements;

        if (!triggerEl) continue;

        const elemCount = elements instanceof NodeList ? elements.length : 1;

        gsap.fromTo(
          elements,
          { opacity: 0, y: 20, ...from },
          {
            opacity: 1,
            y: 0,
            duration,
            ease,
            stagger: customStagger ?? (elemCount > 1 ? 0.06 : 0),
            scrollTrigger: { trigger: triggerEl, start, once: true },
            ...to,
          },
        );
      }
    }, scope);

    return () => ctx.revert();
    // Intentionally run only when scope element changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeRef]);
}
