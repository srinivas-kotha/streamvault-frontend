export interface CategoryRailProps {
  title: string;
  category: string;
}

export function CategoryRail({ title, category }: CategoryRailProps) {
  return (
    <section data-testid="category-rail" data-category={category}>
      <h2 className="text-base font-semibold text-text-primary px-4 mb-2">
        {title}
      </h2>
    </section>
  );
}
