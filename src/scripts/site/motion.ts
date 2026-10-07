import gsap from 'gsap';

const EASE = 'expo.out';

const all = (selector: string) => Array.from(document.querySelectorAll<HTMLElement>(selector));

/** Page load: header drops in, hero lines rise out of their masks. */
function intro(): void {
  const part = (name: string) => all(`[data-intro="${name}"]`);
  const nav = part('nav');
  const bg = part('bg');
  const masked = [...part('kicker'), ...part('line-1'), ...part('line-2'), ...part('caption')];
  const media = part('media');
  const foot = part('foot');

  if (nav.length) gsap.set(nav, { y: -10, opacity: 0 });
  if (bg.length) gsap.set(bg, { scale: 0, opacity: 0 });
  if (masked.length) gsap.set(masked, { yPercent: 100 });
  if (media.length || foot.length) gsap.set([...media, ...foot], { y: 120, opacity: 0 });
  document.documentElement.classList.remove('intro-pending');

  const tl = gsap.timeline({ defaults: { ease: EASE, duration: 1.2 } });
  if (bg.length) tl.to(bg, { scale: 1, opacity: 1, duration: 1.6 }, 0.1);
  if (nav.length) tl.to(nav, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.04 }, 0.4);
  tl.to(part('kicker'), { yPercent: 0 }, 0.1)
    .to(part('line-1'), { yPercent: 0 }, 0.3)
    .to(media, { y: 0, opacity: 1 }, 0.3)
    .to(part('line-2'), { yPercent: 0 }, 0.7)
    .to(part('caption'), { yPercent: 0 }, 0.8)
    .to(foot, { y: 0, opacity: 1 }, 0.9);
}

/** Headings rise out of masks; blocks slide up and fade in as they enter. */
function reveals(): void {
  for (const el of all('[data-reveal="mask"]')) {
    gsap.from(el, {
      yPercent: 100,
      duration: 1.2,
      ease: EASE,
      scrollTrigger: { trigger: el.parentElement ?? el, start: 'top 90%', once: true },
    });
  }

  for (const el of all('[data-reveal]:not([data-reveal="mask"])')) {
    gsap.from(el, {
      y: 80,
      opacity: 0,
      duration: 1.2,
      ease: EASE,
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  }
}

/** Build card media: four blinds fold away when the card is in view. */
function blinds(reduced: boolean): void {
  const media = all('[data-blinds]');
  if (reduced || !('IntersectionObserver' in window)) {
    media.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.35 },
  );
  media.forEach((el) => observer.observe(el));
}

function scrollScenes(): void {
  const mm = gsap.matchMedia();

  // Desktop hero: the media tile grows to fill the screen while you scroll
  mm.add('(min-width: 1200px)', () => {
    const media = document.querySelector<HTMLElement>('[data-hero-media]');
    const spacer = document.querySelector<HTMLElement>('[data-hero-scroll]');
    if (!media || !spacer) return;

    gsap.to(media, {
      scale: 5.6,
      y: () => spacer.offsetHeight - 40,
      ease: 'none',
      scrollTrigger: {
        trigger: spacer,
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });
  });

  // Learn list: each pillar opens up as it crosses the middle of the screen
  mm.add({ wide: '(min-width: 768px)', narrow: '(max-width: 767.98px)' }, (context) => {
    const { wide } = context.conditions as { wide: boolean };
    const shift = wide ? 48 : 12;
    const grow = wide ? 1.4 : 1;

    for (const item of all('[data-pillar]')) {
      const before = item.querySelector('[data-pillar-before]');
      const after = item.querySelector('[data-pillar-after]');
      const tile = item.querySelector('[data-pillar-tile]');
      if (!before || !after || !tile) continue;

      const rest = { opacity: 0.4, scale: 1 };
      gsap
        .timeline({
          scrollTrigger: { trigger: item, start: 'top 85%', end: 'bottom 15%', scrub: 0.5 },
        })
        .fromTo(before, { x: shift, ...rest }, { x: 0, opacity: 1, scale: grow, ease: 'power2.out' }, 0)
        .fromTo(after, { x: -shift, ...rest }, { x: 0, opacity: 1, scale: grow, ease: 'power2.out' }, 0)
        .fromTo(tile, { scale: 0 }, { scale: 1, ease: 'power2.out' }, 0)
        .to(before, { x: shift, ...rest, ease: 'power2.in' }, 1.4)
        .to(after, { x: -shift, ...rest, ease: 'power2.in' }, 1.4)
        .to(tile, { scale: 0, ease: 'power2.in' }, 1.4);
    }
  });

  // CTA grows from half size as it arrives, then stays pinned under the footer
  mm.add('(min-width: 768px)', () => {
    const cta = document.querySelector<HTMLElement>('[data-cta]');
    const stage = document.querySelector<HTMLElement>('[data-cta-stage]');
    if (!cta || !stage) return;

    gsap.fromTo(
      stage,
      { scale: 0.5, opacity: 0.5 },
      {
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger: cta, start: 'top bottom', end: 'top top', scrub: true },
      },
    );
  });
}

export function initMotion(reduced: boolean): void {
  blinds(reduced);
  if (reduced) {
    document.documentElement.classList.remove('intro-pending');
    return;
  }

  intro();
  reveals();
  scrollScenes();
}
