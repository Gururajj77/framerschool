import { gsap } from './shared';
import { batchReveal } from './shared';

export function initFeatures(reduced: boolean): void {
  if (reduced) return;

  batchReveal('.pf-section--programs .pf-display-title-line, .pf-section--programs .pf-display-title-count');
  batchReveal('[data-program-card]');

  const cards = gsap.utils.toArray<HTMLElement>('[data-program-card]');

  cards.forEach((card) => {
    const title = card.querySelector('.pf-project-title');
    const num = card.querySelector('.pf-project-num');

    card.addEventListener('mouseenter', () => {
      gsap.to(title, { x: 6, duration: 0.45, ease: 'power2.out' });
      gsap.to(num, { color: '#e01b24', duration: 0.35, ease: 'power2.out' });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(title, { x: 0, duration: 0.45, ease: 'power2.out' });
      gsap.to(num, { color: '', duration: 0.35, ease: 'power2.out' });
    });
  });
}
