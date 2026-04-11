import { createHash } from 'node:crypto';
import type { ApprovalEnvelope } from '../schemas/core.js';

export function createScopeHash(payload: unknown): string {
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

export function verifyApprovalScope(approval: ApprovalEnvelope | undefined, payload: unknown): boolean {
  if (!approval?.scopeHash) return false;
  return approval.scopeHash === createScopeHash(payload);
}
