import type {
  ProxmoxClusterStatusEntry,
  ProxmoxEnvelope,
  ProxmoxGuestSummary,
  ProxmoxNodeStatus,
  ProxmoxStorageSummary
} from './types.js';
import type { ProxmoxConfig } from './config.js';

export class ProxmoxApiClient {
  constructor(private readonly config: ProxmoxConfig) {}

  private get authHeader(): string {
    return `PVEAPIToken=${this.config.tokenId}=${this.config.tokenSecret}`;
  }

  private async request<T>(path: string): Promise<T> {
    const response = await fetch(`${this.config.apiUrl}${path}`, {
      headers: {
        Authorization: this.authHeader
      }
    });

    if (!response.ok) {
      throw new Error(`Proxmox API request failed: ${response.status} ${response.statusText} for ${path}`);
    }

    const payload = (await response.json()) as ProxmoxEnvelope<T>;
    return payload.data;
  }

  async getClusterStatus(): Promise<ProxmoxClusterStatusEntry[]> {
    return this.request<ProxmoxClusterStatusEntry[]>('/cluster/status');
  }

  async listNodes(): Promise<Array<{ node: string; status?: string; cpu?: number; maxmem?: number; mem?: number }>> {
    return this.request('/nodes');
  }

  async getNodeStatus(node: string): Promise<ProxmoxNodeStatus> {
    return this.request<ProxmoxNodeStatus>(`/nodes/${node}/status`);
  }

  async listQemu(node: string): Promise<ProxmoxGuestSummary[]> {
    return this.request<ProxmoxGuestSummary[]>(`/nodes/${node}/qemu`);
  }

  async listLxc(node: string): Promise<ProxmoxGuestSummary[]> {
    return this.request<ProxmoxGuestSummary[]>(`/nodes/${node}/lxc`);
  }

  async getQemuConfig(node: string, vmid: number): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>(`/nodes/${node}/qemu/${vmid}/config`);
  }

  async getLxcConfig(node: string, vmid: number): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>(`/nodes/${node}/lxc/${vmid}/config`);
  }

  async listQemuSnapshots(node: string, vmid: number): Promise<Array<Record<string, unknown>>> {
    return this.request<Array<Record<string, unknown>>>(`/nodes/${node}/qemu/${vmid}/snapshot`);
  }

  async listLxcSnapshots(node: string, vmid: number): Promise<Array<Record<string, unknown>>> {
    return this.request<Array<Record<string, unknown>>>(`/nodes/${node}/lxc/${vmid}/snapshot`);
  }

  async listStorage(node: string): Promise<ProxmoxStorageSummary[]> {
    return this.request<ProxmoxStorageSummary[]>(`/nodes/${node}/storage`);
  }

  async listTasks(node: string, limit = 25): Promise<Array<Record<string, unknown>>> {
    return this.request<Array<Record<string, unknown>>>(`/nodes/${node}/tasks?limit=${limit}`);
  }

  async listBackupContent(node: string, storage: string): Promise<Array<Record<string, unknown>>> {
    return this.request<Array<Record<string, unknown>>>(`/nodes/${node}/storage/${storage}/content`);
  }
}
