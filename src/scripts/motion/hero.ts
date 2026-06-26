import { gsap } from './shared';

export function initHero(reduced: boolean): (() => void) | void {
  const hero = document.querySelector('#home');
  if (!hero) return;

  const trust = hero.querySelector('[data-animate="trust"]');
  const lines = hero.querySelectorAll('[data-animate="line"]');
  const lead = hero.querySelector('[data-animate="lead"]');
  const actions = hero.querySelector('[data-animate="actions"]');
  const stats = hero.querySelector('[data-animate="stats"]');
  const topbar = document.querySelector('[data-topbar]');
  const grid = document.querySelector('[data-structure-grid]');

  if (reduced) {
    gsap.set([trust, ...lines, lead, actions, stats], {
      clearProps: 'all',
      opacity: 1,
      y: 0,
    });
    if (topbar) gsap.set(topbar, { clearProps: 'all', opacity: 1 });
    return;
  }

  gsap.set(topbar, { opacity: 0, y: -12 });
  gsap.set(grid, { opacity: 0 });
  gsap.set(lines, { y: '110%', opacity: 1 });
  gsap.set([trust, lead, actions], { y: 20, opacity: 0 });
  if (stats) gsap.set(stats.children, { y: 16, opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.to(grid, { opacity: 0.03, duration: 1.2 }, 0)
    .to(topbar, { opacity: 1, y: 0, duration: 0.6 }, 0.1)
    .to(trust, { y: 0, opacity: 1, duration: 0.5 }, 0.25)
    .to(lines, { y: 0, duration: 1, stagger: 0.08, ease: 'power4.out' }, 0.35)
    .to(lead, { y: 0, opacity: 1, duration: 0.6 }, 0.75)
    .to(actions, { y: 0, opacity: 1, duration: 0.5 }, 0.85);

  if (stats) {
    tl.to(stats.children, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' }, 0.95);
  }

  return () => {
    tl.kill();
  };
}
