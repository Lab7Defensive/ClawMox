# Security Architecture

## Security posture

ClawMox should be designed as a trusted-operator infrastructure control layer, not as a hostile multi-tenant platform. Security comes from least privilege, execution isolation, approvals, and auditable workflows.

## Core rules

1. Do not expose unrestricted shell from chat.
2. Use Proxmox API tokens for Proxmox-native operations.
3. Execute infra jobs in isolated, short-lived Docker containers on a dedicated runner.
4. Require approvals for high-risk changes.
5. Keep OpenClaw runtime, MCP, runner, and secrets boundaries distinct.

## Primary assets to protect

- Proxmox control-plane access
- SSH access to downstream machines
- cloud and provider credentials
- Terraform state and secrets
- Ansible inventories and vault material
- audit history and operator action records

## Security controls

### Identity and auth
- dedicated machine identities
- dedicated API tokens
- no shared root identities for normal automation

### Authorization
- explicit allowlists for supported actions
- narrow ACLs for Proxmox token use
- approved target sets for runner jobs

### Execution isolation
- short-lived Docker jobs
- minimal mounts
- limited network paths
- pinned images

### Human oversight
- approval thresholds by risk tier
- destructive actions require explicit operator confirmation

### Auditability
- record requests, approvals, actions, and results
- preserve logs and artifacts
- correlation IDs across all services

## Design anti-patterns

- direct root SSH as the default path
- arbitrary command passthrough
- using one credential for every environment
- storing secrets in docs or repos
- hidden execution paths that bypass approvals
