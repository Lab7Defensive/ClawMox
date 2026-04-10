export interface RunnerConfig {
  environment: 'lab' | 'staging' | 'production';
  allowedRepos: string[];
  allowedImages: string[];
  artifactsDir: string;
}

export function loadRunnerConfig(): RunnerConfig {
  return {
    environment: (process.env.CLAWMOX_ENV as 'lab' | 'staging' | 'production' | undefined) ?? 'lab',
    allowedRepos: (process.env.RUNNER_ALLOWED_REPOS ?? '').split(',').map((value) => value.trim()).filter(Boolean),
    allowedImages: (process.env.RUNNER_ALLOWED_IMAGES ?? '').split(',').map((value) => value.trim()).filter(Boolean),
    artifactsDir: process.env.RUNNER_ARTIFACTS_DIR ?? './artifacts'
  };
}
