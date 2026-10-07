/** Quick answers dialog, opened from the Contact face. */
export function initAnswers(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-answers]');
  if (!dialog) return;

  let opener: HTMLElement | null = null;

  for (const button of document.querySelectorAll<HTMLElement>('[data-answers-open]')) {
    button.addEventListener('click', () => {
      opener = button;
      dialog.showModal();
    });
  }

  dialog.querySelector('[data-answers-close]')?.addEventListener('click', () => dialog.close());

  // Clicking the backdrop closes it
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener('close', () => opener?.focus());
}
