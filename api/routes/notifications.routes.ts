import type { FastifyInstance } from 'fastify';
import { requireAuth } from '../plugins/auth';
import { NotificationService } from '../services/notification.service';

export async function registerNotificationRoutes(
  fastify: FastifyInstance,
  notificationService: NotificationService,
): Promise<void> {
  fastify.get('/api/crm/notifications', { preHandler: [requireAuth] }, async (request, reply) => {
    const data = notificationService.listForUser(request.currentUser!.id);
    reply.send(data);
  });

  fastify.post('/api/crm/notifications/:id/read', { preHandler: [requireAuth] }, async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    if (!Number.isInteger(id) || id <= 0) {
      reply.code(400).send({ error: 'INVALID_NOTIFICATION_ID' });
      return;
    }

    const updated = notificationService.markAsRead(request.currentUser!.id, id);
    if (!updated) {
      reply.code(404).send({ error: 'NOTIFICATION_NOT_FOUND' });
      return;
    }

    reply.send({ ok: true });
  });
}
