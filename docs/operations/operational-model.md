# Operational Model

## Operating philosophy

ClawMox should behave like an audited infrastructure control plane, not a command trampoline.

## Normal workflow

1. operator requests information or action
2. OpenClaw classifies and validates
3. approval requested if required
4. MCP or runner executes bounded action
5. results, artifacts, and logs are captured
6. operator receives summary and next steps

## Environments

ClawMox should distinguish at minimum:
- sandbox or lab
- staging
- production

## Operational ownership

### OpenClaw runtime
Owns interaction, planning, summaries, and policy-aware routing.

### Proxmox MCP
Owns typed Proxmox actions and status retrieval.

### Infra runner
Owns bounded job execution and artifact capture.

### Human operator
Owns approvals, high-risk review, and final responsibility for major changes.

## Key operational records

- request log
- approval log
- runner job history
- Proxmox task history
- artifact index

## Service health

Track:
- MCP availability
- runner availability
- queue depth
- job failure rate
- artifact persistence success
- auth/token health
