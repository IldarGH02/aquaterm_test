import test from 'node:test';
import assert from 'node:assert/strict';
import Database from 'better-sqlite3';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../app';

interface TestContext {
  app: FastifyInstance;
  db: Database.Database;
}

async function setup(): Promise<TestContext> {
  const db = new Database(':memory:');
  const app = await buildApp({ db, enableTelegramWorker: false });
  await app.ready();
  return { app, db };
}

async function teardown(context: TestContext): Promise<void> {
  await context.app.close();
  context.db.close();
}

async function login(app: FastifyInstance, loginValue: string, password: string): Promise<string> {
  const response = await app.inject({
    method: 'POST',
    url: '/api/crm/auth/login',
    payload: { login: loginValue, password },
  });

  assert.equal(response.statusCode, 200);
  const cookie = response.cookies.find((entry) => entry.name === 'crm_sid');
  assert.ok(cookie, 'crm_sid cookie should be set');
  return `${cookie.name}=${cookie.value}`;
}

test('auth: login and me', async () => {
  const context = await setup();
  try {
    const sessionCookie = await login(context.app, 'owner', 'ChangeMe123!');

    const meResponse = await context.app.inject({
      method: 'GET',
      url: '/api/crm/auth/me',
      headers: { cookie: sessionCookie },
    });

    assert.equal(meResponse.statusCode, 200);
    const body = meResponse.json() as { user: { login: string; role: string } };
    assert.equal(body.user.login, 'owner');
    assert.equal(body.user.role, 'OWNER');
  } finally {
    await teardown(context);
  }
});

test('RBAC: engineer cannot create users', async () => {
  const context = await setup();
  try {
    const ownerCookie = await login(context.app, 'owner', 'ChangeMe123!');

    const createEngineerResponse = await context.app.inject({
      method: 'POST',
      url: '/api/crm/users',
      headers: { cookie: ownerCookie },
      payload: {
        login: 'eng1',
        password: 'StrongPass123!',
        role: 'ENGINEER',
      },
    });

    assert.equal(createEngineerResponse.statusCode, 201);

    const engineerCookie = await login(context.app, 'eng1', 'StrongPass123!');

    const forbiddenResponse = await context.app.inject({
      method: 'POST',
      url: '/api/crm/users',
      headers: { cookie: engineerCookie },
      payload: {
        login: 'eng2',
        password: 'StrongPass123!',
        role: 'ENGINEER',
      },
    });

    assert.equal(forbiddenResponse.statusCode, 403);
  } finally {
    await teardown(context);
  }
});

test('task lifecycle: status transitions and completion notification', async () => {
  const context = await setup();
  try {
    const ownerCookie = await login(context.app, 'owner', 'ChangeMe123!');

    const createEngineerResponse = await context.app.inject({
      method: 'POST',
      url: '/api/crm/users',
      headers: { cookie: ownerCookie },
      payload: {
        login: 'eng1',
        password: 'StrongPass123!',
        role: 'ENGINEER',
      },
    });

    assert.equal(createEngineerResponse.statusCode, 201);
    const engineer = (createEngineerResponse.json() as { user: { id: number } }).user;

    const createTaskResponse = await context.app.inject({
      method: 'POST',
      url: '/api/crm/tasks',
      headers: { cookie: ownerCookie },
      payload: {
        title: 'Проверить котел',
        description: 'Диагностика',
        assigneeId: engineer.id,
        priority: 'HIGH',
      },
    });

    assert.equal(createTaskResponse.statusCode, 201);
    const taskId = (createTaskResponse.json() as { task: { id: number } }).task.id;

    const engineerCookie = await login(context.app, 'eng1', 'StrongPass123!');

    const inProgressResponse = await context.app.inject({
      method: 'POST',
      url: `/api/crm/tasks/${taskId}/status`,
      headers: { cookie: engineerCookie },
      payload: { status: 'IN_PROGRESS' },
    });

    assert.equal(inProgressResponse.statusCode, 200);

    const doneResponse = await context.app.inject({
      method: 'POST',
      url: `/api/crm/tasks/${taskId}/status`,
      headers: { cookie: engineerCookie },
      payload: { status: 'DONE', comment: 'Готово' },
    });

    assert.equal(doneResponse.statusCode, 200);
    const doneTask = (doneResponse.json() as { task: { status: string; actualMinutes: number | null; completedAt: string | null } }).task;
    assert.equal(doneTask.status, 'DONE');
    assert.ok(doneTask.completedAt);
    assert.ok(doneTask.actualMinutes !== null);

    const notificationsResponse = await context.app.inject({
      method: 'GET',
      url: '/api/crm/notifications',
      headers: { cookie: ownerCookie },
    });

    assert.equal(notificationsResponse.statusCode, 200);
    const notificationsBody = notificationsResponse.json() as {
      notifications: Array<{ type: string }>;
      unreadCount: number;
    };

    assert.ok(notificationsBody.notifications.some((item) => item.type === 'TASK_COMPLETED'));
    assert.ok(notificationsBody.unreadCount >= 1);
  } finally {
    await teardown(context);
  }
});

