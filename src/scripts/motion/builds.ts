import { gsap } from './shared';

export function initBuilds(reduced: boolean): void {
  const tabs = gsap.utils.toArray<HTMLButtonElement>('[data-build-tab]');
  const panels = gsap.utils.toArray<HTMLElement>('[data-build-panel]');

  if (tabs.length === 0 || panels.length === 0) return;

  const activate = (index: number) => {
    tabs.forEach((tab, i) => {
      const on = i === index;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    panels.forEach((panel, i) => {
      const on = i === index;
      panel.classList.toggle('is-active', on);
      panel.hidden = !on;
    });

    const active = panels[index];
    if (!reduced && active) {
      gsap.fromTo(
        active,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
      );
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const index = Number(tab.dataset.index ?? 0);
      activate(index);
    });
  });
}
