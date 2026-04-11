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
  command: string[];
}

export class DockerJobLauncher {
  constructor(
    private readonly images: { terraform: string; ansible: string },
    private readonly secretsDir: string,
    private readonly artifactsDir: string
  ) {}

  prepare(jobType: string, scope: string): PreparedContainerJob {
    const isTerraform = jobType.startsWith('terraform');
    const safeScope = scope.replace(/[^a-zA-Z0-9_./-]/g, '_');

    return {
      image: isTerraform ? this.images.terraform : this.images.ansible,
      command: isTerraform
        ? ['sh', '-lc', `echo terraform-run-placeholder && echo scope=${safeScope} && ls -la /workspace || true`]
        : ['sh', '-lc', `echo ansible-run-placeholder && echo scope=${safeScope} && ls -la /workspace || true`],
      mounts: [
        { source: this.artifactsDir, target: '/artifacts' },
        { source: this.secretsDir, target: '/run/clawmox-secrets', readonly: true }
      ],
      environment: {
        CLAWMOX_SECRETS_DIR: '/run/clawmox-secrets'
      }
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
        resolve({ exitCode: 1, stdout, stderr: `${stderr}\n${String(error)}`, executed: false, command: dockerArgs });
      });
      child.on('close', (code) => {
        resolve({ exitCode: code ?? 1, stdout, stderr, executed: true, command: dockerArgs });
      });
    });
  }
}
