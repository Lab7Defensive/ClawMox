export interface RunnerJobRecord {
  id: string;
  jobType: string;
  environment: string;
  scope: string;
  status: 'queued' | 'validating' | 'running' | 'succeeded' | 'failed' | 'canceled' | 'approval_required' | 'rejected';
  createdAt: string;
  updatedAt: string;
  correlationId: string;
  artifactPaths: string[];
}
