import { gsap, ScrollTrigger } from './shared';

export function initKnotcms(reduced: boolean): (() => void) | void {
  const section = document.querySelector('#knotcms');
  const bridge = document.querySelector('[data-knot-bridge]');
  const source = document.querySelector('[data-knot-source]');
  const dest = document.querySelector('[data-knot-dest]');
  const hub = document.querySelector('[data-knot-hub]');
  const cells = gsap.utils.toArray<HTMLElement>('[data-knot-feature]');
  const particles = gsap.utils.toArray<HTMLElement>('[data-flow-particle]');

  if (!section || !bridge) return;

  if (reduced) {
    gsap.set([source, dest, hub, ...cells], {
      clearProps: 'all',
      opacity: 1,
      x: 0,
      scale: 1,
      y: 0,
    });
    gsap.set(particles, { opacity: 0 });
    return;
  }

  gsap.set(source, { x: -48, opacity: 0 });
  gsap.set(dest, { x: 48, opacity: 0 });
  gsap.set(hub, { scale: 0.6, opacity: 0 });

  const enterTl = gsap.timeline({
    scrollTrigger: {
      trigger: bridge,
      start: 'top 80%',
      once: true,
    },
  });

  enterTl
    .to(source, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
    .to(dest, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.1)
    .to(hub, { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.6)' }, 0.25)
    .from(cells, { y: 16, opacity: 0, duration: 0.45, stagger: 0.08, ease: 'power2.out' }, 0.35);

  let particleLoop: gsap.core.Timeline | null = null;

  ScrollTrigger.create({
    trigger: section,
    start: 'top 70%',
    end: 'bottom 30%',
    onEnter: () => {
      if (particleLoop) return;
      particleLoop = gsap.timeline({ repeat: -1 });
      particles.forEach((particle, i) => {
        const isLeft = particle.hasAttribute('data-flow-left');
        gsap.set(particle, { opacity: 0, x: isLeft ? -80 : 80 });
        particleLoop!.to(
          particle,
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power1.inOut',
          },
          i * 0.35,
        );
        particleLoop!.to(
          particle,
          {
            opacity: 0,
            x: isLeft ? 80 : -80,
            duration: 0.8,
            ease: 'power1.inOut',
          },
          i * 0.35 + 0.8,
        );
      });

      gsap.to(hub, {
        scale: 1.06,
        duration: 0.35,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
        delay: 0.6,
      });
    },
    onLeave: () => {
      particleLoop?.kill();
      particleLoop = null;
      gsap.set(particles, { opacity: 0 });
    },
    onEnterBack: () => {
      if (particleLoop) return;
      particleLoop = gsap.timeline({ repeat: -1 });
      particles.forEach((particle, i) => {
        const isLeft = particle.hasAttribute('data-flow-left');
        gsap.set(particle, { opacity: 0, x: isLeft ? -80 : 80 });
        particleLoop!.to(
          particle,
          { opacity: 1, x: 0, duration: 0.8, ease: 'power1.inOut' },
          i * 0.35,
        );
        particleLoop!.to(
          particle,
          { opacity: 0, x: isLeft ? 80 : -80, duration: 0.8, ease: 'power1.inOut' },
          i * 0.35 + 0.8,
        );
      });
    },
    onLeaveBack: () => {
      particleLoop?.kill();
      particleLoop = null;
      gsap.set(particles, { opacity: 0 });
    },
  });

  return () => {
    enterTl.scrollTrigger?.kill();
    enterTl.kill();
    particleLoop?.kill();
  };
}
