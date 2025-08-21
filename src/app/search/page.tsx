import { ilike } from "drizzle-orm";
import { notFound } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { db } from "@/db";
import { productTable } from "@/db/schema";
import { getCategories } from "@/helpers/categories";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const params = await searchParams;
  const query = params.q?.trim();

  if (!query) {
    notFound();
  }

  const categories = await getCategories();

  // Buscar produtos por nome ou descrição
  const products = await db.query.productTable.findMany({
    where: ilike(productTable.name, `%${query}%`),
    with: {
      variants: true,
    },
  });

  return (
    <>
      <Header categories={categories} />
      <div className="space-y-6 pt-25 lg:pt-[138px]">
        <div className="px-5">
          <h1 className="text-2xl font-bold">Resultados para: "{query}"</h1>
          <p className="text-gray-600">
            {products.length} produto(s) encontrado(s)
          </p>
        </div>

        {products.length > 0 ? (
          <ProductList products={products} title="" />
        ) : (
          <div className="px-5 py-12 text-center">
            <p className="text-gray-500">
              Nenhum produto encontrado para "{query}".
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Tente usar termos diferentes ou navegue pelas categorias.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SearchPage;
