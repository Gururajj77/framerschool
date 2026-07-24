import { gsap, ScrollTrigger, batchReveal } from './shared';

export function initContrast(reduced: boolean): void {
  if (reduced) return;
  batchReveal('[data-contrast-kicker], [data-contrast-statement], [data-contrast-sub]');
}

export function initMethod(reduced: boolean): void {
  if (reduced) {
    batchReveal('[data-method-step]');
    return;
  }

  const progress = document.querySelector('[data-method-progress]');
  const section = document.querySelector('#method');

  batchReveal('[data-method-step]');

  if (!progress || !section) return;

  gsap.fromTo(
    progress,
    { width: '0%' },
    {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        end: 'bottom 55%',
        scrub: true,
      },
    },
  );
}

export function initPillars(reduced: boolean): void {
  if (reduced) return;
  batchReveal('[data-pillar]');
}

export function initPhilosophy(reduced: boolean): void {
  if (reduced) return;
  batchReveal('[data-philosophy-quote], [data-philosophy-item]');
}
