# ClawMox

ClawMox is a planned open-source control plane for safe Proxmox automation, infra execution, and agent-assisted operations.

## Current state

This repository currently contains the first-pass documentation set covering:
- product requirements
- architecture
- API contracts
- security model
- operations runbooks
- development roadmap
- ADRs

## Documentation

Start here:
- `docs/README.md`
- `docs/user-guide-and-setup.md`

## Design direction

ClawMox is built around a few core ideas:
- Proxmox API first, not raw shell first
- dedicated infra runner for Terraform and Ansible jobs
- short-lived Docker execution for bounded automation tasks
- approval gates for risky or destructive operations
- strong auditability and clear trust boundaries

## License

MIT


## Local setup

1. Copy `.env.example` to `.env`
2. Fill in your Proxmox API token and environment values
3. Create `./secrets` for mounted runner secrets
4. Run:
   - `npm install`
   - `npm run typecheck`
   - `npm run build`
   - `npm test`

For a test checklist, see:
- `scripts/office-test-checklist.md`

- `scripts/demo-flow.md`
