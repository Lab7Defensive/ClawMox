import { z } from 'zod';

export const correlationIdSchema = z.string().min(8);

export const operatorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  source: z.string().min(1).default('openclaw')
});

export const approvalEnvelopeSchema = z.object({
  approvalId: z.string().min(1),
  requestedAt: z.string().min(1),
  approvedAt: z.string().min(1).optional(),
  approvedBy: z.string().min(1).optional(),
  expiresAt: z.string().min(1).optional()
});

export const serviceResponseSchema = z.object({
  status: z.enum(['ok', 'error']),
  summary: z.string(),
  correlationId: correlationIdSchema,
  approvalState: z.enum(['not_required', 'required', 'approved', 'rejected', 'expired']).optional(),
  details: z.unknown().optional(),
  artifacts: z.array(z.string()).optional()
});

export type Operator = z.infer<typeof operatorSchema>;
export type ApprovalEnvelope = z.infer<typeof approvalEnvelopeSchema>;
export type ServiceResponse = z.infer<typeof serviceResponseSchema>;
