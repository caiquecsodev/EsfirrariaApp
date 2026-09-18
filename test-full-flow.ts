import { MercadoPagoConfig, CardToken, Payment, Preference } from "mercadopago";
import { prisma } from "@/lib/prisma";
import { createOrder, applyPaymentResult, getOrderForUser } from "@/lib/orders";

const config = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });
const cardTokenClient = new CardToken(config);
const paymentClient = new Payment(config);
const preferenceClient = new Preference(config);

async function main() {
  console.log("1. Criando usuário e produto de teste...");
  const user = await prisma.user.upsert({
    where: { email: "fluxotest@example.com" },
    update: {},
    create: { email: "fluxotest@example.com", name: "Fluxo Teste" },
  });
  const product = await prisma.product.findFirstOrThrow({ where: { name: "Esfirra de Carne" } });

  console.log("2. Criando pedido (como o botão 'Finalizar pedido' faz)...");
  const order = await createOrder({ userId: user.id, items: [{ productId: product.id, quantity: 1 }] });
  console.log("   Pedido criado:", order.id, "- status:", order.status, "- total:", order.totalCents);

  console.log("3. Criando preferência de pagamento (como o botão 'Ir para pagamento' faz)...");
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
    },
  });
  console.log("   Preferência criada:", preference.id);

  console.log("4. Tokenizando cartão de teste (isso é o que a página do Mercado Pago faz)...");
  const cardToken = await cardTokenClient.create({
    body: {
      card_number: "5480832801033311",
      expiration_month: "11",
      expiration_year: "2030",
      security_code: "123",
      cardholder: {
        name: "APRO",
        identification: { type: "CPF", number: "12345678909" },
      },
    },
  });
  console.log("   Token gerado:", cardToken.id);

  console.log("5. Criando o pagamento com esse token...");
  const payment = await paymentClient.create({
    body: {
      transaction_amount: order.totalCents / 100,
      token: cardToken.id,
      description: `Pedido ${order.id}`,
      installments: 1,
      payment_method_id: "master",
      external_reference: order.id,
      payer: { email: "fluxotest@example.com" },
    },
  });
  console.log("   Pagamento criado:", payment.id, "- status:", payment.status, "- detalhe:", payment.status_detail);

  console.log("6. Aplicando o resultado no pedido (como a página /pedidos/[id]/retorno faz)...");
  await applyPaymentResult(order.id, String(payment.id), payment.status!);

  const updatedOrder = await getOrderForUser(order.id, user.id);
  console.log("7. Pedido final no banco:", {
    id: updatedOrder?.id,
    status: updatedOrder?.status,
    mpPaymentId: updatedOrder?.mpPaymentId,
  });

  console.log("\n8. Limpando dados de teste...");
  await prisma.order.deleteMany({ where: { userId: user.id } });
  await prisma.user.delete({ where: { id: user.id } });
  console.log("   Limpo.");

  process.exit(0);
}

main().catch((err) => {
  console.error("ERRO:", err);
  process.exit(1);
});
