"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatCents } from "@/lib/format";
import { clearCart, removeItem, updateQuantity } from "@/store/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function CartWidget() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const items = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalCents = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);

  async function handleCheckout() {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Não foi possível finalizar o pedido");
        return;
      }

      dispatch(clearCart());
      setOpen(false);
      router.push(`/pedidos/${data.order.id}`);
    } catch {
      setError("Não foi possível finalizar o pedido");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-white shadow-lg transition hover:bg-red-700"
      >
        <span className="text-lg">🛒</span>
        <span className="font-medium">{formatCents(totalCents)}</span>
        {itemCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-red-600">
            {itemCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <button
            aria-label="Fechar carrinho"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          <div className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-neutral-900">Seu carrinho</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <p className="mt-8 text-center text-sm text-neutral-500">
                  Seu carrinho está vazio.
                </p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-xl">
                        {item.emoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-neutral-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {formatCents(item.priceCents)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({ id: item.id, quantity: item.quantity - 1 })
                            )
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 text-sm text-neutral-600 hover:bg-neutral-50"
                        >
                          −
                        </button>
                        <span className="w-4 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({ id: item.id, quantity: item.quantity + 1 })
                            )
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 text-sm text-neutral-600 hover:bg-neutral-50"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => dispatch(removeItem(item.id))}
                        className="text-neutral-300 hover:text-red-500"
                        aria-label={`Remover ${item.name}`}
                      >
                        🗑
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-neutral-200 px-5 py-4">
                <div className="mb-3 flex items-center justify-between text-sm font-medium text-neutral-900">
                  <span>Total</span>
                  <span>{formatCents(totalCents)}</span>
                </div>
                {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
                <button
                  onClick={handleCheckout}
                  disabled={submitting}
                  className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Enviando..." : "Finalizar pedido"}
                </button>
                <button
                  onClick={() => dispatch(clearCart())}
                  className="mt-2 w-full rounded-lg px-4 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-50"
                >
                  Esvaziar carrinho
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
