import type { RiskTier } from '../types/contracts.js';

export function classifyRisk(action: string): RiskTier {
  if (action.startsWith('get_') || action.startsWith('list_')) return 0;
  if (['start_guest', 'stop_guest', 'create_snapshot', 'terraform-plan', 'ansible-check'].includes(action)) return 1;
  if (['reboot_guest', 'clone_vm_from_template', 'create_lxc_from_profile', 'terraform-apply', 'ansible-apply', 'host-maintenance'].includes(action)) return 2;
  return 3;
}

export function requiresApproval(risk: RiskTier, environment: 'lab' | 'staging' | 'production'): boolean {
  if (risk >= 3) return true;
  if (risk === 2) return true;
  if (risk === 1 && environment === 'production') return true;
  return false;
}
