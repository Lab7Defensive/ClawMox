# Authentication and Authorization

## Authentication model

### OpenClaw to ClawMox services
Use service-to-service authentication suitable for internal trusted infrastructure. Options may include static service tokens initially, with stronger identity later.

### Proxmox MCP to Proxmox
Use dedicated Proxmox API tokens with:
- separated privileges
- least privilege ACL scope
- documented rotation
- environment separation

### Runner to downstream machines
Use SSH keys or service credentials scoped to the smallest practical target set.

## Authorization model

Authorization should happen at multiple layers:

1. tool level, whether the requested tool is even supported
2. target level, whether the requested node, guest, repo, environment, or host group is approved
3. policy level, whether the action requires approval
4. credential level, whether the service identity actually has rights to perform the action

## Recommended policy approach

### Read actions
Generally allowed for trusted operators unless sensitive scope requires further restriction.

### Reversible actions
Allowed with policy checks and optional approval depending on environment.

### Infra-changing actions
Require approval and strong logging.

### Destructive actions
Require explicit approval and may be disabled entirely in early phases.

## Environment separation
Use separate credentials or tokens for:
- lab or sandbox
- staging
- production

Do not reuse high-privilege production credentials in lower environments unless there is a compelling operational reason.
