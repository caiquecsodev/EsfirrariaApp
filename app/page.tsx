import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getMenu } from "@/lib/menu";
import { SignOutButton } from "@/components/SignOutButton";
import { CategoryNav } from "@/components/menu/CategoryNav";
import { ProductCard } from "@/components/menu/ProductCard";
import { CartWidget } from "@/components/menu/CartWidget";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const categories = await getMenu();

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      <div className="sticky top-0 z-20">
        <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3">
          <h1 className="text-lg font-bold text-neutral-900">Esfirraria 🥙</h1>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-neutral-500 sm:inline">
              {session.user?.email}
            </span>
            <SignOutButton />
          </div>
        </header>
        <CategoryNav categories={categories} />
      </div>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {categories.map((category) => (
          <section key={category.id} id={category.slug} className="mb-12 scroll-mt-32">
            <h2 className="mb-4 text-xl font-bold text-neutral-900">{category.name}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {category.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}
      </main>

      <CartWidget />
    </div>
  );
}
