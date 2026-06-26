import { gsap, ScrollTrigger } from './shared';

export function initApproach(reduced: boolean): (() => void) | void {
  const section = document.querySelector('#approach');
  const sidebar = document.querySelector('[data-approach-sidebar]');
  const cells = gsap.utils.toArray<HTMLElement>('[data-approach-cell]');

  if (!section) return;

  if (reduced) {
    gsap.set([sidebar, ...cells], { clearProps: 'all', opacity: 1, y: 0 });
    return;
  }

  if (sidebar) {
    gsap.from(sidebar.children, {
      y: 24,
      opacity: 0,
      duration: 0.65,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sidebar,
        start: 'top 82%',
        once: true,
      },
    });
  }

  if (cells.length) {
    gsap.from(cells, {
      y: 20,
      opacity: 0,
      duration: 0.55,
      stagger: 0.07,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section.querySelector('[data-approach-grid]') ?? section,
        start: 'top 78%',
        once: true,
      },
    });
  }

  return () => {
    ScrollTrigger.getAll()
      .filter((st) => st.trigger && section.contains(st.trigger as Node))
      .forEach((st) => st.kill());
  };
}
