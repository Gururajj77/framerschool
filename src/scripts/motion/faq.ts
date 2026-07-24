import { gsap } from './shared';
import { batchReveal } from './shared';

export function initFaq(reduced: boolean): (() => void) | void {
  const items = gsap.utils.toArray<HTMLElement>('[data-faq-item]');

  batchReveal('[data-faq-item]', { start: 'top 92%' });

  if (items.length === 0) return;

  const closeItem = (item: HTMLElement) => {
    const panel = item.querySelector<HTMLElement>('[data-faq-panel]');
    const inner = item.querySelector<HTMLElement>('.fs-faq-panel-inner, .pf-faq-panel-inner');
    const toggle = item.querySelector('[data-faq-toggle]');

    if (!panel || !inner) return;

    gsap.to(panel, {
      height: 0,
      duration: reduced ? 0 : 0.35,
      ease: 'power2.inOut',
      onComplete: () => {
        item.classList.remove('open');
        toggle?.setAttribute('aria-expanded', 'false');
      },
    });
  };

  const openItem = (item: HTMLElement) => {
    const panel = item.querySelector<HTMLElement>('[data-faq-panel]');
    const inner = item.querySelector<HTMLElement>('.fs-faq-panel-inner, .pf-faq-panel-inner');
    const toggle = item.querySelector('[data-faq-toggle]');

    if (!panel || !inner) return;

    item.classList.add('open');
    toggle?.setAttribute('aria-expanded', 'true');
    gsap.set(panel, { height: 'auto' });
    const height = inner.offsetHeight;
    gsap.fromTo(
      panel,
      { height: 0 },
      { height, duration: reduced ? 0 : 0.4, ease: 'power2.out' },
    );
  };

  items.forEach((item) => {
    const panel = item.querySelector<HTMLElement>('[data-faq-panel]');
    const toggle = item.querySelector('[data-faq-toggle]');
    if (!panel || !toggle) return;

    gsap.set(panel, { height: 0 });

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
