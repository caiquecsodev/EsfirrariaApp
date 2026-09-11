import { prisma } from "@/lib/prisma";

export type CreateOrderInput = {
  userId: string;
  items: { productId: string; quantity: number }[];
};

export class EmptyCartError extends Error {}
export class InvalidProductError extends Error {}

export async function createOrder({ userId, items }: CreateOrderInput) {
  if (items.length === 0) {
    throw new EmptyCartError("O carrinho está vazio");
  }

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((item) => item.productId) } },
  });

  if (products.length !== new Set(items.map((item) => item.productId)).size) {
    throw new InvalidProductError("Um ou mais produtos do carrinho não existem mais");
  }

  const productById = new Map(products.map((product) => [product.id, product]));

  const orderItems = items.map((item) => {
    const product = productById.get(item.productId)!;
    return {
      productId: product.id,
      productName: product.name,
      priceCents: product.priceCents,
      quantity: item.quantity,
    };
  });

  const totalCents = orderItems.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0
  );

  return prisma.order.create({
    data: {
      userId,
      totalCents,
      items: { create: orderItems },
    },
    include: { items: true },
  });
}

export async function getOrdersForUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
}
