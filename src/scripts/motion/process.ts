import { gsap } from './shared';
import { batchReveal } from './shared';

export function initProcess(reduced: boolean): (() => void) | void {
  if (reduced) return;

  batchReveal('.pf-section--process .pf-display-title-line, .pf-section--process .pf-display-title-count');
  batchReveal('[data-process-card]');

  const cards = gsap.utils.toArray<HTMLElement>('[data-process-card]');

  cards.forEach((card) => {
    const title = card.querySelector('.pf-project-title');
    const num = card.querySelector('.pf-project-num');

    const onEnter = () => {
      gsap.to(title, { x: 6, duration: 0.45, ease: 'power2.out' });
      gsap.to(num, { color: '#e01b24', duration: 0.35, ease: 'power2.out' });
    };

    const onLeave = () => {
      gsap.to(title, { x: 0, duration: 0.45, ease: 'power2.out' });
      gsap.to(num, { color: '', duration: 0.35, ease: 'power2.out' });
    };

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);
  });
}
