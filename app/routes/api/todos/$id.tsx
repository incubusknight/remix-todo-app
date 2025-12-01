import type { Route } from './+types/$id';
import type { Todo } from '~/types/todo';
import { TodosRepository } from '../../../db/todos.repository';

// PATCH /api/todos/:id
// PUT /api/todos/:id
// DELETE /api/todos/:id
export const action = async ({ params, request }: Route.ActionArgs) => {
  const id = params.id as string;

  switch (request.method) {
    case 'PATCH':
    case 'PUT': {
      // We might want to validate the body more thoroughly in a real app
      const body = await request.json() as Partial<Omit<Todo, 'id' | 'createdAt'>>;
      const updated = TodosRepository.update(id, {
        title: body.title?.trim() || undefined,
        completed: body.completed ?? undefined,
      });

      if (!updated) return new Response(null, { status: 404 });
      return Response.json(updated);
    }
    case 'DELETE': {
      const ok = TodosRepository.delete(id);
      return new Response(null, { status: ok ? 204 : 404 });
    }
  }

  return new Response(null, { status: 405 });
}

// GET /api/todos/:id
export const loader = ({ params }: Route.LoaderArgs) => {
  const todo = TodosRepository.getById(params.id as string);
  if (!todo) return new Response(null, { status: 404 });
  return Response.json(todo);
};
