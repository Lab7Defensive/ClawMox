# ADR 0002: Docker runner for infra jobs

## Status
Accepted

## Context
Terraform and Ansible workflows require toolchains, secrets handling, reproducibility, and isolation from the long-lived OpenClaw runtime.

## Decision
Run infra jobs in short-lived Docker containers on a dedicated runner service where possible.

## Consequences
### Positive
- pinned tool versions
- reduced host drift
- easier cleanup
- better execution isolation
- reproducible job environments

### Negative
- added orchestration complexity
- Docker host hardening becomes critical
- some operations may still need host-level escape hatches in carefully controlled cases

## Alternatives considered
- run tools directly on the OpenClaw host, rejected due to coupling and drift
- long-lived shared worker containers, rejected for weaker isolation and harder debugging
