# Testing Strategy

## Goals

Ensure ClawMox is safe, predictable, and debuggable before it touches meaningful infrastructure.

## Test layers

### Unit tests
- input validation
- policy classification
- request normalization
- output shaping

### Integration tests
- Proxmox MCP against lab or mocked endpoints
- runner job submission and state transitions
- artifact persistence
- approval enforcement

### Environment tests
- lab or sandbox Proxmox environment
- non-production Terraform and Ansible targets

### Security tests
- credential scoping review
- log redaction review
- destructive-action gating review
- runner container hardening review

## Pre-release checks

- tool contracts match docs
- no unrestricted command path exists
- approvals are enforced where expected
- job artifacts and logs are retrievable
- rollback notes exist for supported risky actions
