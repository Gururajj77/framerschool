async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers and non-secure contexts: copy through a hidden textarea
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.append(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    return copied;
  }
}

/** "Copy address" buttons: copy their data-copy value and confirm in place. */
export function initCopy(): void {
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-copy]')) {
    const label = button.querySelector<HTMLElement>('[data-copy-label]');
    const status = button.parentElement?.querySelector<HTMLElement>('[data-copy-status]');
    const original = label?.textContent ?? '';
    let reset: number | undefined;

    button.addEventListener('click', async () => {
      const text = button.dataset.copy ?? '';
      const copied = await copyText(text);

      if (label) label.textContent = copied ? 'Copied' : 'Copy failed';
      if (status) status.textContent = copied ? 'Email address copied' : `Could not copy. The address is ${text}`;

      // Leave a failure up longer so it can be read
      window.clearTimeout(reset);
      reset = window.setTimeout(
        () => {
          if (label) label.textContent = original;
          if (status) status.textContent = '';
        },
        copied ? 2000 : 6000,
      );
    });
  }
}
