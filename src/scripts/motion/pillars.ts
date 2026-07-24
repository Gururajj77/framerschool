import { batchReveal } from './shared';

export function initPillars(reduced: boolean): void {
  if (reduced) return;
  batchReveal('#pillars .pf-section-head, [data-pillar]');
}
