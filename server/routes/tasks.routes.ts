import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAuth, requireRole } from '../plugins/auth';
import { TASK_PRIORITIES, TASK_STATUSES } from '../types';
import { TaskService } from '../services/task.service';

const taskPrioritySchema = z.enum(TASK_PRIORITIES);
const taskStatusSchema = z.enum(TASK_STATUSES);

const createTaskSchema = z.object({
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().max(4000).optional(),
  priority: taskPrioritySchema.optional(),
  assigneeId: z.number().int().positive().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().trim().min(3).max(200).optional(),
  description: z.string().trim().max(4000).optional(),
  priority: taskPrioritySchema.optional(),
  assigneeId: z.number().int().positive().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

const changeStatusSchema = z.object({
  status: taskStatusSchema,
  comment: z.string().trim().max(1000).optional(),
});

const addCommentSchema = z.object({
  message: z.string().trim().min(1).max(4000),
});

const listQuerySchema = z.object({
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  assigneeId: z.coerce.number().int().positive().optional(),
  dueBefore: z.string().datetime().optional(),
  dueAfter: z.string().datetime().optional(),
});

export async function registerTaskRoutes(fastify: FastifyInstance, taskService: TaskService): Promise<void> {
  fastify.get('/api/crm/tasks', { preHandler: [requireAuth] }, async (request, reply) => {
    const parsed = listQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      reply.code(400).send({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
      return;
    }

    const tasks = taskService.listTasks(request.currentUser!, parsed.data);
    reply.send({ tasks });
  });

  fastify.post('/api/crm/tasks', { preHandler: [requireAuth, requireRole(['OWNER', 'MANAGER'])] }, async (request, reply) => {
    const parsed = createTaskSchema.safeParse(request.body);
    if (!parsed.success) {
      reply.code(400).send({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
      return;
    }

    const task = taskService.createTask(request.currentUser!, parsed.data);
    reply.code(201).send({ task });
  });

  fastify.patch('/api/crm/tasks/:id', { preHandler: [requireAuth, requireRole(['OWNER', 'MANAGER'])] }, async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    if (!Number.isInteger(id) || id <= 0) {
      reply.code(400).send({ error: 'INVALID_TASK_ID' });
      return;
    }

    const parsed = updateTaskSchema.safeParse(request.body);
    if (!parsed.success) {
      reply.code(400).send({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
      return;
    }

    try {
      const task = taskService.updateTask(request.currentUser!, id, parsed.data);
      reply.send({ task });
    } catch (error) {
      if (error instanceof Error && error.message === 'TASK_NOT_FOUND') {
        reply.code(404).send({ error: 'TASK_NOT_FOUND' });
        return;
      }

      reply.code(500).send({ error: 'INTERNAL_ERROR' });
    }
  });

  fastify.post('/api/crm/tasks/:id/status', { preHandler: [requireAuth] }, async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    if (!Number.isInteger(id) || id <= 0) {
      reply.code(400).send({ error: 'INVALID_TASK_ID' });
      return;
    }

    const parsed = changeStatusSchema.safeParse(request.body);
    if (!parsed.success) {
      reply.code(400).send({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
      return;
    }

    try {
      const task = taskService.changeStatus(request.currentUser!, id, parsed.data);
      reply.send({ task });
    } catch (error) {
      if (!(error instanceof Error)) {
        reply.code(500).send({ error: 'INTERNAL_ERROR' });
        return;
      }

      if (error.message === 'TASK_NOT_FOUND') {
        reply.code(404).send({ error: 'TASK_NOT_FOUND' });
        return;
      }

      if (error.message === 'FORBIDDEN') {
        reply.code(403).send({ error: 'FORBIDDEN' });
        return;
      }

      reply.code(500).send({ error: 'INTERNAL_ERROR' });
    }
  });

  fastify.get('/api/crm/tasks/:id/history', { preHandler: [requireAuth] }, async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    if (!Number.isInteger(id) || id <= 0) {
      reply.code(400).send({ error: 'INVALID_TASK_ID' });
      return;
    }

    try {
      const events = taskService.getTaskHistory(request.currentUser!, id);
      reply.send({ events });
    } catch (error) {
      if (!(error instanceof Error)) {
        reply.code(500).send({ error: 'INTERNAL_ERROR' });
        return;
      }

      if (error.message === 'TASK_NOT_FOUND') {
        reply.code(404).send({ error: 'TASK_NOT_FOUND' });
        return;
      }

      if (error.message === 'FORBIDDEN') {
        reply.code(403).send({ error: 'FORBIDDEN' });
        return;
      }

      reply.code(500).send({ error: 'INTERNAL_ERROR' });
    }
  });

  fastify.get('/api/crm/tasks/:id/comments', { preHandler: [requireAuth] }, async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    if (!Number.isInteger(id) || id <= 0) {
      reply.code(400).send({ error: 'INVALID_TASK_ID' });
      return;
    }

    try {
      const comments = taskService.getTaskComments(request.currentUser!, id);
      reply.send({ comments });
    } catch (error) {
      if (!(error instanceof Error)) {
        reply.code(500).send({ error: 'INTERNAL_ERROR' });
        return;
      }

      if (error.message === 'TASK_NOT_FOUND') {
        reply.code(404).send({ error: 'TASK_NOT_FOUND' });
        return;
      }

      if (error.message === 'FORBIDDEN') {
        reply.code(403).send({ error: 'FORBIDDEN' });
        return;
      }

      reply.code(500).send({ error: 'INTERNAL_ERROR' });
    }
  });

  fastify.post('/api/crm/tasks/:id/comments', { preHandler: [requireAuth] }, async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    if (!Number.isInteger(id) || id <= 0) {
      reply.code(400).send({ error: 'INVALID_TASK_ID' });
      return;
    }

    const parsed = addCommentSchema.safeParse(request.body);
    if (!parsed.success) {
      reply.code(400).send({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
      return;
    }

    try {
      const comment = taskService.addTaskComment(request.currentUser!, id, parsed.data.message);
      reply.code(201).send({ comment });
    } catch (error) {
      if (!(error instanceof Error)) {
        reply.code(500).send({ error: 'INTERNAL_ERROR' });
        return;
      }

      if (error.message === 'TASK_NOT_FOUND') {
        reply.code(404).send({ error: 'TASK_NOT_FOUND' });
        return;
      }

      if (error.message === 'FORBIDDEN') {
        reply.code(403).send({ error: 'FORBIDDEN' });
        return;
      }

      if (error.message === 'INVALID_COMMENT') {
        reply.code(400).send({ error: 'INVALID_COMMENT' });
        return;
      }

      reply.code(500).send({ error: 'INTERNAL_ERROR' });
    }
  });
}
