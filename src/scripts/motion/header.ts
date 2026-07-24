import { gsap } from './shared';
import { getScrollY } from './smooth-scroll';

export function initHeader(reduced: boolean): (() => void) | void {
  const topbar = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const overlay = document.querySelector('[data-nav-overlay]');
  const navLinks = gsap.utils.toArray<HTMLAnchorElement>('.fs-nav-link');
  const overlayLinks = gsap.utils.toArray<HTMLAnchorElement>('[data-nav-overlay-link]');

  if (!topbar) return;

  const closeMenu = () => {
    topbar.classList.remove('nav-open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Open menu');
    overlay?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('nav-locked');
  };

  const openMenu = () => {
    topbar.classList.add('nav-open');
    toggle?.setAttribute('aria-expanded', 'true');
    toggle?.setAttribute('aria-label', 'Close menu');
    overlay?.setAttribute('aria-hidden', 'false');
    document.body.classList.add('nav-locked');
  };

  toggle?.addEventListener('click', () => {
    if (topbar.classList.contains('nav-open')) closeMenu();
    else openMenu();
  });

  overlayLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  const sectionLinks = navLinks
    .map((link) => {
      const href = link.getAttribute('href') ?? '';
      const id = href.startsWith('#') ? href.slice(1) : null;
      const section = id ? document.getElementById(id) : null;
      return section ? { link, section } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a!.section.offsetTop - b!.section.offsetTop) as Array<{
    link: HTMLAnchorElement;
    section: HTMLElement;
  }>;

  const setActiveLink = (link: HTMLAnchorElement | null) => {
    navLinks.forEach((navLink) => {
      navLink.classList.remove('is-active');
    });
    link?.classList.add('is-active');
  };

  const setActiveNav = () => {
    const offset = 80;
    let active: (typeof sectionLinks)[number] | null = null;

    for (const entry of sectionLinks) {
      if (entry.section.getBoundingClientRect().top <= offset) active = entry;
    }

    setActiveLink(active?.link ?? null);
  };

  const onScroll = () => {
    const y = getScrollY();
    const hero = document.querySelector('#home');
    const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
    topbar.classList.toggle('is-scrolled', y > 12 && heroBottom < 48);
    setActiveNav();
  };

  const onResize = () => {
    closeMenu();
    setActiveNav();
  };

  setActiveNav();
  onScroll();
  document.addEventListener('pf-scroll', onScroll);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  return () => {
    document.removeEventListener('pf-scroll', onScroll);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
  };
}
