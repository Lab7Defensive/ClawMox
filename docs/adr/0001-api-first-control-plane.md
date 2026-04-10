# ADR 0001: API-first control plane

## Status
Accepted

## Context
ClawMox needs to manage Proxmox safely. Direct shell access is powerful but hard to constrain and audit. Proxmox already provides a formal API with token-based authentication and path/role-based permissions.

## Decision
Use the Proxmox HTTPS API with dedicated API tokens as the primary control path for Proxmox-native operations.

## Consequences
### Positive
- better least-privilege posture
- typed, auditable operations
- easier approval modeling
- lower blast radius than unrestricted SSH

### Negative
- some tasks still require non-API workflows
- implementation requires typed client contracts and permission design

## Alternatives considered
- direct root SSH to Proxmox host, rejected as too broad
- generic API passthrough, rejected for v1 due to risk and complexity
