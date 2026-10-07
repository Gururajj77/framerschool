import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenis;
}

/** Same-page hash target for a link, e.g. "/#faq" while on "/". */
function sameDocumentTarget(anchor: HTMLAnchorElement): HTMLElement | null {
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return null;
  if (!url.hash || url.hash === '#') return null;
  return document.getElementById(decodeURIComponent(url.hash.slice(1)));
}

export function initSmoothScroll(reduced: boolean): void {
  if (!reduced) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey) return;
    const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href*="#"]');
    if (!anchor) return;

    const target = sameDocumentTarget(anchor);
    if (!target) return;

    event.preventDefault();
    history.pushState(null, '', `#${target.id}`);

    if (lenis) {
      lenis.scrollTo(target, { duration: 1.1 });
    } else {
      target.scrollIntoView();
    }

    // Move focus for keyboard and screen reader users without a second scroll
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
}
