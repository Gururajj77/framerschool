import { gsap } from './shared';
import { batchReveal } from './shared';

export function initFaq(reduced: boolean): (() => void) | void {
  const items = gsap.utils.toArray<HTMLElement>('[data-faq-item]');

  if (items.length === 0) return;

  // Reveal the FAQ block as a whole — avoid per-item transforms fighting the accordion.
  batchReveal('#faq .fs-faq-intro, #faq .fs-faq-list', { start: 'top 92%' });

  const closeItem = (item: HTMLElement) => {
    const panel = item.querySelector<HTMLElement>('[data-faq-panel]');
    const inner = item.querySelector<HTMLElement>('.fs-faq-panel-inner');
    const toggle = item.querySelector('[data-faq-toggle]');

    if (!panel || !inner) return;

    gsap.killTweensOf(panel);
    gsap.to(panel, {
      height: 0,
      duration: reduced ? 0 : 0.32,
      ease: 'power2.inOut',
      onComplete: () => {
        item.classList.remove('open');
        toggle?.setAttribute('aria-expanded', 'false');
      },
    });
  };

  const openItem = (item: HTMLElement) => {
    const panel = item.querySelector<HTMLElement>('[data-faq-panel]');
    const inner = item.querySelector<HTMLElement>('.fs-faq-panel-inner');
    const toggle = item.querySelector('[data-faq-toggle]');

    if (!panel || !inner) return;

    gsap.killTweensOf(panel);
    item.classList.add('open');
    toggle?.setAttribute('aria-expanded', 'true');

    // Measure natural height, then animate from 0.
    gsap.set(panel, { height: 'auto', overflow: 'hidden' });
    const height = inner.getBoundingClientRect().height;
    gsap.fromTo(
      panel,
      { height: 0 },
      { height, duration: reduced ? 0 : 0.38, ease: 'power2.out' },
    );
  };

  items.forEach((item) => {
    const panel = item.querySelector<HTMLElement>('[data-faq-panel]');
    const toggle = item.querySelector('[data-faq-toggle]');
    if (!panel || !toggle) return;

    gsap.set(panel, { height: 0, overflow: 'hidden' });

    toggle.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach((other) => {
        if (other !== item) closeItem(other);
      });
      if (isOpen) closeItem(item);
      else openItem(item);
    });
  });
}

export function initCta(reduced: boolean): (() => void) | void {
  if (reduced) return;
  batchReveal('[data-cta-title], [data-cta-panel]');
}

export function initFooter(reduced: boolean): void {
  if (reduced) return;
  batchReveal('.fs-footer-nav a, .fs-footer-meta');
}