test('task comments: creator and assignee can chat in task', async () => {
  const context = await setup();
  try {
    const ownerCookie = await login(context.app, 'owner', 'ChangeMe123!');

    const createEngineerResponse = await context.app.inject({
      method: 'POST',
      url: '/api/crm/users',
      headers: { cookie: ownerCookie },
      payload: {
        login: 'chateng',
        password: 'StrongPass123!',
        role: 'ENGINEER',
      },
    });

    assert.equal(createEngineerResponse.statusCode, 201);
    const engineerId = (createEngineerResponse.json() as { user: { id: number } }).user.id;

    const createTaskResponse = await context.app.inject({
      method: 'POST',
      url: '/api/crm/tasks',
      headers: { cookie: ownerCookie },
      payload: {
        title: 'Чат по задаче',
        description: 'Проверка комментариев',
        assigneeId: engineerId,
      },
    });

    assert.equal(createTaskResponse.statusCode, 201);
    const taskId = (createTaskResponse.json() as { task: { id: number } }).task.id;

    const engineerCookie = await login(context.app, 'chateng', 'StrongPass123!');

    const ownerCommentResponse = await context.app.inject({
      method: 'POST',
      url: `/api/crm/tasks/${taskId}/comments`,
      headers: { cookie: ownerCookie },
      payload: {
        message: 'Нужно проверить котел до обеда',
      },
    });
    assert.equal(ownerCommentResponse.statusCode, 201);

    const engineerCommentResponse = await context.app.inject({
      method: 'POST',
      url: `/api/crm/tasks/${taskId}/comments`,
      headers: { cookie: engineerCookie },
      payload: {
        message: 'Принял, выезжаю на объект',
      },
    });
    assert.equal(engineerCommentResponse.statusCode, 201);

    const commentsResponse = await context.app.inject({
      method: 'GET',
      url: `/api/crm/tasks/${taskId}/comments`,
      headers: { cookie: ownerCookie },
    });

    assert.equal(commentsResponse.statusCode, 200);
    const commentsBody = commentsResponse.json() as {
      comments: Array<{ message: string; authorLogin: string }>;
    };

    assert.equal(commentsBody.comments.length, 2);
    assert.equal(commentsBody.comments[0]?.authorLogin, 'owner');
    assert.equal(commentsBody.comments[1]?.authorLogin, 'chateng');
  } finally {
    await teardown(context);
  }
});

test('contact-form creates leads and auto-assigns to manager with least open tasks', async () => {
  const context = await setup();
  try {
    const ownerCookie = await login(context.app, 'owner', 'ChangeMe123!');

    const manager1Response = await context.app.inject({
      method: 'POST',
      url: '/api/crm/users',
      headers: { cookie: ownerCookie },
      payload: {
        login: 'manager1',
        password: 'StrongPass123!',
        role: 'MANAGER',
      },
    });

    const manager2Response = await context.app.inject({
      method: 'POST',
      url: '/api/crm/users',
      headers: { cookie: ownerCookie },
      payload: {
        login: 'manager2',
        password: 'StrongPass123!',
        role: 'MANAGER',
      },
    });

    assert.equal(manager1Response.statusCode, 201);
    assert.equal(manager2Response.statusCode, 201);

    const manager1Id = (manager1Response.json() as { user: { id: number } }).user.id;
    const manager2Id = (manager2Response.json() as { user: { id: number } }).user.id;

    const firstLead = await context.app.inject({
      method: 'POST',
      url: '/api/contact-form',
      payload: {
        name: 'Иван',
        phone: '+79201234567',
        service: 'heating',
      },
    });

    const secondLead = await context.app.inject({
      method: 'POST',
      url: '/api/contact-form',
      payload: {
        name: 'Петр',
        phone: '+79207654321',
        service: 'water',
      },
    });

    assert.equal(firstLead.statusCode, 200);
    assert.equal(secondLead.statusCode, 200);

    const tasksResponse = await context.app.inject({
      method: 'GET',
      url: '/api/crm/tasks',
      headers: { cookie: ownerCookie },
    });

    assert.equal(tasksResponse.statusCode, 200);
    const tasks = (tasksResponse.json() as { tasks: Array<{ assigneeId: number | null }> }).tasks;

    const assignedToManager1 = tasks.filter((task) => task.assigneeId === manager1Id).length;
    const assignedToManager2 = tasks.filter((task) => task.assigneeId === manager2Id).length;

    assert.equal(assignedToManager1, 1);
    assert.equal(assignedToManager2, 1);
  } finally {
    await teardown(context);
  }
});
