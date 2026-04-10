import type { ProxmoxConfig } from './config.js';

export class ProxmoxApiClient {
  constructor(private readonly config: ProxmoxConfig) {}

  private get authHeader(): string {
    return `PVEAPIToken=${this.config.tokenId}=${this.config.tokenSecret}`;
  }

  async get(path: string): Promise<unknown> {
    const response = await fetch(`${this.config.apiUrl}${path}`, {
      headers: {
        Authorization: this.authHeader
      }
    });

    if (!response.ok) {
      throw new Error(`Proxmox API GET failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}
