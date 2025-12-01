import type { Todo } from '../types/todo';

const API_BASE = '/api/todos';

export const todosApi = {
  async getAllTodos(): Promise<Todo[]> {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch todos');
    return res.json();
  },

  async getTodo(id: string): Promise<Todo> {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error('Failed to fetch todo');
    return res.json();
  },

  async createTodo(title: string): Promise<Todo> {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error('Create failed');
    return res.json();
  },

  async updateTodo(
    id: string,
    updates: Partial<Omit<Todo, 'id' | 'createdAt'>>
  ): Promise<Todo> {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Update failed');
    return res.json();
  },

  async deleteTodo(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
  },
};
