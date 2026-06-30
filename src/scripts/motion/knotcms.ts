import { gsap, ScrollTrigger } from './shared';

export function initKnotcms(reduced: boolean): (() => void) | void {
  const section = document.querySelector('#knotcms');
  const bridge = document.querySelector('[data-knot-bridge]');

  if (!section || !bridge) return;

  if (reduced) {
    gsap.set(section.querySelectorAll('[data-knot-source], [data-knot-dest], [data-knot-hub], [data-knot-feature]'), {
      clearProps: 'all',
      opacity: 1,
      y: 0,
    });
    return;
  }

  const st = gsap.from(
    section.querySelectorAll('[data-knot-source], [data-knot-dest], [data-knot-hub], [data-knot-feature]'),
    {
      y: 10,
      opacity: 0,
      duration: 0.5,
      stagger: 0.06,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: bridge,
        start: 'top 85%',
        once: true,
      },
    },
  );

  return () => {
    st.scrollTrigger?.kill();
    st.kill();
  };
}
