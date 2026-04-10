# Architecture Overview

## Executive summary

ClawMox is an API-first infrastructure control plane for Lab7. It separates agent interaction, Proxmox-native control, and infrastructure execution into distinct layers to reduce blast radius and improve auditability.

## Core architectural principles

1. API first for Proxmox-native actions.
2. Dedicated runner for shell-adjacent infrastructure execution.
3. Containerized jobs for repeatability and isolation.
4. Human approval for high-risk actions.
5. Typed interfaces instead of arbitrary command passthrough.
6. Clear trust boundaries and auditable execution.

## High-level system

### OpenClaw layer
OpenClaw receives the request, interprets intent, applies the ClawMox skill rules, and chooses whether to:
- read state from the Proxmox MCP
- submit a structured runner job
- ask for approval
- summarize results back to the operator

### Proxmox MCP layer
A dedicated service translates typed operations into approved Proxmox API calls using scoped API tokens.

### Infra runner layer
A separate service launches short-lived Docker containers for Terraform, Ansible, or other approved automation jobs. It handles repo checkout, artifact capture, logs, and job state.

### Target infrastructure layer
This includes Proxmox nodes, guests, and external managed machines reachable through approved mechanisms.

## Why this architecture

This model avoids the main failure mode of agentic infra automation: turning a chat assistant into a root shell. It also makes the project easier to evolve because API control, execution, policy, and user interaction are separated.

## Initial boundaries

- OpenClaw does not hold unrestricted infrastructure shell access.
- Proxmox MCP does not expose arbitrary API passthrough in v1.
- Runner does not execute arbitrary user-provided commands in v1.
- Destructive changes require explicit approval.

## Expected implementation shape

- one repository for ClawMox services and docs
- one or more supporting infra repos for Terraform and Ansible
- service APIs documented in Markdown before implementation begins
