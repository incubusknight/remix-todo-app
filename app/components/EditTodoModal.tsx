import React, { useEffect, useRef, useState } from 'react';
import type { Todo } from '../types/todo';

interface EditTodoModalProps {
  todo: Todo | null;
  isOpen?: boolean;
  onSave: (id: string, title: string) => void;
  onClose: () => void;
}

export function EditTodoModal({ todo, isOpen, onSave, onClose }: EditTodoModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    setTitle(todo?.title ?? '');
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (todo) {
      // open modal
      if (!dlg.open) dlg.showModal();
    } else {
      // close modal
      if (dlg.open) dlg.close();
    }
  }, [todo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo || !title.trim()) return;
    onSave(todo.id, title.trim());
  };

  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <dialog
      open={isOpen}
      ref={dialogRef}
      className='fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 shadow-lg border border-gray-200 w-full max-w-md z-50'
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClose={() => {
        // ensure parent state clears
        if (!todo) return;
      }}
    >
      <form onSubmit={handleSubmit} className='space-y-4'>
        <h3 className='text-lg font-semibold'>Edit Todo</h3>
        <input
          autoFocus
          value={title}
          name='title'
          onChange={(e) => setTitle(e.target.value)}
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <div className='flex justify-end gap-2'>
          <button
            type='button'
            onClick={handleCancel}
            className='px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={!title.trim()}
            className='px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400'
          >
            Save
          </button>
        </div>
      </form>
    </dialog>
  );
}

export default EditTodoModal;
