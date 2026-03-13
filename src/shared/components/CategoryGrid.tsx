import { useLRUD } from '@shared/hooks/useLRUD';
import { useUIStore } from '@lib/store';

interface CategoryGridProps {
  categories: Array<{ category_id: string; category_name: string }>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  focusKey?: string;
}

function FocusableCategoryButton({ id, parent, label, isActive, onSelect }: {
  id: string;
  parent: string;
  label: string;
  isActive: boolean;
  onSelect: () => void;
}) {
  const inputMode = useUIStore((s) => s.inputMode);
  const { ref, isFocused, focusProps } = useLRUD({
    id,
    parent,
    onEnter: onSelect,
  });
  const showFocus = isFocused && inputMode === 'keyboard';

  return (
    <button
      ref={ref}
      {...focusProps}
      onClick={onSelect}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? 'bg-teal/15 text-teal border border-teal/30'
          : showFocus
            ? 'bg-surface-raised text-text-primary border border-teal ring-2 ring-teal/50'
            : 'bg-surface-raised text-text-secondary border border-border hover:border-border hover:text-text-primary'
      }`}
    >
      {label}
    </button>
  );
}

export function CategoryGrid({ categories, selectedId, onSelect, focusKey: propFocusKey }: CategoryGridProps) {
  const parentId = propFocusKey || 'category-grid';

  return (
    <div className="flex flex-wrap gap-2">
      <FocusableCategoryButton
        id={`${parentId}-all`}
        parent="root"
        label="All"
        isActive={!selectedId}
        onSelect={() => onSelect('')}
      />
      {categories.map((cat) => (
        <FocusableCategoryButton
          id={`${parentId}-${cat.category_id}`}
          parent="root"
          key={cat.category_id}
          label={cat.category_name}
          isActive={selectedId === cat.category_id}
          onSelect={() => onSelect(cat.category_id)}
        />
      ))}
    </div>
  );
}
