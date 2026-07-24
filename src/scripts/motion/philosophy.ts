import { batchReveal } from './shared';

export function initPhilosophy(reduced: boolean): void {
  if (reduced) return;
  batchReveal('#philosophy .pf-section-head, [data-philosophy-item]');
}
