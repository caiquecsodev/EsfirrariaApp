type Category = {
  id: string;
  slug: string;
  name: string;
};

export function CategoryNav({ categories }: { categories: Category[] }) {
  return (
    <nav className="border-b border-neutral-200 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-5xl justify-center gap-2 overflow-x-auto">
        {categories.map((category) => (
          <a
            key={category.id}
            href={`#${category.slug}`}
            className="shrink-0 rounded-full border border-neutral-200 px-4 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-red-500 hover:text-red-600"
          >
            {category.name}
          </a>
        ))}
      </div>
    </nav>
  );
}
