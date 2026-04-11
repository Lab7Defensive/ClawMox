import { spawn } from 'node:child_process';

export interface PreparedContainerJob {
  image: string;
  command: string[];
  mounts: Array<{ source: string; target: string; readonly?: boolean }>;
  environment: Record<string, string>;
}

export interface ExecutionResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  executed: boolean;
}

export class DockerJobLauncher {
  prepare(jobType: string): PreparedContainerJob {
    return {
      image: jobType.startsWith('terraform')
        ? 'ghcr.io/lab7defensive/clawmox-terraform:latest'
        : 'ghcr.io/lab7defensive/clawmox-ansible:latest',
      command: ['sh', '-lc', `echo placeholder-${jobType}`],
      mounts: [],
      environment: {}
    };
  }

  async execute(prepared: PreparedContainerJob): Promise<ExecutionResult> {
    const dockerArgs = ['run', '--rm'];
    for (const mount of prepared.mounts) {
      dockerArgs.push('-v', `${mount.source}:${mount.target}${mount.readonly ? ':ro' : ''}`);
    }
    for (const [key, value] of Object.entries(prepared.environment)) {
      dockerArgs.push('-e', `${key}=${value}`);
    }
    dockerArgs.push(prepared.image, ...prepared.command);

    return new Promise((resolve) => {
      const child = spawn('docker', dockerArgs, { stdio: ['ignore', 'pipe', 'pipe'] });
      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
      child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
      child.on('error', (error) => {
        resolve({ exitCode: 1, stdout, stderr: `${stderr}\n${String(error)}`, executed: false });
      });
      child.on('close', (code) => {
        resolve({ exitCode: code ?? 1, stdout, stderr, executed: true });
      });
    });
  }
}
