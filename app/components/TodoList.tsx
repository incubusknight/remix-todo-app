import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { Todo, TodoState } from '../types/todo';
import { TodoItem } from './TodoItem';
import EditTodoModal from './EditTodoModal';
import { TodosApi } from '../services/todos.api';
import Badge from './shared/Badge';

export type TodoListProps = {
  todos: Todo[];
};

export function TodoList({ todos: initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<'all' | TodoState>('all');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const navigate = useNavigate();
  const { id: editIdParam } = useParams();
  const [todoStateCounts, setTodoStateCounts] = useState<Record<TodoState, number>>({ active: 0, completed: 0 });

  const todoStates: TodoState[] = ['active', 'completed'];
  const todoStateLabels: Record<TodoState, string> = {
    active: 'Active',
    completed: 'Completed',
  };
  const todoStateColors: Record<TodoState, string[]> = {
    active: ['bg-blue-600', 'text-blue-600'],
    completed: ['bg-emerald-600', 'text-emerald-600'],
  };

  const addTodo = async () => {
    const title = input.trim();
    if (!title) return;
    try {
      const created = await TodosApi.create(title);
      setTodos((prev) => [created, ...prev]);
      setInput('');
    } catch (err) {
      console.error('Failed to create todo', err);
    }
  };

  const toggleTodo = async (id: string) => {
    const t = todos.find((x) => x.id === id);
    if (!t) return;
    const newVal = !t.completed;
    // optimistic update
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: newVal } : todo)));
    try {
      await TodosApi.update(id, { completed: newVal });
    } catch (err) {
      console.error('Failed to update todo', err);
      // revert
      setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: t.completed } : todo)));
    }
  };

  const deleteTodo = async (id: string) => {
    // optimistic update
    const before = todos;
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    try {
      await TodosApi.delete(id);
    } catch (err) {
      console.error('Failed to delete todo', err);
      setTodos(before);
    }
  };

  const editTodo = async (id: string, title: string) => {
    const t = todos.find((x) => x.id === id);
    if (!t) return;
    const before = todos;
    // optimistic update
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, title } : todo)));
    try {
      await TodosApi.update(id, { title });
    } catch (err) {
      console.error('Failed to edit todo', err);
      setTodos(before);
    }
  };

  const requestEdit = (id: string) => {
    const t = todos.find((x) => x.id === id) ?? null;
    if (!t) return;
    // navigate to path-based edit route
    navigate(`/${id}`);
    setEditingTodo(t);
  };

  const handleSaveEdit = async (id: string, title: string) => {
    await editTodo(id, title);
    setEditingTodo(null);
    // return to main list
    navigate('/');
  };

  const handleCloseEdit = () => {
    setEditingTodo(null);
    navigate('/');
  };

  // Sync modal with path param /todos/:id
  useEffect(() => {
    if (!editIdParam) {
      // No param => ensure closed
      setEditingTodo(null);
      return;
    }
    if (editingTodo && editingTodo.id === editIdParam) return;
    const existing = todos.find(t => t.id === editIdParam);
    if (existing) {
      setEditingTodo(existing);
      return;
    }
    (async () => {
      try {
        const fetched = await TodosApi.getById(editIdParam);
        setTodos(prev => prev.some(t => t.id === fetched.id) ? prev : [fetched, ...prev]);
        setEditingTodo(fetched);
      } catch (e) {
        console.warn('Failed to load todo for edit path', e);
        // navigate home if invalid id
        navigate('/');
      }
    })();
  }, [editIdParam, todos]);

  useEffect(() => {
    const completed = todos.filter((todo) => todo.completed).length;
    const active = todos.length - completed;
    setTodoStateCounts({ active, completed });
  
    setFilteredTodos(todos.filter((todo) => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    }));
  }, [todos, filter]);
  

  return (
    <>
      {/* Input Section */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='flex gap-2'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && addTodo()}
            placeholder='Add a new todo...'
            className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <button
            onClick={addTodo}
            disabled={!input.trim()}
            className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400'
          >
            Add
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className='flex gap-2'>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer leading-5 ${
            filter === 'all'
              ? 'bg-violet-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          All
        </button>
        {todoStates.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === f
                ? `${todoStateColors[f][0]} text-white`
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className='inline-flex items-center leading-5'>
              <span>{todoStateLabels[f]}</span>
              {!!todoStateCounts[f] && (<span className='ml-2'>
                <Badge count={todoStateCounts[f]} selected={filter === f} selectedColor={todoStateColors[f][1]} />
              </span>)}
            </span>
          </button>
        ))}
      </div>

      {/* Todo Items */}
      <div className='space-y-2'>
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onRequestEdit={requestEdit}
            />
          ))
        ) : (
          <div className='text-center py-12 bg-white rounded-lg'>
            <p className='text-gray-500 text-lg'>
              {filter === 'all'
                ? 'No todos yet. Add one to get started!'
                : `No ${filter} todos.`}
            </p>
          </div>
        )}
      </div>
      {/* Edit modal */}
      <EditTodoModal
        todo={editingTodo}
        onSave={handleSaveEdit}
        onClose={handleCloseEdit}
      />
    </>
  );
}