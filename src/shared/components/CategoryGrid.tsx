import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import { useUIStore } from '@lib/store';

interface CategoryGridProps {
  categories: Array<{ category_id: string; category_name: string }>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  focusKey?: string;
}

function FocusableCategoryButton({ label, isActive, onSelect }: {
  label: string;
  isActive: boolean;
  onSelect: () => void;
}) {
  const inputMode = useUIStore((s) => s.inputMode);
  const { ref, focused } = useFocusable({
    onEnterPress: onSelect,
  });
  const showFocus = focused && inputMode === 'keyboard';

  return (
    <button
      ref={ref}
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
  const { ref, focusKey } = useFocusable({
    focusKey: propFocusKey || 'category-grid',
    trackChildren: true,
    saveLastFocusedChild: true,
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="flex flex-wrap gap-2">
        <FocusableCategoryButton
          label="All"
          isActive={!selectedId}
          onSelect={() => onSelect('')}
        />
        {categories.map((cat) => (
          <FocusableCategoryButton
            key={cat.category_id}
            label={cat.category_name}
            isActive={selectedId === cat.category_id}
            onSelect={() => onSelect(cat.category_id)}
          />
        ))}
      </div>
    </FocusContext.Provider>
  );
}
