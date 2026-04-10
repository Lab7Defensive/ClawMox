# Implementation Roadmap

## Phase 0: Documentation and architecture
- complete project docs
- confirm service boundaries
- confirm auth model
- confirm first tool set

## Phase 1: Read-only foundation
- implement Proxmox MCP read tools
- implement basic service auth
- implement correlation IDs and logging
- build minimal OpenClaw skill contract

## Phase 2: Controlled writes
- implement guest lifecycle actions
- implement snapshot support
- add approval policy enforcement
- add initial audit persistence

## Phase 3: Infra runner
- implement job API
- build pinned runner images
- support Terraform plan and apply
- support Ansible check and apply
- capture artifacts and logs reliably

## Phase 4: Hardening and operator UX
- improve policy controls
- improve dashboarding or status visibility
- add stronger secret management
- add more runbooks and troubleshooting guides

## Phase 5: Advanced operations
- carefully expand target operations
- consider richer environment support
- add deeper lifecycle workflows where justified

## Exit criteria for first useful release
- read-only Proxmox visibility works
- at least one provisioning path works safely
- Terraform plan and apply are bounded and auditable
- approvals are enforced for risky actions
