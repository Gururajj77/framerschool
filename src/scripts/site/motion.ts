import gsap from 'gsap';

/**
 * The cube controller.
 *
 * Six faces sit on a CSS 3D box. Turning order is the four sides, then the
 * top, then the bottom. Everything that changes the face goes through
 * `goTo`: the nav, the turn buttons, scrolling, clicking the stage, swiping,
 * the keyboard and the URL hash.
 *
 * On desktop the box is a cube. On tablets and phones the sides are taller
 * than they are wide and the top and bottom stay square, so the box is
 * pushed back by half of whichever depth faces the viewer.
 */

type Orientation = { rx: number; ry: number; cap: boolean };

/** Cube rotation that brings each face to the front, upright. */
const ORIENTATION: Record<string, Orientation> = {
  index: { rx: 0, ry: 0, cap: false },
  method: { rx: 0, ry: -90, cap: false },
  niches: { rx: 0, ry: -180, cap: false },
  learn: { rx: 0, ry: -270, cap: false },
  videos: { rx: -90, ry: 0, cap: true },
  contact: { rx: 90, ry: 0, cap: true },
};

/** Where each face sits on the box (same as home.css, which covers the first paint). */
const PLACEMENT: Record<string, string> = {
  index: 'translateZ(calc(var(--cw) / 2))',
  method: 'rotateY(90deg) translateZ(calc(var(--cw) / 2))',
  niches: 'rotateY(180deg) translateZ(calc(var(--cw) / 2))',
  learn: 'rotateY(-90deg) translateZ(calc(var(--cw) / 2))',
  videos: 'rotateX(90deg) translateZ(calc(var(--ch) / 2))',
  contact: 'rotateX(-90deg) translateZ(calc(var(--ch) / 2))',
};

const TURN = 0.9;
const WHEEL_THRESHOLD = 6;
const SWIPE_THRESHOLD = 40;
const TAP_TOLERANCE = 8;

const INTERACTIVE = 'a, button, input, textarea, select, iframe, summary, dialog';
const TYPING = 'input, textarea, select, [contenteditable]';

/** Nearest angle equal to `target` (mod 360) from `current`, so turns take the short way. */
function nearest(target: number, current: number): number {
  let angle = target;
  while (angle - current > 180) angle -= 360;
  while (angle - current < -180) angle += 360;
  return angle;
}

function canScroll(el: HTMLElement, direction: 1 | -1): boolean {
  if (el.scrollHeight - el.clientHeight < 2) return false;
  return direction > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0;
}

