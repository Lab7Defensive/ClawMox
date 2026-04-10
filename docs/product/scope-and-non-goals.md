# Scope and Non-Goals

## In scope for initial project scaffold

### Documentation
- complete initial docs tree
- architecture, security, API, operations, and roadmap docs
- ADR templates and starter decisions

### Core technical direction
- Proxmox API token based control plane
- Docker-backed infra runner
- skill plus MCP/service boundary design
- approval gates for risky actions

### Initial operational capabilities
- inventory reads
- health/status reads
- safe provisioning workflows from approved templates
- Terraform and Ansible via structured jobs

## Explicit non-goals for v1

- arbitrary shell command execution from chat
- direct root SSH as the default execution model
- broad firewall, cluster, Ceph, or storage mutation support
- fully autonomous change application without human review
- replacing existing IaC repos with one-off imperative scripts

## Deferred scope

- multi-operator RBAC beyond the trusted boundary model
- deep CMDB or asset management features
- advanced scheduling and long-lived workflow orchestration
- automatic rollback for every action class
- support for every Proxmox endpoint

## Scope guardrails

If a proposed feature:
- widens permissions materially,
- bypasses approvals,
- introduces arbitrary command execution,
- or conflates OpenClaw runtime with infra runner,

then it should trigger a fresh design review and likely an ADR.
