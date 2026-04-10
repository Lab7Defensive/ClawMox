export interface ProxmoxConfig {
  apiUrl: string;
  tokenId: string;
  tokenSecret: string;
  environment: 'lab' | 'staging' | 'production';
}

export function loadProxmoxConfig(): ProxmoxConfig {
  return {
    apiUrl: process.env.PROXMOX_API_URL ?? '',
    tokenId: process.env.PROXMOX_API_TOKEN_ID ?? '',
    tokenSecret: process.env.PROXMOX_API_TOKEN_SECRET ?? '',
    environment: (process.env.CLAWMOX_ENV as 'lab' | 'staging' | 'production' | undefined)?.replace(' ','') as never
      ?? 'lab'
  };
}
