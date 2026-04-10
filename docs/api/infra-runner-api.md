# Infra Runner API Specification

## Purpose

The infra runner service executes bounded infrastructure jobs in short-lived Docker containers. It should support Terraform, Ansible, and future approved job types without becoming a generic remote shell.

## Core principles

- job-oriented, not shell-oriented
- containers are ephemeral
- inputs are validated before execution
- artifacts and logs are first-class outputs
- approval can be enforced by job type or risk tier

## Supported v1 job types

- `terraform-plan`
- `terraform-apply`
- `ansible-check`
- `ansible-apply`
- `host-maintenance`

## Base job request shape

- job type
- repo identifier
- git ref or commit SHA
- environment
- module, workspace, playbook, or target group
- requested variables or parameter set
- operator identity
- approval reference if required
- correlation ID

## Job lifecycle

1. request submitted
2. validation performed
3. job accepted or rejected
4. container launched
5. toolchain runs
6. logs and artifacts persisted
7. terminal status emitted

## Status model

- `queued`
- `validating`
- `running`
- `succeeded`
- `failed`
- `canceled`
- `approval_required`
- `rejected`

## Terraform jobs

### `terraform-plan`
Inputs:
- repo
- ref
- environment
- workspace or module scope
- approved variable set or var-file reference

Outputs:
- exit status
- summary of changes
- artifact path or ID for full plan output
- correlation ID

### `terraform-apply`
Inputs:
- exact plan artifact reference or exact approved request envelope
- approval reference

Rules:
- must apply the approved change set, not a silently recomputed alternative unless explicitly designed and disclosed

## Ansible jobs

### `ansible-check`
Inputs:
- repo
- ref
- inventory target
- playbook
- optional limit
- parameter set

Outputs:
- change forecast summary
- task failures if any
- logs and artifacts

### `ansible-apply`
Inputs:
- same as check pass plus approval reference

Rules:
- approved target group only
- no ad hoc arbitrary command module in v1 unless explicitly allowlisted

## Host maintenance jobs

Use for narrowly defined tasks like package updates on approved host groups.

Inputs:
- maintenance profile
- inventory group
- execution window or urgency metadata
- approval reference if policy requires it

## Error model

- `validation_error`
- `repo_error`
- `secret_injection_error`
- `container_launch_error`
- `tool_execution_error`
- `artifact_persistence_error`
- `policy_error`

## Security requirements

- containers run with least privilege possible
- job images are pinned
- mounts are minimal and explicit
- secrets are injected at runtime only
- network access is limited where practical
- no privileged containers by default

## Observability

Store:
- job request envelope
- normalized inputs
- image used
- command profile used internally
- logs
- artifacts
- timing
- exit code
- correlation ID
