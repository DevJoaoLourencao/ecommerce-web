import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import GenderFilter from "@/components/common/gender-filter";
import { Header } from "@/components/common/header";
import ProductItem from "@/components/common/product-item";
import { db } from "@/db";
import { categoryTable, productTable } from "@/db/schema";
import { getCategories } from "@/helpers/categories";
import { getCategoriesByGender } from "@/helpers/gender-categories";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ gender?: string }>;
}

const CategoryPage = async ({ params, searchParams }: CategoryPageProps) => {
  const { slug } = await params;
  const { gender } = await searchParams;

  const [category, categories, genderCategories] = await Promise.all([
    db.query.categoryTable.findFirst({
      where: eq(categoryTable.slug, slug),
    }),
    getCategories(),
    getCategoriesByGender(),
  ]);
  if (!category) {
    return notFound();
  }

  // Construir filtros de busca
  const filters = [eq(productTable.categoryId, category.id)];
  if (gender && gender !== "todos") {
    filters.push(
      eq(productTable.gender, gender as "masculino" | "feminino" | "unissex"),
    );
  }

  const products = await db.query.productTable.findMany({
    where: and(...filters),
    with: {
      variants: true,
    },
  });
  return (
    <>
      <Header categories={categories} genderCategories={genderCategories} />
      <div className="space-y-6 px-5 pt-25">
        <h2 className="text-xl font-semibold">{category.name}</h2>

        <GenderFilter currentPath={`/category/${slug}`} />

        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              textContainerClassName="max-w-full"
            />
          ))}
        </div>

        {products.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              Nenhum produto encontrado com os filtros selecionados.
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Tente ajustar os filtros ou navegar por outras categorias.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryPage;
