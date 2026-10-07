import { getLenis } from './smooth-scroll';

export function initMenu(): void {
  const sheet = document.querySelector<HTMLElement>('[data-menu]');
  const openButton = document.querySelector<HTMLButtonElement>('[data-menu-open]');
  const closeButton = sheet?.querySelector<HTMLButtonElement>('[data-menu-close]');
  if (!sheet || !openButton || !closeButton) return;

  const focusables = () => Array.from(sheet.querySelectorAll<HTMLElement>('a[href], button'));

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      close();
      return;
    }
    if (event.key !== 'Tab') return;

    // Keep focus inside the open menu
    const items = focusables();
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  function open() {
    sheet!.hidden = false;
    openButton!.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('menu-open');
    getLenis()?.stop();
    closeButton!.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function close(returnFocus = true) {
    sheet!.hidden = true;
    openButton!.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('menu-open');
    getLenis()?.start();
    document.removeEventListener('keydown', onKeydown);
    if (returnFocus) openButton!.focus();
  }

  openButton.addEventListener('click', open);
  closeButton.addEventListener('click', () => close());

  // A link in the menu closes it; the smooth-scroll handler then takes over
  sheet.addEventListener('click', (event) => {
    if ((event.target as Element).closest('a')) close(false);
  });

  window.matchMedia('(min-width: 768px)').addEventListener('change', (event) => {
    if (event.matches && !sheet.hidden) close(false);
  });
}
