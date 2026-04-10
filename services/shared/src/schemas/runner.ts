import { z } from 'zod';
import { approvalEnvelopeSchema, correlationIdSchema, operatorSchema } from './core.js';

export const runnerJobTypeSchema = z.enum([
  'terraform-plan',
  'terraform-apply',
  'ansible-check',
  'ansible-apply',
  'host-maintenance'
]);

export const runnerJobRequestSchema = z.object({
  jobType: runnerJobTypeSchema,
  repo: z.string().min(1),
  ref: z.string().min(1),
  environment: z.enum(['lab', 'staging', 'production']),
  scope: z.string().min(1),
  parameters: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).default({}),
  correlationId: correlationIdSchema,
  operator: operatorSchema,
  approval: approvalEnvelopeSchema.optional()
});
