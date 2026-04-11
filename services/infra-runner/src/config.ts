export interface RunnerConfig {
  environment: 'lab' | 'staging' | 'production';
  allowedRepos: string[];
  allowedImages: string[];
  artifactsDir: string;
  secretsDir: string;
  terraformImage: string;
  ansibleImage: string;
}

export function loadRunnerConfig(): RunnerConfig {
  const allowedImages = (process.env.RUNNER_ALLOWED_IMAGES ?? '').split(',').map((value) => value.trim()).filter(Boolean);
  return {
    environment: (process.env.CLAWMOX_ENV as 'lab' | 'staging' | 'production' | undefined)?.replace(' ','') as never ?? 'lab',
    allowedRepos: (process.env.RUNNER_ALLOWED_REPOS ?? '').split(',').map((value) => value.trim()).filter(Boolean),
    allowedImages,
    artifactsDir: process.env.RUNNER_ARTIFACTS_DIR ?? './artifacts',
    secretsDir: process.env.RUNNER_SECRETS_DIR ?? './secrets',
    terraformImage: process.env.RUNNER_TERRAFORM_IMAGE ?? allowedImages[0] ?? 'ghcr.io/lab7defensive/clawmox-terraform:latest',
    ansibleImage: process.env.RUNNER_ANSIBLE_IMAGE ?? allowedImages[1] ?? 'ghcr.io/lab7defensive/clawmox-ansible:latest'
  };
}
