# Product Requirements Document

## Product name

ClawMox

## Objective

Build a secure control plane that enables OpenClaw to assist with Proxmox operations and adjacent infrastructure automation while preserving least privilege, operator approval, and auditable execution.

## Users

### Primary user
- Mikey, trusted operator for Lab7 infrastructure

### Secondary users
- Future trusted Lab7 operators
- Other Lab7 agent systems acting within the same trust boundary

## Core jobs to be done

1. See what exists in Proxmox right now.
2. Ask for safe actions like start, stop, snapshot, clone, or template-based provisioning.
3. Generate and run Terraform and Ansible workflows without exposing unrestricted shell.
4. Orchestrate maintenance and updates on other machines through structured jobs.
5. Understand what changed, why it changed, and how to roll it back.

## Functional requirements

### FR-1 Read-only Proxmox visibility
The system must provide read access to:
- nodes
- cluster health
- guests
- storage
- snapshots
- backups
- tasks
- selected logs and events

### FR-2 Controlled Proxmox write actions
The system must support bounded write operations such as:
- start, stop, reboot guest
- snapshot guest
- clone from approved template
- create LXC or VM from approved profiles
- update selected metadata or configuration fields in later phases

### FR-3 Runner-backed infra execution
The system must support structured jobs for:
- Terraform plan
- Terraform apply
- Ansible check or dry-run
- Ansible apply
- package update workflows on approved machine groups

### FR-4 Approval model
The system must require explicit human approval for actions above the configured safety threshold.

### FR-5 Auditability
The system must record who requested an action, what was executed, inputs, outputs, approvals, status, and rollback context where relevant.

### FR-6 Containerized execution
Runner jobs should execute in short-lived Docker containers where practical to isolate tools, pin versions, and reduce host drift.

## Non-functional requirements

### Security
- least privilege by default
- no unrestricted root shell from chat
- secrets never stored in skill markdown or committed docs
- clear trust boundary separation between OpenClaw runtime, runner, and Proxmox control plane

### Reliability
- deterministic job execution where possible
- retries only where safe
- idempotent job design for Terraform and Ansible flows

### Observability
- structured logs
- job status tracking
- task correlation IDs
- artifacts for plans and execution summaries

### Maintainability
- docs-as-code structure
- ADR-based decision tracking
- typed API contracts

## Release slices

### Phase 1
- docs
- read-only Proxmox MCP
- basic runner skeleton

### Phase 2
- safe write actions
- approval workflows
- audit records

### Phase 3
- Terraform and Ansible jobs in Docker runner
- inventory and environment support

### Phase 4
- advanced operations and richer policy controls
