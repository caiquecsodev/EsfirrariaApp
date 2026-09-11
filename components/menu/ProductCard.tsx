"use client";

import { useState } from "react";
import { formatCents } from "@/lib/format";
import type { MenuProduct } from "@/lib/menu";
import { addItem, updateQuantity } from "@/store/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { QuantityStepper } from "@/components/menu/QuantityStepper";
import { ProductModal } from "@/components/menu/ProductModal";

export function ProductCard({ product }: { product: MenuProduct }) {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const quantity = useAppSelector(
    (state) => state.cart.items.find((item) => item.id === product.id)?.quantity ?? 0
  );

  function handleAdd() {
    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        priceCents: product.priceCents,
        emoji: product.emoji,
      })
    );
  }

  function handleRemove() {
    dispatch(updateQuantity({ id: product.id, quantity: quantity - 1 }));
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white text-left shadow-sm transition hover:border-red-200 hover:shadow-md"
      >
        <div className="flex aspect-[4/3] w-full items-center justify-center bg-orange-50 text-6xl">
          {product.emoji}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="truncate font-semibold text-neutral-900">{product.name}</h3>
          {product.description && (
            <p className="mt-0.5 line-clamp-2 text-sm text-neutral-500">{product.description}</p>
          )}
          {product.isCombo && product.comboItems.length > 0 && (
            <p className="mt-1 line-clamp-1 text-xs text-neutral-400">
              {product.comboItems
                .map((item) => `${item.quantity}x ${item.product.name}`)
                .join(", ")}
            </p>
          )}

          <div className="mt-4 flex flex-1 items-end justify-between">
            <span className="font-semibold text-neutral-900">
              {formatCents(product.priceCents)}
            </span>
            <div onClick={(e) => e.stopPropagation()}>
              <QuantityStepper quantity={quantity} onAdd={handleAdd} onRemove={handleRemove} />
            </div>
          </div>
        </div>
      </div>

      {open && (
        <ProductModal
          product={product}
          quantity={quantity}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
