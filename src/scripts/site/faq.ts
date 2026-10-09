import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** One answer open at a time, like the template's FAQ. */
export function initFaq(): void {
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-faq-item]'));

  const setOpen = (item: HTMLElement, open: boolean) => {
    item.classList.toggle('is-open', open);
    item.querySelector('[data-faq-trigger]')?.setAttribute('aria-expanded', String(open));
  };

  for (const item of items) {
    item.querySelector('[data-faq-trigger]')?.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      for (const other of items) setOpen(other, false);
      setOpen(item, willOpen);
      // Page height changed: re-measure scroll-driven animations below the FAQ
      window.setTimeout(() => ScrollTrigger.refresh(), 450);
    });
  }
}
