import { gsap, ScrollTrigger } from './shared';

export function initMarquee(reduced: boolean): void {
  if (reduced) return;

  document.querySelectorAll('[data-marquee-track]').forEach((track) => {
    const el = track as HTMLElement;

    ScrollTrigger.create({
      trigger: el.closest('.pf-marquee') ?? el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const speed = 1 + self.progress * 0.5;
        el.style.animationDuration = `${28 / speed}s`;
      },
    });
  });
}
