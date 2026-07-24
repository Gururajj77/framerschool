import { batchReveal, gsap, ScrollTrigger } from './shared';

export function initBuilds(reduced: boolean): void {
  if (reduced) return;

  batchReveal('#builds .pf-section-head');

  const items = gsap.utils.toArray<HTMLElement>('[data-build-item]');
  if (items.length === 0) return;

  gsap.set(items, { opacity: 0, y: 10 });

  ScrollTrigger.batch(items, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.06,
        ease: 'power2.out',
        overwrite: true,
      });
    },
  });
}
