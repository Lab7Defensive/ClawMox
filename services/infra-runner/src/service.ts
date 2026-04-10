import {
  classifyRisk,
  createCorrelationId,
  requiresApproval,
  runnerJobRequestSchema,
  serviceResponseSchema
} from '../../shared/src/index.js';
import { loadRunnerConfig } from './config.js';
import { DockerJobLauncher } from './docker.js';

export class InfraRunnerService {
  private readonly config = loadRunnerConfig();
  private readonly launcher = new DockerJobLauncher();

  async submitJob(input: Record<string, unknown> = {}) {
    const parsed = runnerJobRequestSchema.parse({
      correlationId: createCorrelationId('runner'),
      ...input
    });

    const risk = classifyRisk(parsed.jobType);
    const approvalRequired = requiresApproval(risk, parsed.environment);
    const prepared = this.launcher.prepare(parsed.jobType);

    const response = {
      status: 'ok' as const,
      summary: `Runner job scaffolded for ${parsed.jobType}. Container execution wiring is the next step.`,
      correlationId: parsed.correlationId,
      approvalState: approvalRequired ? 'required' : 'not_required',
      details: {
        accepted: this.config.allowedRepos.includes(parsed.repo) || this.config.allowedRepos.length === 0,
        preparedImage: prepared.image,
        environment: parsed.environment,
        live: false
      }
    };

    return serviceResponseSchema.parse(response);
  }

  async ping(): Promise<string> {
    return 'infra-runner-ready';
  }
}
