import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { paymentClient } from "@/lib/mercadopago";
import { applyPaymentResult, getOrderForUser } from "@/lib/orders";

export default async function OrderReturnPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment_id?: string; collection_id?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id: orderId } = await params;
  const { payment_id, collection_id } = await searchParams;
  const paymentId = payment_id ?? collection_id;

  const order = await getOrderForUser(orderId, session.user.id);
  if (!order) {
    redirect("/pedidos");
  }

  if (paymentId) {
    const payment = await paymentClient.get({ id: paymentId });
    if (payment.status) {
      await applyPaymentResult(orderId, String(paymentId), payment.status);
    }
  }

  redirect(`/pedidos/${orderId}`);
}
