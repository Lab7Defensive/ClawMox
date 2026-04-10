export type RiskTier = 0 | 1 | 2 | 3;

export type ApprovalState = 'not_required' | 'required' | 'approved' | 'rejected' | 'expired';

export type ServiceErrorCode =
  | 'validation_error'
  | 'auth_error'
  | 'permission_error'
  | 'connectivity_error'
  | 'upstream_task_error'
  | 'not_supported'
  | 'repo_error'
  | 'secret_injection_error'
  | 'container_launch_error'
  | 'tool_execution_error'
  | 'artifact_persistence_error'
  | 'policy_error';

export type JobStatus =
  | 'queued'
  | 'validating'
  | 'running'
  | 'succeeded'
  | 'failed'
  | 'canceled'
  | 'approval_required'
  | 'rejected';
