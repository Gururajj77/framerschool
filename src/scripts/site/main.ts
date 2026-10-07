import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initSmoothScroll } from './smooth-scroll';
import { initMenu } from './menu';
import { initFaq } from './faq';
import { initCarousel } from './carousel';
import { initMotion } from './motion';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

initSmoothScroll(reduced);
initMenu();
initFaq();
initCarousel();
initMotion(reduced);

// Fonts and images change layout after load; re-measure scroll positions
window.addEventListener('load', () => ScrollTrigger.refresh());
document.fonts?.ready.then(() => ScrollTrigger.refresh());
