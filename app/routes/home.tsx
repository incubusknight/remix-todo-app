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
  return (
    <div className='min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4'>
      <div className='max-w-2xl mx-auto'>
        <div className='grid gap-6'>
          {/* Header */}
          <div>
            <h1 className='text-4xl font-bold text-gray-900 mb-2'>Remix Todo App</h1>
            <p className='text-gray-600'>
              A simple todo application using React Router (formerly known as Remix).
            </p>
          </div>
          <TodoList todos={todos} />
        </div>
      </div>
    </div>
  );
}
