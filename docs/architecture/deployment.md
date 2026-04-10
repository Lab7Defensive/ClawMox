# Deployment Architecture

## Target deployment model

### OpenClaw runtime
Runs independently as the chat-facing assistant.

### Proxmox MCP service
Recommended placement:
- dedicated VM or LXC on trusted management infrastructure
- network path to Proxmox API on port 8006
- no unnecessary downstream shell access

### Infra runner service
Recommended placement:
- dedicated VM or LXC separate from OpenClaw runtime
- Docker installed and hardened
- access to approved git repos, artifact storage, and downstream SSH targets
- outbound access limited to required destinations

### Artifact and audit storage
Can be local at first, but should be structured so it can move to object storage or a database-backed service later.

## Runner container model

Each job should:
- start a short-lived container from a pinned image
- mount a working directory for the checked-out repo
- inject only the secrets required for that job
- emit logs and artifacts to a host-managed path
- terminate cleanly and be removed after job completion

## Why containers on the runner

This gives Lab7:
- repeatable toolchains
- easier upgrades
- cleaner environment isolation
- less host contamination from one-off tools

## Example deployment slices

### Early phase
- OpenClaw runtime
- Proxmox MCP service
- Infra runner with Docker
- local artifact storage

### Later phase
- centralized audit database
- policy engine
- job queue
- object storage for artifacts
- multiple runner classes

## Network guidance

- keep management-plane access narrow
- allow Proxmox MCP to reach only required Proxmox API endpoints
- allow runner to reach only approved repos, artifact storage, and target hosts
- prefer internal-only connectivity for MCP and runner services
