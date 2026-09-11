import { prisma } from "@/lib/prisma";

export async function getMenu() {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      products: {
        orderBy: { name: "asc" },
        include: {
          comboItems: {
            include: { product: true },
          },
        },
      },
    },
  });
}

export type Menu = Awaited<ReturnType<typeof getMenu>>;
export type MenuProduct = Menu[number]["products"][number];
