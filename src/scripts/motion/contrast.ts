import { batchReveal } from './shared';

export function initContrast(reduced: boolean): void {
  if (reduced) return;
  batchReveal('#contrast .pf-section-head, [data-contrast-cell]');
}
