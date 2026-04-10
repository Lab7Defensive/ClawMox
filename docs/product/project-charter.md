# ClawMox Project Charter

## Summary

ClawMox is a Lab7 infrastructure-control project that gives OpenClaw a safe, auditable way to operate Proxmox and related infrastructure without granting unrestricted shell access from chat.

## Vision

Create an agent-compatible control plane that lets Mikey and trusted Lab7 operators:
- inspect Proxmox state
- provision approved infrastructure patterns
- run Terraform and Ansible through a controlled runner
- manage updates and routine maintenance on other machines
- keep human approval for risky or destructive actions

## Problem

OpenClaw can help with planning and execution, but direct root SSH or broad host shell access creates too much risk. Lab7 needs a secure mechanism for agent-assisted infrastructure operations with clear trust boundaries, auditable workflows, and strong approval controls.

## Goals

1. Provide safe read access into Proxmox inventory, health, storage, guests, and tasks.
2. Support controlled write operations for approved infrastructure workflows.
3. Separate Proxmox-native API control from general shell automation.
4. Run infra execution inside short-lived Docker containers on a dedicated runner where possible.
5. Build a docs-first foundation so implementation can proceed cleanly.
6. Preserve strong audit trails, approvals, and rollback-aware operations.

## Non-goals

- Unrestricted remote shell from chat
- Autonomous destructive changes without approval
- Treating OpenClaw as a multi-tenant hostile security boundary
- Replacing Proxmox GUI or existing IaC tools
- Managing every advanced Proxmox feature in v1

## Primary stakeholders

- Mikey, product owner and trusted operator
- Lab7 infrastructure and platform operations
- Future Lab7 agents and automation systems

## Success criteria

- Read-only Proxmox visibility works reliably.
- Safe write actions are gated and auditable.
- Terraform and Ansible jobs run through bounded runner jobs, not arbitrary shell.
- The project has clear technical documentation before implementation begins.

## Initial deliverables

- architecture and security design
- MCP/API contracts
- runner job model
- approval model
- implementation roadmap
- initial ADR set
