interface BadgeProps {
  count: number;
  selected?: boolean;
  selectedColor?: string;
  className?: string;
}

export default function Badge({ count, selected = false, selectedColor = 'blue', className = '' }: BadgeProps) {
  if (count <= 0) return null;
  const base = 'inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full ring ring-gray-200';
  const selectedClasses = `bg-white ${selectedColor} ring-0`;
  const defaultClasses = 'bg-gray-100 text-gray-700';
  return (
    <div className={`${base} ${selected ? selectedClasses : defaultClasses} ${className}`}>
      {count}
    </div>
  );
}
