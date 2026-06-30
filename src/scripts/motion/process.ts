import { batchReveal } from './shared';

export function initProcess(reduced: boolean): void {
  if (reduced) return;

  batchReveal('#process .pf-section-head, [data-process-card]');
}
