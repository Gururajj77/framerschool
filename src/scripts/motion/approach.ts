import { batchReveal } from './shared';

export function initApproach(reduced: boolean): void {
  if (reduced) return;

  batchReveal('#approach .pf-section-head, [data-approach-cell]');
}
