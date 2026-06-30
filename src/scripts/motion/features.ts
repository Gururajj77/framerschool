import { batchReveal } from './shared';

export function initFeatures(reduced: boolean): void {
  if (reduced) return;

  batchReveal('#features .pf-section-head, [data-program-card]');
}
