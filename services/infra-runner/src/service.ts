import {
  classifyRisk,
  createCorrelationId,
  createScopeHash,
  requiresApproval,
  runnerJobRequestSchema,
  serviceResponseSchema,
  verifyApprovalScope
} from '../../shared/src/index.js';
import { ArtifactStore } from './artifacts.js';
import { loadRunnerConfig } from './config.js';
import { DockerJobLauncher } from './docker.js';
import { defaultJobStorePath, JobStore } from './store.js';
import type { RunnerJobRecord } from './types.js';

export class InfraRunnerService {
  private readonly config = loadRunnerConfig();
  private readonly launcher = new DockerJobLauncher(
    {
      terraform: this.config.terraformImage,
      ansible: this.config.ansibleImage
    },
    this.config.secretsDir,
    this.config.artifactsDir
  );
  private readonly artifacts = new ArtifactStore(this.config.artifactsDir);
  private readonly store = new JobStore(defaultJobStorePath(this.config.artifactsDir));

  async submitJob(input: Record<string, unknown> = {}) {
    const parsed = runnerJobRequestSchema.parse({
      correlationId: createCorrelationId('runner'),
      ...input
    });

    const risk = classifyRisk(parsed.jobType);
    const approvalRequired = requiresApproval(risk, parsed.environment);
    const approvalMatches = approvalRequired ? verifyApprovalScope(parsed.approval, parsed) : true;
    const prepared = this.launcher.prepare(parsed.jobType, parsed.scope);
    const now = new Date().toISOString();
    const jobId = createCorrelationId('job');

    const accepted = (this.config.allowedRepos.includes(parsed.repo) || this.config.allowedRepos.length === 0)
      && (!approvalRequired || approvalMatches);

    const artifactPath = await this.artifacts.writeJobArtifact(
      jobId,
      'request.json',
      JSON.stringify({ parsed, prepared, scopeHash: createScopeHash(parsed) }, null, 2)
    );

    const record: RunnerJobRecord = {
      id: jobId,
      jobType: parsed.jobType,
      environment: parsed.environment,
      scope: parsed.scope,
      status: approvalRequired && !approvalMatches ? 'approval_required' : accepted ? 'queued' : 'rejected',
      createdAt: now,
      updatedAt: now,
      correlationId: parsed.correlationId,
      artifactPaths: [artifactPath]
    };

    await this.store.upsert(record);

    return serviceResponseSchema.parse({
      status: accepted ? 'ok' as const : 'error' as const,
      summary: accepted
        ? `Runner job prepared for ${parsed.jobType}.`
        : approvalRequired && !approvalMatches
          ? 'Runner job is blocked because approval is missing or does not match the job scope.'
          : `Runner job rejected because repo ${parsed.repo} is not in the allowlist.`,
      correlationId: parsed.correlationId,
      approvalState: approvalRequired ? (approvalMatches ? 'approved' : 'required') : 'not_required',
      details: {
        job: record,
        preparedImage: prepared.image,
        accepted,
        live: false,
        requiredScopeHash: createScopeHash(parsed)
      },
      artifacts: [artifactPath]
    });
  }

  async executeJob(jobId: string) {
    const job = await this.store.get(jobId);
    if (!job) {
      return serviceResponseSchema.parse({
        status: 'error' as const,
        summary: `No runner job found for ${jobId}.`,
        correlationId: createCorrelationId('runner-exec')
      });
    }

    const prepared = this.launcher.prepare(job.jobType, job.scope);
    job.status = 'running';
    job.updatedAt = new Date().toISOString();
    await this.store.upsert(job);

    const execution = await this.launcher.execute(prepared);
    const logPath = await this.artifacts.writeJobArtifact(
      jobId,
      'execution.log',
      JSON.stringify(
        {
          command: execution.command,
          stdout: execution.stdout,
          stderr: execution.stderr,
          exitCode: execution.exitCode,
          executed: execution.executed
        },
        null,
        2
      )
    );

    job.status = execution.exitCode === 0 ? 'succeeded' : 'failed';
    job.updatedAt = new Date().toISOString();
    job.artifactPaths.push(logPath);
    await this.store.upsert(job);

    return serviceResponseSchema.parse({
      status: execution.exitCode === 0 ? 'ok' as const : 'error' as const,
      summary: execution.exitCode === 0
        ? `Runner job ${jobId} executed successfully.`
        : `Runner job ${jobId} failed during execution.`,
      correlationId: job.correlationId,
      approvalState: 'approved',
      details: {
        job,
        execution: {
          exitCode: execution.exitCode,
          executed: execution.executed,
          command: execution.command
        }
      },
      artifacts: job.artifactPaths
    });
  }

  async listJobs() {
    return this.store.readAll();
  }

  async ping(): Promise<string> {
    return 'infra-runner-ready';
  }
}
