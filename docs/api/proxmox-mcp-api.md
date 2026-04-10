# Proxmox MCP API Specification

## Purpose

The Proxmox MCP service exposes a narrow, typed interface for Proxmox-native operations. It exists to prevent arbitrary API passthrough while still allowing useful automation.

## Design principles

- API-first, not shell-first
- explicit tool contracts
- least privilege authentication
- no arbitrary path forwarding in v1
- return structured results, not raw upstream noise

## Authentication

The MCP authenticates to Proxmox using dedicated API tokens.

Recommended model:
- one automation user per environment or risk domain
- separated privileges, not full privilege inheritance
- narrow ACL scope by path/resource where possible
- token rotation and expiry documented operationally

## Tool groups

### Read-only tools
- `get_cluster_status`
- `list_nodes`
- `get_node_status`
- `list_vms`
- `list_lxcs`
- `get_guest_status`
- `list_storage`
- `get_storage_status`
- `list_snapshots`
- `list_backups`
- `list_tasks`
- `get_task_status`

### Controlled write tools
- `start_guest`
- `stop_guest`
- `reboot_guest`
- `create_snapshot`
- `clone_vm_from_template`
- `create_lxc_from_profile`
- `restore_snapshot` (later phase)

## Example tool contract

### `get_cluster_status`

**Input**
- optional environment or cluster alias

**Behavior**
- reads cluster health, quorum state, node summary, and recent task health

**Output**
- cluster name
- quorum status
- node count
- degraded nodes
- storage warnings
- recent task failures
- correlation ID

### `clone_vm_from_template`

**Input**
- target node
- template ID or approved template alias
- VM name
- approved profile
- target storage
- network profile
- operator metadata
- approval reference if required

**Validation**
- template must be on allowlist
- profile must be known
- target storage and node must be valid
- requested options must stay within approved bounds

**Output**
- Proxmox UPID or task handle
- resulting VM ID if available
- initial task state
- correlation ID

## Error model

Return errors in typed categories:
- `validation_error`
- `auth_error`
- `permission_error`
- `connectivity_error`
- `upstream_task_error`
- `not_supported`

Each error should include:
- machine-readable code
- human-readable summary
- retry guidance if relevant
- correlation ID

## API compatibility policy

- additive changes are preferred
- breaking contract changes require ADR or version bump
- upstream Proxmox major-version changes should be tested explicitly

## Logging and observability

Log:
- tool name
- operator identity
- normalized inputs
- approval state
- upstream endpoint group
- result summary
- correlation ID

Do not log secrets or raw token values.
