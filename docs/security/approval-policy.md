# Approval and Safety Policy

## Purpose

Define when ClawMox can act directly and when explicit operator approval is required.

## Risk tiers

### Tier 0: informational reads
Examples:
- list nodes
- list guests
- check storage
- inspect task status

Policy:
- no approval required

### Tier 1: low-risk reversible actions
Examples:
- start or stop non-production guest
- create snapshot
- gather plan output

Policy:
- approval optional based on environment and policy setting

### Tier 2: infrastructure-changing actions
Examples:
- terraform apply
- ansible apply
- provisioning a new guest
- maintenance jobs against production groups

Policy:
- approval required

### Tier 3: destructive or high-blast-radius actions
Examples:
- delete guest
- remove storage
- change cluster membership
- modify firewall or network control-plane settings
- restore over existing critical systems

Policy:
- explicit approval required and may remain disabled in v1

## Approval payload requirements

- requested action
- target
- environment
- expected impact
- rollback notes if available
- exact plan or artifact reference if applicable

## Approval integrity

Approval should bind to the requested action envelope so the runner or MCP cannot quietly execute something materially different.

## Expiry

Approvals should expire after a defined period, especially for production changes.
