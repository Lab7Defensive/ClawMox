import {
  classifyRisk,
  createCorrelationId,
  requiresApproval,
  runnerJobRequestSchema,
  serviceResponseSchema
} from '../../shared/src/index.js';
import { ArtifactStore } from './artifacts.js';
import { loadRunnerConfig } from './config.js';
import { DockerJobLauncher } from './docker.js';
import type { RunnerJobRecord } from './types.js';

export class InfraRunnerService {
  private readonly config = loadRunnerConfig();
  private readonly launcher = new DockerJobLauncher();
  private readonly artifacts = new ArtifactStore(this.config.artifactsDir);
  private readonly jobs = new Map<string, RunnerJobRecord>();

  async submitJob(input: Record<string, unknown> = {}) {
    const parsed = runnerJobRequestSchema.parse({
      correlationId: createCorrelationId('runner'),
      ...input
    });

    const risk = classifyRisk(parsed.jobType);
    const approvalRequired = requiresApproval(risk, parsed.environment);
    const prepared = this.launcher.prepare(parsed.jobType);
    const now = new Date().toISOString();
    const jobId = createCorrelationId('job');

    const accepted = this.config.allowedRepos.includes(parsed.repo) || this.config.allowedRepos.length === 0;
    const artifactPath = await this.artifacts.writeJobArtifact(
      jobId,
      'request.json',
      JSON.stringify({ parsed, prepared }, null, 2)
    );

    const record: RunnerJobRecord = {
      id: jobId,
      jobType: parsed.jobType,
      environment: parsed.environment,
      scope: parsed.scope,
      status: approvalRequired ? 'approval_required' : accepted ? 'queued' : 'rejected',
      createdAt: now,
      updatedAt: now,
      correlationId: parsed.correlationId,
      artifactPaths: [artifactPath]
    };

    this.jobs.set(jobId, record);

    return serviceResponseSchema.parse({
      status: accepted ? 'ok' as const : 'error' as const,
      summary: accepted
        ? `Runner job prepared for ${parsed.jobType}. Execution lifecycle is scaffolded and awaiting the next step.`
        : `Runner job rejected because repo ${parsed.repo} is not in the allowlist.`,
      correlationId: parsed.correlationId,
      approvalState: approvalRequired ? 'required' : 'not_required',
      details: {
        job: record,
        preparedImage: prepared.image,
        accepted,
        live: false
      },
      artifacts: [artifactPath]
    });
  }

  listJobs() {
    return [...this.jobs.values()];
  }

  async ping(): Promise<string> {
    return 'infra-runner-ready';
  }
}