export function initCube(reduced: boolean): void {
  const stageEl = document.querySelector<HTMLElement>('[data-stage]');
  const cubeEl = stageEl?.querySelector<HTMLElement>('[data-cube]');
  const wrapEl = stageEl?.querySelector<HTMLElement>('[data-cube-wrap]');
  if (!stageEl || !cubeEl || !wrapEl) return;
  // Plain consts so the hoisted functions below keep the null check
  const stage: HTMLElement = stageEl;
  const cube: HTMLElement = cubeEl;
  const wrap: HTMLElement = wrapEl;
  const shadow = stage.querySelector<HTMLElement>('[data-cube-shadow]');

  const faces = Array.from(cube.querySelectorAll<HTMLElement>('[data-face]'));
  const bodies = faces.map((face) => face.querySelector<HTMLElement>('.face-body'));
  const ids = faces.map((face) => face.dataset.face ?? '');
  const links = Array.from(document.querySelectorAll<HTMLElement>('[data-face-link]'));
  const ticks = Array.from(document.querySelectorAll<HTMLElement>('[data-tick]'));
  const counter = document.querySelector<HTMLElement>('[data-progress-current]');
  const status = document.querySelector<HTMLElement>('[data-cube-status]');
  const count = faces.length;

  // The cube needs room. Under 500px tall (phones in landscape) the faces stack
  // as a normal page; the layout's inline script sets the starting mode.
  const root = document.documentElement;
  const roomy = window.matchMedia('(min-height: 500px)');
  const isCube = () => root.classList.contains('cube-mode');

  // Box size in px, read from the CSS variables via the wrap's layout size
  let width = wrap.offsetWidth;
  let height = wrap.offsetHeight;

  // `depth` is the push-back: half the box depth along the viewing axis
  const pose = { rx: 0, ry: 0, depth: width / 2 };
  const tilt = { x: 0, y: 0 };
  let index = 0;
  let turning = false;

  // Wheel state: one turn per gesture
  let wheelLocked = false;
  let quiet = 0;
  let faceScrolledAt = 0;

  const depthFor = (id: string) => (ORIENTATION[id]?.cap ? height / 2 : width / 2);

  // The box's rotation is written onto every face rather than onto the box
  // element. Chrome will not hit-test a face that sits edge-on to its parent
  // (the 90° sides), even after the parent turns it to the front, so links on
  // those faces would not take clicks.
  cube.style.transform = 'none';

  function render(): void {
    if (!isCube()) return;
    const turn =`translateZ(${-pose.depth}px) rotateX(${pose.rx + tilt.x}deg) rotateY(${pose.ry + tilt.y}deg)`;
    faces.forEach((face, i) => {
      face.style.transform = `${turn} ${PLACEMENT[ids[i]] ?? ''}`;
    });
  }

  /** Faces that genuinely overflow get touch scrolling; the rest swipe to turn. */
  function markScrollable(): void {
    for (const body of bodies) body?.classList.toggle('is-scrollable', !!body && body.scrollHeight > body.clientHeight + 1);
  }

  function activate(next: number): void {
    const id = ids[next];
    faces.forEach((face, i) => {
      const on = i === next;
      face.classList.toggle('is-active', on);
      face.toggleAttribute('inert', !on);
      face.setAttribute('aria-hidden', String(!on));
    });
    stage.classList.toggle('is-cap', ORIENTATION[id]?.cap ?? false);

    for (const link of links) {
      const on = link.dataset.faceLink === id;
      link.classList.toggle('is-active', on);
      if (!link.closest('[data-face-nav]')) continue;
      if (on) {
        link.setAttribute('aria-current', 'true');
        // The tablet/phone nav scrolls sideways; keep the active item in view
        const nav = link.closest<HTMLElement>('[data-face-nav]');
        if (nav && nav.scrollWidth > nav.clientWidth) {
          const left = link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2;
          nav.scrollTo({ left, behavior: reduced ? 'auto' : 'smooth' });
        }
      } else {
        link.removeAttribute('aria-current');
      }
    }

    ticks.forEach((tick) => tick.classList.toggle('is-active', tick.dataset.tick === id));
    if (counter) counter.textContent = String(next + 1).padStart(2, '0');
    if (status) status.textContent = `Face ${next + 1} of ${count}: ${faces[next].dataset.faceLabel ?? id}`;
    history.replaceState(null, '', `#${id}`);
  }

  function goTo(target: number, options: { focus?: boolean; instant?: boolean } = {}): void {
    const next = ((target % count) + count) % count;
    const instant = options.instant ?? reduced;
    if (!isCube()) return;
    if (next === index && !instant) return;

    const id = ids[next];
    const to = ORIENTATION[id] ?? ORIENTATION.index;
    const rx = nearest(to.rx, pose.rx);
    const ry = nearest(to.ry, pose.ry);
    const depth = depthFor(id);
    index = next;
    activate(next);

    gsap.killTweensOf(pose);
    gsap.killTweensOf(wrap);
    if (shadow) gsap.killTweensOf(shadow);

    const done = () => {
      turning = false;
      releaseWheel();
      if (options.focus) faces[next].focus({ preventScroll: true });
    };

    if (instant) {
      Object.assign(pose, { rx, ry, depth });
      render();
      gsap.set(wrap, { scale: 1 });
      if (shadow) gsap.set(shadow, { opacity: 1, scale: 1 });
      done();
      return;
    }

    turning = true;
    gsap.to(pose, { rx, ry, depth, duration: TURN, ease: 'power3.inOut', onUpdate: render, onComplete: done });

    // Pull back while turning, then land with a little overshoot
    gsap
      .timeline()
      .to(wrap, { scale: 0.8, duration: TURN * 0.45, ease: 'power2.out' })
      .to(wrap, { scale: 1, duration: TURN * 0.55, ease: 'back.out(1.6)' });

    // The hard shadow lifts off during the turn and slams back down
    if (shadow) {
      gsap
        .timeline()
        .to(shadow, { opacity: 0, scale: 0.8, duration: TURN * 0.3, ease: 'power2.out' })
        .to(shadow, { opacity: 1, scale: 1, duration: 0.25, ease: 'power3.out' }, TURN * 0.85);
    }
  }

  const step = (direction: 1 | -1, options?: { focus?: boolean }) => goTo(index + direction, options);

  // ----- Switching between the cube and the stacked page
  function enterCube(): void {
    root.classList.add('cube-mode');
    width = wrap.offsetWidth;
    height = wrap.offsetHeight;
    const fromHash = ids.indexOf(location.hash.slice(1));
    if (fromHash >= 0) index = fromHash;
    goTo(index, { instant: true });
    markScrollable();
  }

  function leaveCube(): void {
    root.classList.remove('cube-mode');
    gsap.killTweensOf([pose, wrap, tilt]);
    if (shadow) gsap.killTweensOf(shadow);
    gsap.set(wrap, { clearProps: 'transform' });
    stage.classList.remove('is-cap');
    for (const face of faces) {
      face.style.transform = '';
      face.removeAttribute('inert');
      face.removeAttribute('aria-hidden');
    }
    // Land the reader on the section they were looking at
    faces[index].scrollIntoView({ block: 'start' });
  }

  roomy.addEventListener('change', (event) => (event.matches ? enterCube() : leaveCube()));

  // ----- Start on the face named in the URL
  if (isCube()) enterCube();

  window.addEventListener('hashchange', () => {
    const target = ids.indexOf(location.hash.slice(1));
    if (target >= 0 && target !== index) goTo(target, { focus: true });
  });

  // Window size changes the box size: re-read it and snap to the current face
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (!isCube()) return;
      width = wrap.offsetWidth;
      height = wrap.offsetHeight;
      gsap.killTweensOf(pose);
      pose.depth = depthFor(ids[index]);
      render();
      markScrollable();
    }, 120);
  });
  document.fonts?.ready.then(markScrollable);

  // ----- Nav and in-face buttons that name a face.
  // On the stacked page they stay ordinary anchor links.
  for (const link of links) {
    link.addEventListener('click', (event) => {
      if (!isCube()) return;
      const target = ids.indexOf(link.dataset.faceLink ?? '');
      if (target < 0) return;
      event.preventDefault();
      goTo(target, { focus: true });
    });
  }

  document.querySelector('[data-cube-prev]')?.addEventListener('click', () => step(-1));
  document.querySelector('[data-cube-next]')?.addEventListener('click', () => step(1));

  // ----- Keyboard: arrows, Page Up/Down, Space, Home/End, 1–6
  window.addEventListener('keydown', (event) => {
    if (!isCube() || event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target as Element;
    if (target.closest(TYPING) || target.closest('dialog[open]')) return;

    const digit = Number(event.key);
    if (Number.isInteger(digit) && digit >= 1 && digit <= count) {
      event.preventDefault();
      goTo(digit - 1, { focus: true });
      return;
    }

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
        event.preventDefault();
        step(1, { focus: true });
        break;
      case ' ':
        if (target.closest('a, button')) return; // Space presses the focused button
        event.preventDefault();
        step(1, { focus: true });
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        event.preventDefault();
        step(-1, { focus: true });
        break;
      case 'Home':
        event.preventDefault();
        goTo(0, { focus: true });
        break;
      case 'End':
        event.preventDefault();
        goTo(count - 1, { focus: true });
        break;
    }
  });

  // ----- Wheel and trackpad: one turn per gesture.
  // A face that can still scroll scrolls first; momentum after that is ignored.
  function releaseWheel(): void {
    if (!turning && !quiet) wheelLocked = false;
  }

  stage.addEventListener('scroll', () => (faceScrolledAt = performance.now()), { capture: true, passive: true });

  window.addEventListener(
    'wheel',
    (event) => {
      if (!isCube() || (event.target as Element).closest?.('dialog[open]')) return;
      const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (Math.abs(delta) < WHEEL_THRESHOLD) return;
      const direction: 1 | -1 = delta > 0 ? 1 : -1;

      const body = bodies[index];
      if (body && body.contains(event.target as Node) && canScroll(body, direction)) return;
      if (performance.now() - faceScrolledAt < 450) return;

      event.preventDefault();
      window.clearTimeout(quiet);
      quiet = window.setTimeout(() => {
        quiet = 0;
        releaseWheel();
      }, 220);

      if (wheelLocked) return;
      wheelLocked = true;
      step(direction);
    },
    { passive: false },
  );

  // ----- Pointer: tap the stage to go to the next face, swipe in any direction
  let downX = 0;
  let downY = 0;
  let downTarget: Element | null = null;

  stage.addEventListener('pointerdown', (event) => {
    if (!isCube() || !event.isPrimary) return;
    downX = event.clientX;
    downY = event.clientY;
    downTarget = event.target as Element;
  });

  stage.addEventListener('pointercancel', () => (downTarget = null));

  stage.addEventListener('pointerup', (event) => {
    if (!downTarget || !event.isPrimary) return;
    const target = downTarget;
    downTarget = null;
    const dx = event.clientX - downX;
    const dy = event.clientY - downY;

    // Swipe: left or up goes forward, right or down goes back
    if (event.pointerType !== 'mouse' && Math.max(Math.abs(dx), Math.abs(dy)) > SWIPE_THRESHOLD) {
      const horizontal = Math.abs(dx) > Math.abs(dy);
      step(horizontal ? (dx < 0 ? 1 : -1) : dy < 0 ? 1 : -1);
      return;
    }

    if (Math.hypot(dx, dy) > TAP_TOLERANCE || event.button !== 0) return;
    if (target.closest(INTERACTIVE)) return;
    step(1);
  });

  // ----- Mouse parallax on the background so the box reads as an object.
  // It settles flat over the box, so links and text hold still under the cursor.
  if (!reduced) {
    let overBox = false;
    const settle = () => gsap.to(tilt, { x: 0, y: 0, duration: 0.5, ease: 'power2.out', onUpdate: render });

    stage.addEventListener('pointermove', (event) => {
      if (!isCube() || event.pointerType !== 'mouse') return;
      if ((event.target as Element).closest('[data-cube-wrap]')) {
        if (!overBox) settle();
        overBox = true;
        return;
      }
      overBox = false;
      gsap.killTweensOf(tilt);
      const rect = stage.getBoundingClientRect();
      tilt.y = ((event.clientX - rect.left) / rect.width - 0.5) * 4;
      tilt.x = -((event.clientY - rect.top) / rect.height - 0.5) * 4;
      if (!turning) render();
    });
    stage.addEventListener('pointerleave', settle);
  }

  // A video starting makes its face taller inside; re-check scrolling then
  document.addEventListener('cube:content-changed', markScrollable);
}
