# Threat Model

## Scope

This threat model covers ClawMox as a trusted-operator infrastructure system used by OpenClaw and Lab7 operators.

## Main threats

### T1 Prompt-shaped input causes unsafe execution
Mitigation:
- structured tools only
- no arbitrary command passthrough
- approvals for risky actions

### T2 Over-privileged credentials are compromised
Mitigation:
- least privilege
- separated privileges for Proxmox tokens
- credential separation by environment
- rotation and revocation procedures

### T3 Runner container escape or abuse
Mitigation:
- dedicated runner host
- no privileged containers by default
- pinned images
- minimal mounts and network access

### T4 Wrong target or wrong environment
Mitigation:
- target validation
- environment labels in requests and outputs
- approvals for production actions

### T5 Silent destructive changes
Mitigation:
- audit trail
- approval policy
- disabled or delayed support for highly destructive operations

### T6 Secret leakage through logs or artifacts
Mitigation:
- output redaction
- artifact handling rules
- secret-aware logging discipline

## Residual risks

- trusted-operator systems still depend on careful operator review
- the runner host remains a high-value target
- human-approved bad changes are still possible

## Out-of-scope assumptions

- hostile multi-tenant isolation on a single shared runtime
- fully autonomous infrastructure mutation without human oversight
