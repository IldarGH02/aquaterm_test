import type Database from 'better-sqlite3';
import { TaskService } from './task.service';

export interface ContactLeadInput {
  name: string;
  phone: string;
  service?: string;
}

function sanitizeText(value: string, max = 255): string {
  return value.trim().replace(/[<>]/g, '').slice(0, max);
}

function buildLeadTaskDescription(input: ContactLeadInput): string {
  return [
    'Новая заявка с сайта АКВАТЕРМ.',
    `Имя: ${input.name}`,
    `Телефон: ${input.phone}`,
    `Услуга: ${input.service || 'Не указана'}`,
  ].join('\n');
}

function addHours(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

export class LeadService {
  constructor(
    private readonly db: Database.Database,
    private readonly taskService: TaskService,
  ) {}

  private pickManagerWithLeastOpenTasks(): number | null {
    const row = this.db
      .prepare(
        `
        SELECT
          u.id,
          COUNT(t.id) AS open_tasks
        FROM users u
        LEFT JOIN tasks t ON t.assignee_id = u.id AND t.status IN ('NEW', 'IN_PROGRESS', 'BLOCKED')
        WHERE u.role = 'MANAGER' AND u.is_active = 1
        GROUP BY u.id
        ORDER BY open_tasks ASC, u.id ASC
        LIMIT 1
      `,
      )
      .get() as { id: number } | undefined;

    return row?.id ?? null;
  }

  createFromContactForm(rawInput: ContactLeadInput): { leadId: number; taskId: number | null } {
    const input: ContactLeadInput = {
      name: sanitizeText(rawInput.name, 100),
      phone: sanitizeText(rawInput.phone, 30),
      service: rawInput.service ? sanitizeText(rawInput.service, 100) : '',
    };

    const leadInsert = this.db
      .prepare(
        `
        INSERT INTO leads (name, phone, service, source)
        VALUES (?, ?, ?, 'landing')
      `,
      )
      .run(input.name, input.phone, input.service || null);

    const leadId = Number(leadInsert.lastInsertRowid);
    const managerId = this.pickManagerWithLeastOpenTasks();

    if (!managerId) {
      return { leadId, taskId: null };
    }

    const task = this.taskService.createTask(null, {
      title: `Обработать лид: ${input.name}`,
      description: buildLeadTaskDescription(input),
      priority: 'NORMAL',
      assigneeId: managerId,
      dueDate: addHours(2),
      leadId,
    });

    return { leadId, taskId: task.id };
  }
}
