import fs from 'node:fs';
import path from 'node:path';
import type Database from 'better-sqlite3';

export function runMigrations(db: Database.Database): void {
  const migrationsDir = path.resolve(process.cwd(), 'migrations');

  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  const appliedRows = db.prepare('SELECT name FROM schema_migrations').all() as { name: string }[];
  const applied = new Set(appliedRows.map((row) => row.name));

  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((fileName) => fileName.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b));

  for (const migrationFile of migrationFiles) {
    if (applied.has(migrationFile)) {
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, migrationFile), 'utf8');
    const transaction = db.transaction(() => {
      db.exec(sql);
      db.prepare('INSERT INTO schema_migrations (name) VALUES (?)').run(migrationFile);
    });

    transaction();
  }
}
