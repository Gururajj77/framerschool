import { batchReveal } from './shared';

export function initMethod(reduced: boolean): void {
  if (reduced) return;
  batchReveal('#method .pf-section-head, [data-method-step]');
}
