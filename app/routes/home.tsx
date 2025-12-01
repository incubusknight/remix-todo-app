import type { Route } from './+types/home';
import { Form } from 'react-router';
import { TodosRepository } from '~/db/.server/todos.repository';
import { TodoList } from '../components/TodoList';
import { useState, useEffect } from 'react';

// This code is executed in the server before rendering the component.
// We can leverage low level access to the database here.
export async function loader() {
  return { todos: TodosRepository.getAll() };
}

// Server action to handle todo creation
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const title = formData.get('title');

  if (typeof title !== 'string' || !title.trim()) {
    // This error is not being handled on purpose
    return { error: 'Title is required' };
  }

  const todo = TodosRepository.create({
    id: Date.now().toString(),
    title: title.trim(),
    createdAt: Date.now(),
  });

  // Send todo object
  return { todo };
}

// This is the React component for the home route
export default function Home({ loaderData, actionData }: Route.ComponentProps) {
  const { todos } = loaderData;
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Clear input after successful submission (when todo was sent by action)
    if (actionData?.todo) {
      setInputValue('');
    }
  }, [actionData]);

  return (
    <div className='min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4'>
      <div className='max-w-2xl mx-auto'>
        <div className='grid gap-6'>
          {/* Header */}
          <header>
            <h1 className='text-4xl font-bold text-gray-900 mb-2'>Remix Todo App</h1>
            <p className='text-gray-600'>
              A simple todo application using React Router (formerly known as Remix).
            </p>
          </header>

          {/* Input Form section */}
          <section className='bg-white rounded-lg shadow-md p-6'>
            <Form method='post' className='flex gap-2'>
              <input
                type='text'
                name='title'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder='Add a new todo...'
                autoComplete='off'
                className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <button
                type='submit'
                disabled={!inputValue.trim()}
                className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400'
              >
                Add
              </button>
            </Form>
          </section>

          {/* Todo List Section */}
          <TodoList todos={todos} />
        </div>
      </div>
    </div>
  );
}
