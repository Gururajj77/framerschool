export function initCarousel(): void {
  for (const root of document.querySelectorAll<HTMLElement>('[data-carousel]')) {
    const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-slide]'));
    const counter = root.querySelector<HTMLElement>('[data-carousel-current]');
    if (slides.length < 2) continue;

    let index = 0;
    const show = (next: number) => {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
      if (counter) counter.textContent = String(index + 1).padStart(2, '0');
    };

    root.querySelector('[data-carousel-prev]')?.addEventListener('click', () => show(index - 1));
    root.querySelector('[data-carousel-next]')?.addEventListener('click', () => show(index + 1));
  }
}
