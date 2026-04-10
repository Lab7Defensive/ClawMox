# Tool Contracts

## Purpose

This document defines the shape and behavior of the operator-facing tools that OpenClaw will eventually expose through the ClawMox skill.

## Contract rules

1. Tools must take structured input.
2. Tools must validate before executing.
3. Tools must return concise human-usable summaries plus machine-usable metadata.
4. Tools must include correlation IDs.
5. Risky tools must surface approval state clearly.

## Read tool examples

### `clawmox.cluster.summary`
Returns a concise summary of cluster health.

### `clawmox.guests.list`
Returns VM and LXC inventory filtered by node, tag, or status.

### `clawmox.storage.summary`
Returns storage usage, warnings, and availability.

## Action tool examples

### `clawmox.guest.clone`
Creates a new guest from an approved template/profile.

### `clawmox.guest.snapshot`
Creates a snapshot for an approved guest.

### `clawmox.terraform.plan`
Creates a Terraform plan via infra runner.

### `clawmox.ansible.check`
Runs an Ansible dry-run via infra runner.

## Response contract

Every tool response should include:
- `status`
- `summary`
- `details` or structured data payload
- `correlation_id`
- `approval_state` when applicable
- `artifacts` or references when applicable

## Human factors

Responses should be optimized for chat:
- short summary first
- important warnings second
- links, IDs, and artifacts last

Avoid dumping raw JSON to the user unless requested.
