import {
  classifyRisk,
  clusterStatusRequestSchema,
  createCorrelationId,
  requiresApproval,
  serviceResponseSchema
} from '../../shared/src/index.js';
import { ProxmoxApiClient } from './client.js';
import { loadProxmoxConfig } from './config.js';

export class ProxmoxMcpService {
  private readonly config = loadProxmoxConfig();
  private readonly client = new ProxmoxApiClient(this.config);

  async getClusterStatus(input: Record<string, unknown> = {}) {
    const parsed = clusterStatusRequestSchema.parse({
      correlationId: createCorrelationId('cluster'),
      ...input
    });

    const risk = classifyRisk('get_cluster_status');
    const approvalRequired = requiresApproval(risk, parsed.environment);

    const response = {
      status: 'ok' as const,
      summary: 'Cluster status endpoint scaffolded. Live aggregation wiring is the next step.',
      correlationId: parsed.correlationId,
      approvalState: approvalRequired ? 'required' : 'not_required',
      details: {
        plannedCalls: ['/cluster/status', '/nodes', '/storage'],
        environment: parsed.environment,
        live: false
      }
    };

    return serviceResponseSchema.parse(response);
  }

  async ping(): Promise<string> {
    void this.client;
    return 'proxmox-mcp-ready';
  }
}
