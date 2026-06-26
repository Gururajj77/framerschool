import { isCoarsePointer, prefersReducedMotion } from './shared';

const LERP = 0.18;
const LERP_FRAME = 0.12;

export function initCursor(): (() => void) | void {
  if (prefersReducedMotion() || isCoarsePointer()) return;

  const site = document.querySelector('.pf-site');
  const root = document.querySelector<HTMLElement>('[data-cursor]');
  const frame = document.querySelector<HTMLElement>('[data-cursor-frame]');

  if (!site || !root || !frame) return;

  document.documentElement.classList.add('has-custom-cursor');
  site.classList.add('pf-site--custom-cursor');

  let tx = window.innerWidth / 2;
  let ty = window.innerHeight / 2;
  let cx = tx;
  let cy = ty;
  let fx = tx;
  let fy = ty;
  let visible = false;
  let raf = 0;

  const paint = () => {
    cx += (tx - cx) * LERP;
    cy += (ty - cy) * LERP;
    fx += (tx - fx) * LERP_FRAME;
    fy += (ty - fy) * LERP_FRAME;

    root.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    frame.style.transform = `translate3d(${fx - cx}px, ${fy - cy}px, 0)`;

    raf = requestAnimationFrame(paint);
  };

  const show = () => {
    if (visible) return;
    visible = true;
    root.classList.add('is-visible');
  };

  const onMove = (event: PointerEvent) => {
    tx = event.clientX;
    ty = event.clientY;
    show();
  };

  const onLeave = () => {
    visible = false;
    root.classList.remove('is-visible', 'is-hover');
  };

  const interactiveSelector =
    'a, button, [data-cursor-interactive], .pf-btn, .pf-nav-index-link, .pf-nav-overlay-link, .pf-faq-trigger, .pf-project-card, .pf-approach-cell, .pf-knotcms-cell';

  site.addEventListener(
    'pointerover',
    (event) => {
      const target = (event.target as Element).closest(interactiveSelector);
      if (!target || !site.contains(target)) return;
      root.classList.add('is-hover');
    },
    true,
  );

  site.addEventListener(
    'pointerout',
    (event) => {
      const pointerEvent = event as PointerEvent;
      const related = pointerEvent.relatedTarget as Element | null;
      if (related?.closest(interactiveSelector)) return;
      root.classList.remove('is-hover');
    },
    true,
  );

  raf = requestAnimationFrame(paint);
  window.addEventListener('pointermove', onMove, { passive: true });
  site.addEventListener('pointerenter', show);
  site.addEventListener('pointerleave', onLeave);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('pointermove', onMove);
    site.removeEventListener('pointerenter', show);
    site.removeEventListener('pointerleave', onLeave);
    document.documentElement.classList.remove('has-custom-cursor');
    site.classList.remove('pf-site--custom-cursor');
  };
}
