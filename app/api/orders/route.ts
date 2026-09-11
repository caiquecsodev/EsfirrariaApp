import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { createOrder, EmptyCartError, InvalidProductError } from "@/lib/orders";

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }

  try {
    const order = await createOrder({
      userId: session.user.id,
      items: parsed.data.items,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    if (error instanceof EmptyCartError || error instanceof InvalidProductError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}
