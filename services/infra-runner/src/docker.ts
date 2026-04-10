export interface PreparedContainerJob {
  image: string;
  command: string[];
  mounts: Array<{ source: string; target: string; readonly?: boolean }>;
  environment: Record<string, string>;
}

export class DockerJobLauncher {
  prepare(jobType: string): PreparedContainerJob {
    return {
      image: jobType.startsWith('terraform')
        ? 'ghcr.io/lab7defensive/clawmox-terraform:latest'
        : 'ghcr.io/lab7defensive/clawmox-ansible:latest',
      command: ['echo', `placeholder-${jobType}`],
      mounts: [],
      environment: {}
    };
  }
}
