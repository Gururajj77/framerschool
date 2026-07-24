import { gsap } from './shared';

export function initHero(reduced: boolean): (() => void) | void {
  const brand = document.querySelector('[data-hero-brand]');
  const title = document.querySelector('[data-hero-title]');
  const lead = document.querySelector('[data-hero-lead]');
  const actions = document.querySelector('[data-hero-actions]');
  const board = document.querySelector('[data-hero-board]');
  const topbar = document.querySelector('[data-topbar]');
  const fromPane = document.querySelector('[data-build-from]');
  const toPane = document.querySelector('[data-build-to]');

  if (!title) return;

  const parts = [brand, title, lead, actions, board].filter(Boolean);

  if (reduced) {
    gsap.set([...parts, topbar], { clearProps: 'all', opacity: 1, y: 0 });
    return;
  }

  gsap.set(parts, { opacity: 0, y: 14 });
  if (topbar) gsap.set(topbar, { opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
  if (topbar) tl.to(topbar, { opacity: 1, duration: 0.35 }, 0);
  if (brand) tl.to(brand, { opacity: 1, y: 0, duration: 0.45 }, 0.05);
  tl.to(title, { opacity: 1, y: 0, duration: 0.5 }, 0.12);
  if (lead) tl.to(lead, { opacity: 1, y: 0, duration: 0.45 }, 0.2);
  if (actions) tl.to(actions, { opacity: 1, y: 0, duration: 0.4 }, 0.28);
  if (board) tl.to(board, { opacity: 1, y: 0, duration: 0.55 }, 0.22);

  if (fromPane && toPane) {
    gsap.fromTo(
      toPane.querySelectorAll('.pf-build-block'),
      { opacity: 0.35 },
      {
        opacity: 1,
        duration: 1.2,
        stagger: 0.12,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
        delay: 0.8,
      },
    );
  }

  return () => {
    tl.kill();
  };
}
