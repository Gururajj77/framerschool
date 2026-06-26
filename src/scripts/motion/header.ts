import { gsap } from './shared';

export function initHeader(reduced: boolean): (() => void) | void {
  const topbar = document.querySelector('[data-topbar]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const overlay = document.querySelector('[data-nav-overlay]');
  const mobileLabel = document.querySelector('[data-nav-mobile-label]');
  const indexLinks = gsap.utils.toArray<HTMLAnchorElement>('.pf-nav-index-link');
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

  const isDesktopNav = () => window.matchMedia('(min-width: 901px)').matches;

  toggle?.addEventListener('click', () => {
    if (isDesktopNav()) return;
    if (topbar.classList.contains('nav-open')) closeMenu();
    else openMenu();
  });

  overlayLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  const sectionLinks = indexLinks
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
    indexLinks.forEach((navLink) => {
      navLink.classList.remove('is-active');
      navLink.removeAttribute('aria-current');
    });
    if (!link) return;
    link.classList.add('is-active');
    link.setAttribute('aria-current', 'page');
    const label = link.dataset.navLabel ?? link.querySelector('.pf-nav-index-label')?.textContent;
    if (mobileLabel && label) mobileLabel.textContent = label;
  };

  const setActiveNav = () => {
    const offset = (topbar as HTMLElement).offsetHeight + 16;
    let active: (typeof sectionLinks)[number] | null = null;

    for (const entry of sectionLinks) {
      const rect = entry.section.getBoundingClientRect();
      if (rect.top <= offset && rect.bottom > offset) {
        active = entry;
        break;
      }
    }

    if (!active) {
      for (const entry of sectionLinks) {
        if (entry.section.getBoundingClientRect().top <= offset) active = entry;
      }
    }

    setActiveLink(active?.link ?? null);

    if (!active && mobileLabel) {
      mobileLabel.textContent = 'Home';
    }
  };

  const onScroll = () => {
    topbar.classList.toggle('is-scrolled', window.scrollY > 8);
    setActiveNav();
  };

  const onResize = () => {
    if (isDesktopNav()) closeMenu();
    setActiveNav();
  };

  setActiveNav();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);

  indexLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
      const href = link.getAttribute('href') ?? '';
      if (href.startsWith('#')) setActiveLink(link);
    });
  });

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
  };
}
