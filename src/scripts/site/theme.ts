/**
 * Light / dark toggle. The layout's inline script picks the starting theme
 * before first paint; this keeps the toggle, the saved choice and the
 * browser chrome colour in step afterwards.
 */
const KEY = 'fs-theme';
const CHROME = { light: '#fff4e0', dark: '#121212' } as const;

type Theme = keyof typeof CHROME;

function saved(): Theme | null {
  try {
    const value = localStorage.getItem(KEY);
    return value === 'dark' || value === 'light' ? value : null;
  } catch {
    return null;
  }
}

export function initTheme(): void {
  const root = document.documentElement;
  const toggles = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]'));
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  const system = window.matchMedia('(prefers-color-scheme: dark)');

  const apply = (theme: Theme) => {
    root.dataset.theme = theme;
    meta?.setAttribute('content', CHROME[theme]);
    for (const toggle of toggles) toggle.setAttribute('aria-pressed', String(theme === 'dark'));
  };

  apply(root.dataset.theme === 'dark' ? 'dark' : 'light');

  for (const toggle of toggles) {
    toggle.addEventListener('click', () => {
      const next: Theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(next);
      try {
        localStorage.setItem(KEY, next);
      } catch {
        // Private mode or blocked storage: the choice lasts until the page reloads
      }
    });
  }

  // Follow the device setting until the visitor picks a theme themselves
  system.addEventListener('change', (event) => {
    if (!saved()) apply(event.matches ? 'dark' : 'light');
  });
}
