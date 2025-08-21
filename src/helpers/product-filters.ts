import { productTable, productVariantTable } from "@/db/schema";

export type ProductWithVariants = typeof productTable.$inferSelect & {
  variants: (typeof productVariantTable.$inferSelect)[];
};

// Filtrar apenas produtos que têm pelo menos uma variante com estoque
export const filterProductsWithStock = (
  products: ProductWithVariants[],
): ProductWithVariants[] => {
  return products.filter((product) =>
    product.variants.some((variant) => variant.stock > 0),
  );
};

// Filtrar variantes com estoque de um produto
export const filterVariantsWithStock = (
  variants: (typeof productVariantTable.$inferSelect)[],
): (typeof productVariantTable.$inferSelect)[] => {
  return variants.filter((variant) => variant.stock > 0);
};
