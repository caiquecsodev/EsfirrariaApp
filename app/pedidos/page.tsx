import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { formatCents } from "@/lib/format";
import { getOrdersForUser } from "@/lib/orders";
import { orderStatusLabels, orderStatusStyles } from "@/lib/orderStatus";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default async function PedidosPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const orders = await getOrdersForUser(session.user.id);

  return (
    <div className="min-h-screen bg-neutral-50 pb-16">
      <header className="flex items-center gap-3 border-b border-neutral-200 bg-white px-4 py-3">
        <Link href="/" className="text-neutral-400 hover:text-neutral-600">
          ← Voltar
        </Link>
        <h1 className="text-lg font-bold text-neutral-900">Meus pedidos</h1>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        {orders.length === 0 ? (
          <p className="mt-12 text-center text-sm text-neutral-500">
            Você ainda não fez nenhum pedido.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/pedidos/${order.id}`}
                  className="block rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-red-200 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-neutral-900">
                        Pedido #{order.id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {dateFormatter.format(order.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${orderStatusStyles[order.status] ?? "bg-neutral-100 text-neutral-600"}`}
                    >
                      {orderStatusLabels[order.status] ?? order.status}
                    </span>
                  </div>

                  <ul className="mt-4 flex flex-col gap-1.5 border-t border-neutral-100 pt-4">
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
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
