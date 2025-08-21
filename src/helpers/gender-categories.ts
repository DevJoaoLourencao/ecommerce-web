import { db } from "@/db";
import { categoryTable } from "@/db/schema";

export interface CategoryWithGender {
  id: string;
  name: string;
  slug: string;
  hasProducts: boolean;
}

export interface GenderCategories {
  masculino: CategoryWithGender[];
  feminino: CategoryWithGender[];
  unissex: CategoryWithGender[];
}

export const getCategoriesByGender = async (): Promise<GenderCategories> => {
  // Buscar todas as categorias
  const categories = await db.query.categoryTable.findMany({
    orderBy: [categoryTable.name],
  });

  // Buscar produtos agrupados por categoria e gênero
  const categoriesWithGender: GenderCategories = {
    masculino: [],
    feminino: [],
    unissex: [],
  };

  for (const category of categories) {
    // Verificar se a categoria tem produtos masculinos
    const masculinoProducts = await db.query.productTable.findFirst({
      where: (product, { eq, and }) =>
        and(
          eq(product.categoryId, category.id),
          eq(product.gender, "masculino"),
        ),
    });

    // Verificar se a categoria tem produtos femininos
    const femininoProducts = await db.query.productTable.findFirst({
      where: (product, { eq, and }) =>
        and(
          eq(product.categoryId, category.id),
          eq(product.gender, "feminino"),
        ),
    });

    // Verificar se a categoria tem produtos unissex
    const unissexProducts = await db.query.productTable.findFirst({
      where: (product, { eq, and }) =>
        and(eq(product.categoryId, category.id), eq(product.gender, "unissex")),
    });

    // Adicionar categoria aos arrays apropriados se tiver produtos
    if (masculinoProducts) {
      categoriesWithGender.masculino.push({
        ...category,
        hasProducts: true,
      });
    }

    if (femininoProducts) {
      categoriesWithGender.feminino.push({
        ...category,
        hasProducts: true,
      });
    }

    if (unissexProducts) {
      categoriesWithGender.unissex.push({
        ...category,
        hasProducts: true,
      });
    }
  }

  return categoriesWithGender;
};
