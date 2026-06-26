import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isCoarsePointer(): boolean {
  return window.matchMedia('(pointer: coarse)').matches;
}

export function isDesktop(): boolean {
  return window.matchMedia('(min-width: 961px)').matches;
}

export function revealUp(
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars = {},
): gsap.core.Tween {
  return gsap.from(targets, {
    y: 32,
    opacity: 0,
    duration: 0.7,
    ease: 'power3.out',
    ...vars,
  });
}

export function batchReveal(
  selector: string,
  options: Omit<ScrollTrigger.BatchVars, 'onEnter'> = {},
): ScrollTrigger[] {
  return ScrollTrigger.batch(selector, {
    start: 'top 88%',
    once: true,
    onEnter: (batch: Element[]) => {
      gsap.from(batch, {
        y: 28,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        overwrite: true,
      });
    },
    ...options,
  });
}

export function setFinalState(targets: gsap.TweenTarget, vars: gsap.TweenVars): void {
  gsap.set(targets, { clearProps: 'all', ...vars });
}
