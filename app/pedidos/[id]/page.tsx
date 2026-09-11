import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { formatCents } from "@/lib/format";
import { getOrderForUser } from "@/lib/orders";
import { orderStatusLabels, orderStatusStyles } from "@/lib/orderStatus";
import { PaymentButton } from "@/components/orders/PaymentButton";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const order = await getOrderForUser(id, session.user.id);

  if (!order) {
    redirect("/pedidos");
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-16">
      <header className="flex items-center gap-3 border-b border-neutral-200 bg-white px-4 py-3">
        <Link href="/pedidos" className="text-neutral-400 hover:text-neutral-600">
          ← Voltar
        </Link>
        <h1 className="text-lg font-bold text-neutral-900">Detalhes do pedido</h1>
      </header>

      <main className="mx-auto max-w-md px-4 py-8">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-3xl">
              {order.status === "PENDING" ? "🧾" : order.status === "CANCELED" ? "❌" : "✅"}
            </div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Pedido #{order.id.slice(-6).toUpperCase()}
            </h2>
            <p className="text-xs text-neutral-500">{dateFormatter.format(order.createdAt)}</p>
            <span
              className={`mt-1 rounded-full px-3 py-1 text-xs font-medium ${orderStatusStyles[order.status] ?? "bg-neutral-100 text-neutral-600"}`}
            >
              {orderStatusLabels[order.status] ?? order.status}
            </span>
          </div>

          <ul className="mt-6 flex flex-col gap-1.5 border-t border-neutral-100 pt-4">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between text-sm text-neutral-600"
              >
                <span>
                  {item.quantity}x {item.productName}
                </span>
                <span>{formatCents(item.priceCents * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4 text-sm font-semibold text-neutral-900">
            <span>Total</span>
            <span>{formatCents(order.totalCents)}</span>
          </div>

          {order.status === "PENDING" && (
            <div className="mt-6">
              <PaymentButton orderId={order.id} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
