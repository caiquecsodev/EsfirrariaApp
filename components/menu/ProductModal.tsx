"use client";

import { formatCents } from "@/lib/format";
import type { MenuProduct } from "@/lib/menu";
import { QuantityStepper } from "@/components/menu/QuantityStepper";

export function ProductModal({
  product,
  quantity,
  onAdd,
  onRemove,
  onClose,
}: {
  product: MenuProduct;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        aria-label="Fechar detalhes"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative flex max-h-[85vh] w-full max-w-md flex-col overflow-y-auto rounded-2xl bg-white shadow-xl">
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-500 shadow hover:text-neutral-700"
        >
          ✕
        </button>

        <div className="flex aspect-[4/3] w-full shrink-0 items-center justify-center bg-orange-50 text-7xl">
          {product.emoji}
        </div>

        <div className="border-b border-neutral-100 px-6 py-4">
          <h2 className="text-xl font-bold text-neutral-900">{product.name}</h2>
          <span className="text-lg font-semibold text-neutral-900">
            {formatCents(product.priceCents)}
          </span>
        </div>

        <div className="px-6 py-5">
          {product.description && (
            <p className="text-sm leading-relaxed text-neutral-600">{product.description}</p>
          )}

          {product.isCombo && product.comboItems.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-semibold text-neutral-900">O combo inclui</h3>
              <ul className="flex flex-col gap-1.5">
                {product.comboItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between text-sm text-neutral-600"
                  >
                    <span>{item.product.name}</span>
                    <span className="font-medium text-neutral-500">{item.quantity}x</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end border-t border-neutral-100 px-6 py-4">
          <QuantityStepper quantity={quantity} onAdd={onAdd} onRemove={onRemove} />
        </div>
      </div>
    </div>
  );
}
