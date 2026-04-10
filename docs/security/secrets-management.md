# Secrets Management

## Principles

- secrets are never committed to docs or source control
- secrets are injected at runtime only
- each service gets only the secrets it needs
- secrets should be rotated and revocable

## Secret categories

- Proxmox API tokens
- SSH private keys for automation
- git access credentials
- cloud provider credentials
- Terraform state backend credentials
- Ansible vault passwords or equivalent

## Storage recommendations

### Early phase
Use tightly controlled host-level environment injection or secret files with locked-down permissions.

### Later phase
Move to a dedicated secret manager or vault-backed design.

## Runner secret injection

The runner should:
- inject secrets only for the job being executed
- avoid writing them into logs
- avoid persisting them inside container layers
- unmount or destroy access after completion

## Logging rules

Never log:
- full token values
- private keys
- raw cloud secrets
- decrypted vault material

## Rotation rules

Document:
- owner
- scope
- issuance source
- expiry or rotation cadence
- revocation method
