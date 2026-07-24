import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './shared';
import { initHero } from './hero';
import { initContrast } from './contrast';
import { initMethod } from './method';
import { initPillars } from './pillars';
import { initBuilds } from './builds';
import { initPhilosophy } from './philosophy';
import { initFaq, initCta, initFooter } from './faq';
import { initHeader } from './header';
import { initSmoothScroll } from './smooth-scroll';

gsap.registerPlugin(ScrollTrigger);

document.documentElement.classList.add('js');

const reduced = prefersReducedMotion();
const cleanups: Array<(() => void) | void> = [];

function boot() {
  cleanups.push(initSmoothScroll());
  cleanups.push(initHeader(reduced));
  cleanups.push(initHero(reduced));
  initContrast(reduced);
  initMethod(reduced);
  initPillars(reduced);
  initBuilds(reduced);
  initPhilosophy(reduced);
  cleanups.push(initFaq(reduced));
  cleanups.push(initCta(reduced));
  initFooter(reduced);

  ScrollTrigger.refresh();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

window.addEventListener('load', () => ScrollTrigger.refresh());

const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: reduce)', () => {
  return () => {
    ScrollTrigger.getAll().forEach((st) => st.kill());
  };
});

export {};
