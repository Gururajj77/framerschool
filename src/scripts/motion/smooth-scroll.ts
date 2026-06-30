import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './shared';

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function getScrollY(): number {
  return lenisInstance?.scroll ?? window.scrollY;
}

function dispatchScrollEvent(): void {
  document.dispatchEvent(
    new CustomEvent('pf-scroll', {
      detail: { scroll: getScrollY() },
    }),
  );
}

export function initSmoothScroll(): (() => void) | void {
  if (prefersReducedMotion()) return;

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.85,
    touchMultiplier: 1.1,
  });

  lenisInstance = lenis;
  document.documentElement.classList.add('lenis', 'lenis-smooth');

  lenis.on('scroll', () => {
    ScrollTrigger.update();
    dispatchScrollEvent();
  });

  const tick = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const getTopbarOffset = () => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--pf-topbar-height').trim();
    const value = parseFloat(raw);
    return Number.isFinite(value) ? value : 72;
  };

  const onAnchorClick = (event: MouseEvent) => {
    const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;

    event.preventDefault();
    lenis.scrollTo(target, {
      offset: -getTopbarOffset(),
      duration: 1.1,
      onComplete: dispatchScrollEvent,
    });
  };

  document.addEventListener('click', onAnchorClick);

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    dispatchScrollEvent();
  });

  return () => {
    document.removeEventListener('click', onAnchorClick);
    gsap.ticker.remove(tick);
    lenis.destroy();
    lenisInstance = null;
    document.documentElement.classList.remove('lenis', 'lenis-smooth');
  };
}
