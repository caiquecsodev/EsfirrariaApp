export function QuantityStepper({
  quantity,
  onAdd,
  onRemove,
}: {
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  if (quantity === 0) {
    return (
      <button
        onClick={onAdd}
        className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-700"
      >
        Adicionar
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg bg-red-600 px-2 py-1.5 text-white">
      <button
        onClick={onRemove}
        aria-label="Diminuir quantidade"
        className="flex h-5 w-5 items-center justify-center text-lg leading-none hover:opacity-80"
      >
        −
      </button>
      <span className="min-w-4 text-center text-sm font-medium">{quantity}</span>
      <button
        onClick={onAdd}
        aria-label="Aumentar quantidade"
        className="flex h-5 w-5 items-center justify-center text-lg leading-none hover:opacity-80"
      >
        +
      </button>
    </div>
  );
}
