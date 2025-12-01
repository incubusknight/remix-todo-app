import db from '.';

// In a real world scenario, we might have specific entity types, but for this example, we'll keep it simple
// and use the same Todo type as defined in the application.
import type { Todo } from '~/types/todo';

export class TodosRepository {
  static getAll() {
    const rows = db
      .prepare<unknown[], Todo>('SELECT id, title, completed, createdAt FROM todos ORDER BY createdAt DESC')
      .all();
    return rows.map((r) => ({ ...r, completed: Boolean(r.completed) }));
  }
  
  static getById(id: string): Todo | null {
    const row = db
      .prepare<string, Todo>('SELECT id, title, completed, createdAt FROM todos WHERE id = ?')
      .get(id);
    if (!row) return null;
    return { ...row, completed: Boolean(row.completed) };
  }

  static create(todo: Omit<Todo, 'completed'>): Todo | null {
    db
      .prepare('INSERT INTO todos (id, title, completed, createdAt) VALUES (?, ?, 0, ?)')
      .run(todo.id, todo.title, todo.createdAt);
    return this.getById(todo.id);
  }

  static update(id: string, fields: { title?: string; completed?: boolean }) {
    const parts: string[] = [];
    const values: any[] = [];
    if (fields.title?.trim()) {
      parts.push('title = ?');
      values.push(fields.title);
    }
    if (fields.completed !== undefined) {
      parts.push('completed = ?');
      values.push(fields.completed ? 1 : 0);
    }
    if (parts.length) {
      values.push(id);
      const sql = `UPDATE todos SET ${parts.join(', ')} WHERE id = ?`;
      db.prepare(sql).run(...values);
    }
    return this.getById(id);
  }

  static delete(id: string) {
    const info = db.prepare('DELETE FROM todos WHERE id = ?').run(id);
    return !!info.changes;
  }
}
