import type { Route } from './+types/index';
import { TodosRepository } from '../../../db/.server/todos.repository';

// GET /api/todos
export const loader = (_args: Route.LoaderArgs) => {
  const todos = TodosRepository.getAll();
  return Response.json(todos);
};

// POST /api/todos
export const action = async ({ request }: Route.ActionArgs) => {
  switch (request.method) {
    case 'POST':
      const body = await request.json() as { title?: string };
      if (!body.title?.trim()) {
        return new Response(null, { status: 400 });
      }

      const todo = TodosRepository.create({
        id: Date.now().toString(), 
        title: body.title.trim(), 
        createdAt: Date.now()
      });

      return Response.json(todo, { status: 201 });
  }

  return new Response(null, { status: 405 });
};
