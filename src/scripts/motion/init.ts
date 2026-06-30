import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './shared';
import { initHero } from './hero';
import { initProcess } from './process';
import { initApproach } from './approach';
import { initFeatures } from './features';
import { initKnotcms } from './knotcms';
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
  cleanups.push(initProcess(reduced));
  cleanups.push(initFeatures(reduced));
  cleanups.push(initApproach(reduced));
  cleanups.push(initKnotcms(reduced));
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
