# Research Notes

## Key findings informing ClawMox

### Proxmox
- Proxmox provides a strong HTTPS API suitable for automation.
- API tokens support separated privileges and are a better primitive than broad shell access for standard operations.
- `pvesh` exposes broad API functionality locally and is root-oriented, making it inappropriate as the default remote automation interface.
- Cluster and firewall operations carry meaningful blast radius and should be delayed or tightly constrained.

### OpenClaw
- OpenClaw is a trusted-operator assistant model, not a hostile multi-tenant isolation boundary.
- Safe remote execution design depends on narrow scope, approvals, and strong runtime separation.

### Documentation structure
- docs-as-code patterns support splitting project docs into product, architecture, API, security, operations, development, ADRs, and research.
- ADRs are the right place for durable high-impact design decisions.
- runbooks should be separate from architecture docs.

## Implication for design

The practical design outcome is API-first control, runner-mediated execution, and strong policy boundaries between chat intent and infrastructure mutation.
