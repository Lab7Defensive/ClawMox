# Component Architecture

## Primary components

### 1. OpenClaw skill layer
Responsibilities:
- recognize valid ClawMox tasks
- classify action risk
- gather missing parameters
- request approvals when required
- call the Proxmox MCP or infra runner
- summarize output for human operators

### 2. Proxmox MCP service
Responsibilities:
- authenticate to Proxmox using dedicated API token(s)
- expose typed tools for read and approved write operations
- validate arguments against supported schemas
- map requests to allowed API endpoints only
- capture task IDs and execution results

Likely tool groups:
- cluster inventory
- guest inventory
- storage status
- task status
- guest lifecycle
- snapshot and backup helpers
- template-based provisioning

### 3. Infra runner service
Responsibilities:
- receive structured job requests
- validate repo, ref, environment, and action
- launch short-lived Docker containers
- mount only required workspaces and secrets
- capture logs, artifacts, exit status, and metadata
- expose job status and history

Job types:
- terraform-plan
- terraform-apply
- ansible-check
- ansible-apply
- host-maintenance

### 4. Audit store
Responsibilities:
- persist request metadata
- store approval events
- correlate runner jobs and Proxmox tasks
- retain summary artifacts for review and incident investigation

### 5. Secrets and config layer
Responsibilities:
- inject Proxmox tokens, SSH keys, and repo credentials securely
- avoid secret exposure in docs, code, or chat output

## Data contracts between components

OpenClaw should pass structured requests, not raw command strings.

Example request shape:
- action type
- target scope
- environment
- requested parameters
- operator identity
- approval reference if required

## Component interaction rules

- OpenClaw never talks directly to Proxmox shell for standard operations.
- OpenClaw never runs Terraform or Ansible inline for ClawMox workflows.
- Proxmox MCP only performs supported operations.
- Runner only executes predefined job types.
- Audit correlation ID should be present in all cross-service actions.
