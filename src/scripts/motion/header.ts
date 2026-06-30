import { gsap } from './shared';
import { getScrollY } from './smooth-scroll';

export function initHeader(reduced: boolean): (() => void) | void {
  const topbar = document.querySelector('[data-topbar]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const overlay = document.querySelector('[data-nav-overlay]');
  const navLinks = gsap.utils.toArray<HTMLAnchorElement>('.pf-topbar-link');
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

  const findNavLinkForHref = (href: string) =>
    navLinks.find((link) => link.getAttribute('href') === href) ?? null;

  const getNavOffset = () => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--pf-topbar-height').trim();
    const value = parseFloat(raw);
    return (Number.isFinite(value) ? value : 72) + 8;
  };

  let lockedNavHref: string | null = null;

  const setActiveLink = (link: HTMLAnchorElement | null) => {
    navLinks.forEach((navLink) => {
      navLink.classList.remove('is-active');
      navLink.removeAttribute('aria-current');
    });
    if (!link) return;
    link.classList.add('is-active');
    link.setAttribute('aria-current', 'page');
  };

  const hasReachedSection = (href: string) => {
    const section = document.querySelector<HTMLElement>(href);
    if (!section) return true;
    const offset = getNavOffset();
    return Math.abs(section.getBoundingClientRect().top - offset) <= 12;
  };

  const setActiveNav = () => {
    if (lockedNavHref) {
      const lockedLink = findNavLinkForHref(lockedNavHref);
      if (lockedLink) setActiveLink(lockedLink);
      if (hasReachedSection(lockedNavHref)) lockedNavHref = null;
      return;
    }

    const offset = getNavOffset() + 16;
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
  };

  const onScroll = () => {
    topbar.classList.toggle('is-scrolled', getScrollY() > 8);
    setActiveNav();
  };

  const onNavClick = (href: string) => {
    if (!findNavLinkForHref(href)) return;
    lockedNavHref = href;
    setActiveLink(findNavLinkForHref(href));
  };

  const onResize = () => {
    closeMenu();
    setActiveNav();
  };

  setActiveNav();
  document.addEventListener('pf-scroll', onScroll);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
      const href = link.getAttribute('href') ?? '';
      if (href.startsWith('#')) onNavClick(href);
    });
  });

  overlayLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href') ?? '';
      if (href.startsWith('#')) onNavClick(href);
    });
  });

  return () => {
    document.removeEventListener('pf-scroll', onScroll);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
  };
}
