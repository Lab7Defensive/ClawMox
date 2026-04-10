# Repository Plan

## Recommended repository layout

ClawMox can begin as a single repo with docs and implementation code, while Terraform and Ansible remain in their own infra repos.

## Suggested layout

- `docs/`
- `services/proxmox-mcp/`
- `services/infra-runner/`
- `services/shared/`
- `schemas/`
- `scripts/`
- `tests/`

## Why this split

- docs stay close to implementation
- service boundaries are visible early
- schemas and shared utilities can be reused without mixing control paths

## Related repos

- infra Terraform repo or repos
- infra Ansible repo or repos
- optional runner image definitions repo if it grows independently

## Branching and delivery

- keep docs changes versioned with architecture changes
- use feature branches for meaningful implementation work
- keep ADRs in the same repo as the affected design
