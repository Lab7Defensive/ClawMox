# Use Cases

## UC-1 Inspect cluster health
Operator asks OpenClaw for current Proxmox node, storage, and guest status. The system reads from the Proxmox MCP and returns a concise summary.

## UC-2 Clone a VM from an approved template
Operator requests a new VM based on a known template and profile. The system validates the request, asks for approval if required, calls the Proxmox MCP, and returns the resulting task status.

## UC-3 Plan Terraform changes
Operator asks to prepare infrastructure updates. The runner starts a short-lived Docker job, checks out the right repo/ref, runs Terraform plan, stores artifacts, and returns a summary.

## UC-4 Apply approved Terraform changes
After reviewing the plan, operator approves execution. The runner launches a new bounded container job to apply the exact approved change set.

## UC-5 Run Ansible maintenance on a host group
Operator requests package updates or a specific playbook against an approved inventory group. The runner performs a check pass first and only applies after approval.

## UC-6 Investigate a failed change
Operator asks why a prior job failed. The system retrieves job metadata, logs, artifacts, and related target state for debugging.

## UC-7 Snapshot before risky change
Before a configuration change, the system creates a guest snapshot or backup checkpoint if the target and workflow support it.

## UC-8 Review audit trail
Operator asks what changed today. The system returns completed jobs, actions, approvals, operators, and results in a human-readable summary.
