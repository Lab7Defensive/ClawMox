# Data Flow and Execution Model

## Request flow

1. Operator sends request to OpenClaw.
2. OpenClaw classifies the action.
3. OpenClaw gathers required parameters.
4. OpenClaw checks whether approval is needed.
5. OpenClaw calls either the Proxmox MCP or the infra runner.
6. Service returns structured result and correlation metadata.
7. OpenClaw summarizes the result and next actions.

## Read-only flow

Example:
- request cluster health
- OpenClaw calls `get_cluster_status`
- Proxmox MCP queries approved endpoints
- response returns nodes, quorum, storage health, and tasks summary

## Controlled write flow

Example:
- request clone from approved template
- OpenClaw validates template profile
- approval requested if policy requires it
- Proxmox MCP submits API request
- Proxmox task ID returned
- OpenClaw polls status through MCP as needed

## Runner job flow

Example:
- request Terraform plan
- OpenClaw submits `terraform-plan` job with repo, ref, environment, and module scope
- runner validates inputs
- runner launches short-lived Docker container
- container runs the plan and emits artifacts
- runner stores logs and plan summary
- OpenClaw returns concise result and references

## Correlation strategy

Each action should include:
- request ID
- operator identity
- policy tier
- approval ID if applicable
- service execution ID
- external task ID if applicable

## Failure handling

### MCP failures
- return typed error
- distinguish auth, validation, connectivity, and upstream Proxmox task failures

### Runner failures
- return job status, exit code, and failure stage
- preserve logs and artifacts for diagnosis

### Approval failures
- no action executed
- store the denied or expired approval outcome in the audit trail
