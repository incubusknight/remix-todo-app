import type { Route } from './+types/home';
import { TodosRepository } from '~/db/todos.repository';
import { TodoList } from '../components/TodoList';

// This code is executed in the server before rendering the component.
// We can leverage low level access to the database here.
export async function loader() {
  return { todos: TodosRepository.getAll() };
}

// This is the React component for the home route
export default function Home({ loaderData }: Route.ComponentProps) {
  const { todos } = loaderData;
  return <TodoList todos={todos} />;
}
