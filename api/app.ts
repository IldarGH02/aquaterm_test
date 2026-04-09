import Fastify, { type FastifyInstance } from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import Database from 'better-sqlite3';
import { config } from './config';
import { closeDb, getDb } from './db';
import { runMigrations } from './db/migrate';
import { TelegramAdapter } from './adapters/telegram.adapter';
import { createAuthHook } from './plugins/auth';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';
import { TaskService } from './services/task.service';
import { DashboardService } from './services/dashboard.service';
import { LeadService } from './services/lead.service';
import { registerAuthRoutes } from './routes/auth.routes';
import { registerTaskRoutes } from './routes/tasks.routes';
import { registerUserRoutes } from './routes/users.routes';
import { registerDashboardRoutes } from './routes/dashboard.routes';
import { registerNotificationRoutes } from './routes/notifications.routes';
import { registerContactFormRoutes } from './routes/contact-form.routes';

export interface BuildAppOptions {
  db?: Database.Database;
  enableTelegramWorker?: boolean;
}

export async function buildApp(options: BuildAppOptions = {}): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });

  const ownDb = !options.db;
  const db = options.db || getDb();
  if (options.db) {
    runMigrations(db);
  }

  const authService = new AuthService(db);
  const notificationService = new NotificationService(db);
  const taskService = new TaskService(db, notificationService);
  const dashboardService = new DashboardService(db);
  const leadService = new LeadService(db, taskService);

  await authService.bootstrapOwner();

  try {
    const unclaimed = leadService.assignUnclaimedLeads();
    if (unclaimed.assigned > 0 || unclaimed.skipped > 0) {
      app.log.info(unclaimed, 'startup: unclaimed leads processed');
    }
  } catch (error) {
    app.log.error({ error }, 'startup: failed to assign unclaimed leads');
  }

  await app.register(cors, {
    origin: config.corsOrigin,
    credentials: true,
  });

  await app.register(cookie, {
    hook: 'preHandler',
  });

  await app.register(rateLimit, {
    global: false,
    continueExceeding: false,
    skipOnError: true,
  });

  app.decorateRequest('currentUser', null);
  app.addHook('preHandler', createAuthHook(db));

  app.get('/api/health', async () => ({ ok: true, service: 'crm-api' }));

  await registerAuthRoutes(app, authService);
  await registerTaskRoutes(app, taskService);
  await registerUserRoutes(app, authService);
  await registerDashboardRoutes(app, dashboardService);
  await registerNotificationRoutes(app, notificationService);
  await registerContactFormRoutes(app, leadService);

  let intervalId: NodeJS.Timeout | null = null;
  if (options.enableTelegramWorker !== false && config.telegramBotToken) {
    const adapter = new TelegramAdapter(db, config.telegramBotToken);
    intervalId = setInterval(() => {
      void adapter.flushOutbox().catch((error) => {
        app.log.error({ error }, 'Failed to flush telegram outbox');
      });
    }, config.telegramPollIntervalMs);

    intervalId.unref();
  }

  app.addHook('onClose', async () => {
    if (intervalId) {
      clearInterval(intervalId);
    }

    if (ownDb) {
      closeDb();
    }
  });

  return app;
}
