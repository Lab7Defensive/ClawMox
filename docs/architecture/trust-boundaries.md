# Trust Boundaries

## Boundary 1: Human operator to OpenClaw

The user request enters through chat. The assistant is helpful, but chat is not itself a safe execution boundary. Inputs must be interpreted, validated, and constrained before any infrastructure action occurs.

## Boundary 2: OpenClaw to ClawMox services

OpenClaw should communicate with ClawMox services over explicit APIs with typed requests. This boundary enforces policy and prevents direct arbitrary command forwarding.

## Boundary 3: Proxmox MCP to Proxmox API

This is a sensitive management boundary. Authentication should use dedicated API tokens with separated privileges and narrow ACL scope.

## Boundary 4: Infra runner to Docker execution environment

The runner host is trusted infrastructure. Each job container should receive only the minimum repo, environment variables, secrets, and network access required for its task.

## Boundary 5: Runner to downstream infrastructure

The runner may connect to Git providers, artifact storage, SSH targets, and other service endpoints. These paths must be allowlisted and segmented where possible.

## Boundary 6: Audit and secrets storage

Audit data and secrets are both sensitive, but for different reasons. Audit records preserve operator actions and results. Secrets enable those actions. Access patterns should be separated and tightly controlled.

## Boundary rules

- never collapse OpenClaw runtime and runner shell authority without strong reason
- do not use session IDs or labels as auth boundaries
- treat approvals as operator intent controls, not as full isolation guarantees
- document any scope-widening change with an ADR
