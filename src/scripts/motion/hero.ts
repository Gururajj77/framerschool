import { gsap } from './shared';

const NICHES = ['Law firm', 'Dentist', 'Gym', 'SaaS', 'Restaurant', 'Agency'];

export function initHero(reduced: boolean): (() => void) | void {
  const brand = document.querySelector('[data-hero-brand]');
  const title = document.querySelector('[data-hero-title]');
  const lead = document.querySelector('[data-hero-lead]');
  const actions = document.querySelector('[data-hero-actions]');
  const board = document.querySelector('[data-hero-board]');
  const niche = document.querySelector('[data-wire-niche]');
  const topbar = document.querySelector('[data-nav]');

  if (!title) return;

  const parts = [brand, title, lead, actions, board].filter(Boolean);

  if (reduced) {
    gsap.set([...parts, topbar], { clearProps: 'all', opacity: 1, y: 0 });
    return;
  }

  gsap.set(parts, { opacity: 0, y: 18 });
  if (topbar) gsap.set(topbar, { opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if (topbar) tl.to(topbar, { opacity: 1, duration: 0.4 }, 0);
  if (brand) tl.to(brand, { opacity: 1, y: 0, duration: 0.55 }, 0.05);
  tl.to(title, { opacity: 1, y: 0, duration: 0.65 }, 0.12);
  if (lead) tl.to(lead, { opacity: 1, y: 0, duration: 0.5 }, 0.22);
  if (actions) tl.to(actions, { opacity: 1, y: 0, duration: 0.45 }, 0.3);
  if (board) tl.to(board, { opacity: 1, y: 0, duration: 0.6 }, 0.2);

  let nicheIndex = 0;
  let nicheTimer: number | undefined;

  if (niche) {
    nicheTimer = window.setInterval(() => {
      nicheIndex = (nicheIndex + 1) % NICHES.length;
      gsap.to(niche, {
        opacity: 0,
        y: -6,
        duration: 0.2,
        onComplete: () => {
          niche.textContent = NICHES[nicheIndex];
          gsap.to(niche, { opacity: 1, y: 0, duration: 0.25 });
        },
      });
    }, 2200);
  }

  return () => {
    tl.kill();
    if (nicheTimer) window.clearInterval(nicheTimer);
  };
}
