import { and, eq, ilike } from "drizzle-orm";
import { notFound } from "next/navigation";

import Footer from "@/components/common/footer";
import GenderFilter from "@/components/common/gender-filter";
import { Header } from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { db } from "@/db";
import { productTable } from "@/db/schema";
import { getCategories } from "@/helpers/categories";
import { getCategoriesByGender } from "@/helpers/gender-categories";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; gender?: string }>;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const params = await searchParams;
  const query = params.q?.trim();
  const gender = params.gender;

  if (!query) {
    notFound();
  }

  const [categories, genderCategories] = await Promise.all([
    getCategories(),
    getCategoriesByGender(),
  ]);

  // Construir filtros de busca
  const filters = [ilike(productTable.name, `%${query}%`)];
  if (gender && gender !== "todos") {
    filters.push(
      eq(productTable.gender, gender as "masculino" | "feminino" | "unissex"),
    );
  }

  // Buscar produtos por nome ou descrição
  const products = await db.query.productTable.findMany({
    where: and(...filters),
    with: {
      variants: true,
    },
  });

  return (
    <>
      <Header categories={categories} genderCategories={genderCategories} />
      <div className="space-y-6 pt-25 lg:pt-[138px]">
        <div className="px-5">
          <h1 className="text-2xl font-bold">Resultados para: "{query}"</h1>
          <p className="text-gray-600">
            {products.length} produto(s) encontrado(s)
          </p>
        </div>

        <div className="px-5">
          <GenderFilter currentPath="/search" />
        </div>

        {products.length > 0 ? (
          <ProductList products={products} title="" />
        ) : (
          <div className="px-5 py-12 text-center">
            <p className="text-gray-500">
              Nenhum produto encontrado para "{query}"
              {gender && gender !== "todos" ? ` na categoria ${gender}` : ""}.
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Tente usar termos diferentes, ajustar os filtros ou navegue pelas
              categorias.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SearchPage;
