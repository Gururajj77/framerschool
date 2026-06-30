import { gsap } from './shared';

export function initHero(reduced: boolean): (() => void) | void {
  const hero = document.querySelector('#home .pf-hero-inner');
  const topbar = document.querySelector('[data-topbar]');

  if (!hero) return;

  if (reduced) {
    gsap.set([hero, topbar], { clearProps: 'all', opacity: 1, y: 0 });
    return;
  }

  gsap.set(hero, { opacity: 0, y: 12 });
  if (topbar) gsap.set(topbar, { opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
  if (topbar) tl.to(topbar, { opacity: 1, duration: 0.4 }, 0);
  tl.to(hero, { opacity: 1, y: 0, duration: 0.5 }, 0.08);

  return () => {
    tl.kill();
  };
}
