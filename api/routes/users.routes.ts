import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAuth, requireRole } from '../plugins/auth';
import { USER_ROLES } from '../types';
import { AuthService } from '../services/auth.service';

const roleSchema = z.enum(USER_ROLES);

const createUserSchema = z.object({
  login: z.string().trim().min(3).max(100).regex(/^[a-zA-Z0-9_.-]+$/),
  password: z.string().min(8).max(200),
  role: roleSchema,
  telegramChatId: z.string().trim().max(100).optional().nullable(),
  mustChangePassword: z.boolean().optional(),
});

const updateUserSchema = z.object({
  role: roleSchema.optional(),
  isActive: z.boolean().optional(),
  telegramChatId: z.string().trim().max(100).optional().nullable(),
  password: z.string().min(8).max(200).optional(),
  mustChangePassword: z.boolean().optional(),
});

export async function registerUserRoutes(fastify: FastifyInstance, authService: AuthService): Promise<void> {
  fastify.get('/api/crm/users', { preHandler: [requireAuth, requireRole(['OWNER', 'MANAGER'])] }, async (_request, reply) => {
    const users = authService.listUsers();
    reply.send({ users });
  });

  fastify.post('/api/crm/users', { preHandler: [requireAuth, requireRole(['OWNER'])] }, async (request, reply) => {
    const parsed = createUserSchema.safeParse(request.body);
    if (!parsed.success) {
      reply.code(400).send({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
      return;
    }

    try {
      const user = await authService.createUser(parsed.data);
      reply.code(201).send({ user });
    } catch (error) {
      if (error instanceof Error && /UNIQUE constraint failed/.test(error.message)) {
        reply.code(409).send({ error: 'LOGIN_EXISTS' });
        return;
      }

      reply.code(500).send({ error: 'INTERNAL_ERROR' });
    }
  });

  fastify.patch('/api/crm/users/:id', { preHandler: [requireAuth, requireRole(['OWNER'])] }, async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    if (!Number.isInteger(id) || id <= 0) {
      reply.code(400).send({ error: 'INVALID_USER_ID' });
      return;
    }

    const parsed = updateUserSchema.safeParse(request.body);
    if (!parsed.success) {
      reply.code(400).send({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
      return;
    }

    try {
      const user = await authService.updateUser(id, parsed.data);
      if (!user) {
        reply.code(404).send({ error: 'USER_NOT_FOUND' });
        return;
      }

      reply.send({ user });
    } catch {
      reply.code(500).send({ error: 'INTERNAL_ERROR' });
    }
  });
}
