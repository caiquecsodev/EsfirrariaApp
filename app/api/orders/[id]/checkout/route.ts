import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { preferenceClient } from "@/lib/mercadopago";
import { getOrderForUser, setOrderPreference } from "@/lib/orders";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id: orderId } = await params;
  const order = await getOrderForUser(orderId, session.user.id);

  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  if (order.status !== "PENDING") {
    return NextResponse.json(
      { error: "Este pedido já não está mais pendente de pagamento" },
      { status: 400 }
    );
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const preference = await preferenceClient.create({
    body: {
      external_reference: order.id,
      items: order.items.map((item) => ({
        id: item.productId,
        title: item.productName,
        quantity: item.quantity,
        unit_price: item.priceCents / 100,
        currency_id: "BRL",
      })),
      back_urls: {
        success: `${baseUrl}/pedidos/${order.id}/retorno`,
        pending: `${baseUrl}/pedidos/${order.id}/retorno`,
        failure: `${baseUrl}/pedidos/${order.id}/retorno`,
      },
    },
  });

  if (!preference.id) {
    return NextResponse.json(
      { error: "Não foi possível iniciar o pagamento" },
      { status: 502 }
    );
  }

  await setOrderPreference(order.id, preference.id);

  return NextResponse.json({
    checkoutUrl: preference.sandbox_init_point ?? preference.init_point,
  });
}
