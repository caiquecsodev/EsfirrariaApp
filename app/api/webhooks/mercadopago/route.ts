import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { paymentClient } from "@/lib/mercadopago";
import { applyPaymentResult } from "@/lib/orders";

// Confirma a autenticidade da notificação usando o header x-signature.
// Docs: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/webhooks/additional-content/your-integrations/security
function isValidSignature(request: Request, paymentId: string): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return true; // segredo não configurado no dashboard (comum em sandbox)

  const signatureHeader = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id");
  if (!signatureHeader || !requestId) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((part) => part.trim().split("=") as [string, string])
  );
  const ts = parts.ts;
  const receivedHash = parts.v1;
  if (!ts || !receivedHash) return false;

  const manifest = `id:${paymentId};request-id:${requestId};ts:${ts};`;
  const expectedHash = createHmac("sha256", secret).update(manifest).digest("hex");

  const expected = Buffer.from(expectedHash);
  const received = Buffer.from(receivedHash);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const body = await request.json().catch(() => null);

  const type = body?.type ?? url.searchParams.get("type") ?? url.searchParams.get("topic");
  const paymentId = body?.data?.id ?? url.searchParams.get("data.id") ?? url.searchParams.get("id");

  if (type !== "payment" || !paymentId) {
    // Outros tipos de notificação (ex.: merchant_order) não nos interessam aqui.
    return NextResponse.json({ received: true });
  }

  if (!isValidSignature(request, String(paymentId))) {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
  }

  try {
    const payment = await paymentClient.get({ id: String(paymentId) });
    const orderId = payment.external_reference;

    if (!orderId || !payment.status) {
      return NextResponse.json({ received: true });
    }

    await applyPaymentResult(orderId, String(paymentId), payment.status);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro ao processar webhook do Mercado Pago:", error);
    // 500 faz o Mercado Pago tentar reenviar a notificação depois.
    return NextResponse.json({ error: "Erro ao processar notificação" }, { status: 500 });
  }
}
