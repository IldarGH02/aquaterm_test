import type { FastifyInstance } from 'fastify';
import { requireAuth, requireRole } from '../plugins/auth';
import { DashboardService } from '../services/dashboard.service';

export async function registerDashboardRoutes(
  fastify: FastifyInstance,
  dashboardService: DashboardService,
): Promise<void> {
  const guard = [requireAuth, requireRole(['OWNER', 'MANAGER'])];

  fastify.get('/api/crm/dashboard/overview', { preHandler: guard }, async (_request, reply) => {
    const overview = dashboardService.getOverview();
    reply.send({ overview });
  });

  fastify.get('/api/crm/dashboard/workload', { preHandler: guard }, async (_request, reply) => {
    const workload = dashboardService.getWorkload();
    reply.send({ workload });
  });

  fastify.get('/api/crm/dashboard/completion', { preHandler: guard }, async (_request, reply) => {
    const completion = dashboardService.getCompletion();
    reply.send({ completion });
  });
}
