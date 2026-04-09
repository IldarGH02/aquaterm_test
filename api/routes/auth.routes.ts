import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { config } from '../config';
import { requireAuth } from '../plugins/auth';
import { AuthService } from '../services/auth.service';

const loginSchema = z.object({
  login: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(200),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1).max(200),
  newPassword: z.string().min(8).max(200),
});

export async function registerAuthRoutes(fastify: FastifyInstance, authService: AuthService): Promise<void> {
  fastify.post(
    '/api/crm/auth/login',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
        },
      },
    },
    async (request, reply) => {
      const parsed = loginSchema.safeParse(request.body);
      if (!parsed.success) {
        reply.code(400).send({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
        return;
      }

      try {
        const result = await authService.login(parsed.data.login, parsed.data.password, {
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
        });

        reply.setCookie(config.cookieName, result.sid, {
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          maxAge: config.sessionTtlHours * 60 * 60,
        });

        reply.send({ user: result.user });
      } catch {
        reply.code(401).send({ error: 'INVALID_CREDENTIALS' });
      }
    },
  );

  fastify.post('/api/crm/auth/logout', { preHandler: [requireAuth] }, async (request, reply) => {
    const sid = request.cookies[config.cookieName];
    if (sid) {
      authService.logoutBySid(sid);
    }

    reply.clearCookie(config.cookieName, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    reply.send({ ok: true });
  });

  fastify.get('/api/crm/auth/me', { preHandler: [requireAuth] }, async (request, reply) => {
    reply.send({ user: request.currentUser });
  });

  fastify.post('/api/crm/auth/change-password', { preHandler: [requireAuth] }, async (request, reply) => {
    const parsed = changePasswordSchema.safeParse(request.body);
    if (!parsed.success) {
      reply.code(400).send({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
      return;
    }

    try {
      await authService.changePassword(request.currentUser!.id, parsed.data.oldPassword, parsed.data.newPassword);
      authService.logoutAllForUser(request.currentUser!.id);
      reply.clearCookie(config.cookieName, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
      reply.send({ ok: true });
    } catch (error) {
      if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
        reply.code(401).send({ error: 'INVALID_CREDENTIALS' });
        return;
      }

      reply.code(500).send({ error: 'INTERNAL_ERROR' });
    }
  });
}
