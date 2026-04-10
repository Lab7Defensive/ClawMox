import { randomUUID } from 'node:crypto';

export function createCorrelationId(prefix = 'clawmox'): string {
  return `${prefix}-${randomUUID()}`;
}
