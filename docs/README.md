# ClawMox Documentation

ClawMox is a planned Lab7 control plane for safe Proxmox automation, infra execution, and agent-assisted operations.

This docs set is structured as docs-as-code so the project can be designed, implemented, reviewed, and operated from versioned Markdown.

## Documentation map

### Start here
- [Project Charter](./product/project-charter.md)
- [Product Requirements Document](./product/prd.md)
- [Architecture Overview](./architecture/overview.md)
- [Security Architecture](./security/security-architecture.md)
- [Implementation Roadmap](./development/implementation-roadmap.md)

### Architecture
- [System Overview](./architecture/overview.md)
- [Component Architecture](./architecture/components.md)
- [Deployment Architecture](./architecture/deployment.md)
- [Data Flow and Execution Model](./architecture/data-flow.md)
- [Trust Boundaries](./architecture/trust-boundaries.md)

### API and interfaces
- [Proxmox MCP API Spec](./api/proxmox-mcp-api.md)
- [Infra Runner API Spec](./api/infra-runner-api.md)
- [Tool Contracts](./api/tool-contracts.md)

### Security
- [Security Architecture](./security/security-architecture.md)
- [Authentication and Authorization](./security/authn-authz.md)
- [Secrets Management](./security/secrets-management.md)
- [Threat Model](./security/threat-model.md)
- [Approval and Safety Policy](./security/approval-policy.md)

### Operations
- [Operational Model](./operations/operational-model.md)
- [Runbook: Provisioning Workflow](./operations/runbook-provisioning.md)
- [Runbook: Change Execution](./operations/runbook-change-execution.md)
- [Runbook: Incident Response](./operations/runbook-incident-response.md)

### Product and delivery
- [Project Charter](./product/project-charter.md)
- [Product Requirements Document](./product/prd.md)
- [Scope and Non-Goals](./product/scope-and-non-goals.md)
- [Use Cases](./product/use-cases.md)

### Development
- [Repository Plan](./development/repository-plan.md)
- [Documentation Standards](./development/documentation-standards.md)
- [Implementation Roadmap](./development/implementation-roadmap.md)
- [Testing Strategy](./development/testing-strategy.md)

### Decisions and references
- [ADR Index](./adr/README.md)
- [Reference Glossary](./reference/glossary.md)
- [Reference Sources](./research/sources.md)
- [Research Notes](./research/research-notes.md)

## Recommended doc workflow

1. Update product docs when scope changes.
2. Update architecture docs before major implementation changes.
3. Record durable design decisions in ADRs.
4. Update security docs whenever auth, permissions, approvals, or secrets change.
5. Keep runbooks aligned with real operational behavior.

## Why this structure

This structure follows common docs-as-code patterns for infrastructure and platform projects:
- top-level index for navigation
- separate product, architecture, api, security, operations, and development areas
- ADRs for durable decision history
- runbooks for operator workflows
- research folder for source-backed planning notes

That separation keeps strategy, implementation, and operations from getting mixed together too early.
