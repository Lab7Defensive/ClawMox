# Runbook: Provisioning Workflow

## Purpose

Provision a new VM or LXC safely through ClawMox using approved templates and profiles.

## Prerequisites

- approved template exists
- target node and storage are valid
- requested profile is defined
- approval is available if required

## Steps

1. Confirm environment and target node.
2. Confirm approved template or profile.
3. Check available storage and relevant quotas.
4. If production or policy requires, gather approval.
5. Submit provisioning request through Proxmox MCP.
6. Capture task ID and correlation ID.
7. Monitor task status until completion or failure.
8. Verify guest exists and expected parameters were applied.
9. Record outcome in audit trail.

## Failure handling

- validation failure: stop and correct inputs
- task failure: capture Proxmox error and inspect storage, template, or permission issue
- partial success: verify whether cleanup or manual follow-up is required

## Verification

- guest is visible in inventory
- expected node, name, storage, and profile match request
- any downstream bootstrap step is either complete or clearly pending
