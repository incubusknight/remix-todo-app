import type { Todo } from '../types/todo';
import { Pencil, Trash2 } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRequestEdit: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onRequestEdit }: TodoItemProps) {
  return (
    <Tooltip.Provider>
      <div className='flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow'>
        <input
          type='checkbox'
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className='w-5 h-5 cursor-pointer accent-emerald-600'
        />
        <span
          className={`flex-1 ${
            todo.completed
              ? 'line-through text-gray-400'
              : 'text-gray-900'
          }`}
        >
          {todo.title}
        </span>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              onClick={() => onRequestEdit(todo.id)}
              className='p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors cursor-pointer'
            >
              <Pencil className='w-5 h-5' />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content className='bg-gray-900 text-white text-sm px-3 py-2 rounded shadow-lg' sideOffset={5}>
            Edit todo
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              onClick={() => onDelete(todo.id)}
              className='p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer'
            >
              <Trash2 className='w-5 h-5' />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content className='bg-gray-900 text-white text-sm px-3 py-2 rounded shadow-lg' sideOffset={5}>
            Delete todo
          </Tooltip.Content>
        </Tooltip.Root>
      </div>
    </Tooltip.Provider>
  );
}
