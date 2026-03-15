import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { LeadService } from '../services/lead.service';

const contactFormSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(30),
  service: z.string().trim().max(100).optional(),
  timestamp: z.string().optional(),
});

export async function registerContactFormRoutes(fastify: FastifyInstance, leadService: LeadService): Promise<void> {
  fastify.post('/api/contact-form', async (request, reply) => {
    const parsed = contactFormSchema.safeParse(request.body);

    if (!parsed.success) {
      reply.code(400).send({ error: 'VALIDATION_ERROR' });
      return;
    }

    try {
      const result = leadService.createFromContactForm({
        name: parsed.data.name,
        phone: parsed.data.phone,
        service: parsed.data.service,
      });

      reply.send({ ok: true, leadId: result.leadId, taskId: result.taskId });
    } catch {
      // Keep UX resilient for the public landing form.
      reply.send({ ok: true });
    }
  });
}
