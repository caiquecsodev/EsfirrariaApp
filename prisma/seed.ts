import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.comboItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const esfirras = await prisma.category.create({
    data: { name: "Esfirras", slug: "esfirras", order: 0 },
  });
  const bebidas = await prisma.category.create({
    data: { name: "Bebidas", slug: "bebidas", order: 1 },
  });
  const combosCategory = await prisma.category.create({
    data: { name: "Combos", slug: "combos", order: 2 },
  });

  const carne = await prisma.product.create({
    data: {
      name: "Esfirra de Carne",
      description: "Massa fininha recheada com carne moída temperada",
      priceCents: 800,
      emoji: "🥙",
      categoryId: esfirras.id,
    },
  });
  const queijo = await prisma.product.create({
    data: {
      name: "Esfirra de Queijo",
      description: "Recheio generoso de queijo derretido",
      priceCents: 750,
      emoji: "🧀",
      categoryId: esfirras.id,
    },
  });
  const frango = await prisma.product.create({
    data: {
      name: "Esfirra de Frango",
      description: "Frango desfiado com temperos da casa",
      priceCents: 800,
      emoji: "🍗",
      categoryId: esfirras.id,
    },
  });
  const calabresa = await prisma.product.create({
    data: {
      name: "Esfirra de Calabresa",
      description: "Calabresa moída com cebola",
      priceCents: 800,
      emoji: "🌭",
      categoryId: esfirras.id,
    },
  });

  await prisma.product.create({
    data: {
      name: "Refrigerante Lata",
      description: "350ml, diversos sabores",
      priceCents: 600,
      emoji: "🥤",
      categoryId: bebidas.id,
    },
  });
  const refrigerante1L = await prisma.product.create({
    data: {
      name: "Refrigerante 1 Litro",
      description: "1 litro, diversos sabores",
      priceCents: 1000,
      emoji: "🥤",
      categoryId: bebidas.id,
    },
  });
  const refrigerante600ml = await prisma.product.create({
    data: {
      name: "Refrigerante 600ml",
      description: "600ml, diversos sabores",
      priceCents: 800,
      emoji: "🥤",
      categoryId: bebidas.id,
    },
  });
  await prisma.product.create({
    data: {
      name: "Refrigerante 2 Litros",
      description: "2 litros, diversos sabores",
      priceCents: 1200,
      emoji: "🥤",
      categoryId: bebidas.id,
    },
  });
  await prisma.product.create({
    data: {
      name: "Suco Natural",
      description: "500ml, feito na hora",
      priceCents: 900,
      emoji: "🧃",
      categoryId: bebidas.id,
    },
  });

  await prisma.product.create({
    data: {
      name: "Combo 10 Esfirras",
      description: "10 esfirras sortidas + refrigerante 600ml. Ideal para 4 a 5 pessoas.",
      priceCents: 8500,
      emoji: "🍽️",
      isCombo: true,
      categoryId: combosCategory.id,
      comboItems: {
        create: [
          { productId: carne.id, quantity: 3 },
          { productId: queijo.id, quantity: 3 },
          { productId: frango.id, quantity: 2 },
          { productId: calabresa.id, quantity: 2 },
          { productId: refrigerante600ml.id, quantity: 1 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Combo 15 Esfirras",
      description: "15 esfirras sortidas + refrigerante 1 litro. Ideal para 6 a 8 pessoas.",
      priceCents: 11900,
      emoji: "🍽️",
      isCombo: true,
      categoryId: combosCategory.id,
      comboItems: {
        create: [
          { productId: carne.id, quantity: 4 },
          { productId: queijo.id, quantity: 4 },
          { productId: frango.id, quantity: 4 },
          { productId: calabresa.id, quantity: 3 },
          { productId: refrigerante1L.id, quantity: 1 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Combo 20 Esfirras",
      description: "20 esfirras sortidas + refrigerante 1 litro. Ideal para 8 a 10 pessoas.",
      priceCents: 15900,
      emoji: "🍽️",
      isCombo: true,
      categoryId: combosCategory.id,
      comboItems: {
        create: [
          { productId: carne.id, quantity: 5 },
          { productId: queijo.id, quantity: 5 },
          { productId: frango.id, quantity: 5 },
          { productId: calabresa.id, quantity: 5 },
          { productId: refrigerante1L.id, quantity: 1 },
        ],
      },
    },
  });

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
