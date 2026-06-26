import { gsap, ScrollTrigger } from './shared';
import { batchReveal } from './shared';

export function initFaq(reduced: boolean): (() => void) | void {
  const items = gsap.utils.toArray<HTMLElement>('[data-faq-item]');
  const header = document.querySelector('[data-faq-header]');

  if (header && !reduced) {
    gsap.from(header.children, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        once: true,
      },
    });
  }

  batchReveal('[data-faq-item]', { start: 'top 92%' });

  if (items.length === 0) return;

  const closeItem = (item: HTMLElement) => {
    const panel = item.querySelector<HTMLElement>('[data-faq-panel]');
    const inner = item.querySelector<HTMLElement>('.pf-faq-panel-inner');
    const toggle = item.querySelector('[data-faq-toggle]');
    const icon = item.querySelector('.pf-faq-toggle svg');

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
    if (icon) gsap.to(icon, { rotation: 0, duration: reduced ? 0 : 0.3 });
  };

  const openItem = (item: HTMLElement) => {
    const panel = item.querySelector<HTMLElement>('[data-faq-panel]');
    const inner = item.querySelector<HTMLElement>('.pf-faq-panel-inner');
    const toggle = item.querySelector('[data-faq-toggle]');
    const icon = item.querySelector('.pf-faq-toggle svg');

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
    if (icon) gsap.to(icon, { rotation: 45, duration: reduced ? 0 : 0.3 });
  };

  const setOpen = (item: HTMLElement, open: boolean) => {
    if (open) openItem(item);
    else closeItem(item);
  };

  items.forEach((item) => {
    const panel = item.querySelector<HTMLElement>('[data-faq-panel]');
    const inner = item.querySelector<HTMLElement>('.pf-faq-panel-inner');
    const toggle = item.querySelector('[data-faq-toggle]');

    if (!panel || !inner || !toggle) return;

    if (item.classList.contains('open')) {
      gsap.set(panel, { height: inner.offsetHeight });
      const icon = item.querySelector('.pf-faq-toggle svg');
      if (icon) gsap.set(icon, { rotation: 45 });
    } else {
      gsap.set(panel, { height: 0 });
    }

    toggle.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach((other) => {
        if (other !== item) closeItem(other);
      });
      setOpen(item, !isOpen);
    });
  });

  return () => {
    // listeners are on DOM nodes that persist
  };
}

export function initCta(reduced: boolean): (() => void) | void {
  const email = document.querySelector('[data-cta-panel]');
  const contactSection = document.querySelector('.pf-contact-title');

  if (!email) return;

  if (reduced) {
    gsap.set(email, { clearProps: 'all', opacity: 1, y: 0 });
    return;
  }

  gsap.set(email, { y: 20, opacity: 0 });

  const st = gsap.to(email, {
    y: 0,
    opacity: 1,
    duration: 0.7,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: email,
      start: 'top 88%',
      once: true,
    },
  });

  if (contactSection) {
    gsap.from(contactSection.querySelectorAll('span'), {
      y: 40,
      opacity: 0,
      duration: 0.75,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: contactSection,
        start: 'top 85%',
        once: true,
      },
    });
  }

  return () => {
    st.kill();
  };
}

export function initFooter(reduced: boolean): void {
  if (reduced) return;
  batchReveal('.pf-footer-nav a, .pf-footer-legal a, .pf-footer-copy');
}
