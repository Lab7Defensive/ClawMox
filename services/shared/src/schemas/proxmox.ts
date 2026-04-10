import { z } from 'zod';
import { approvalEnvelopeSchema, correlationIdSchema, operatorSchema } from './core.js';

export const proxmoxEnvironmentSchema = z.enum(['lab', 'staging', 'production']);

export const clusterStatusRequestSchema = z.object({
  environment: proxmoxEnvironmentSchema.default('lab'),
  correlationId: correlationIdSchema,
  operator: operatorSchema
});

export const guestActionRequestSchema = z.object({
  environment: proxmoxEnvironmentSchema,
  node: z.string().min(1),
  guestId: z.number().int().positive(),
  guestType: z.enum(['vm', 'lxc']),
  correlationId: correlationIdSchema,
  operator: operatorSchema,
  approval: approvalEnvelopeSchema.optional()
});

export const cloneVmRequestSchema = z.object({
  environment: proxmoxEnvironmentSchema,
  targetNode: z.string().min(1),
  templateId: z.string().min(1),
  vmName: z.string().min(1),
  profile: z.string().min(1),
  targetStorage: z.string().min(1),
  networkProfile: z.string().min(1),
  correlationId: correlationIdSchema,
  operator: operatorSchema,
  approval: approvalEnvelopeSchema.optional()
});
