import { buildApp } from './app';
import { config } from './config';

async function start(): Promise<void> {
  const app = await buildApp();

  try {
    await app.listen({ host: config.host, port: config.port });
    app.log.info(`CRM API started on http://${config.host}:${config.port}`);
  } catch (error) {
    app.log.error({ error }, 'Failed to start CRM API');
    process.exit(1);
  }

  const shutdown = async () => {
    await app.close();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

void start();
