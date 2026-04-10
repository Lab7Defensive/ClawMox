# Runbook: Change Execution

## Purpose

Execute infrastructure changes through Terraform or Ansible using the infra runner.

## Prerequisites

- repo and ref are known
- target environment is known
- variables or parameter set are approved
- approval obtained for apply phase when required

## Terraform flow

1. Run `terraform-plan`.
2. Review summary and artifact output.
3. Confirm target environment and blast radius.
4. Obtain approval for apply.
5. Run `terraform-apply` against the approved artifact or equivalent locked request.
6. Verify changed resources and status.

## Ansible flow

1. Run `ansible-check`.
2. Review expected changes and failures.
3. Confirm inventory target and scope.
4. Obtain approval for apply.
5. Run `ansible-apply`.
6. Verify host reachability and resulting state.

## Failure handling

- validation errors should be corrected before re-run
- execution failures should retain logs and artifacts for diagnosis
- partial changes require explicit verification and may require rollback or forward-fix

## Verification

- job status succeeded
- output artifacts retained
- target environment shows intended state
- operator summary generated
