import { productVariantTable } from "@/db/schema";

export type ProductVariant = typeof productVariantTable.$inferSelect;

export interface VariantGroup {
  color: string;
  variants: ProductVariant[];
  imageUrl: string;
}

export const groupVariantsByColor = (
  variants: ProductVariant[],
  filterInStock: boolean = true,
): VariantGroup[] => {
  // Filtrar apenas variantes com estoque se solicitado
  const availableVariants = filterInStock
    ? variants.filter((variant) => variant.stock > 0)
    : variants;

  const grouped = availableVariants.reduce((acc, variant) => {
    const existingGroup = acc.find((group) => group.color === variant.color);

    if (existingGroup) {
      existingGroup.variants.push(variant);
      // Ordenar por tamanho
      existingGroup.variants.sort((a, b) => {
        if (!a.size || !b.size) return 0;

        // Para números (calçados)
        const aNum = parseInt(a.size);
        const bNum = parseInt(b.size);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        }

        // Para tamanhos de roupa (PP, P, M, G, GG)
        const sizeOrder = { PP: 0, P: 1, M: 2, G: 3, GG: 4 };
        const aOrder = sizeOrder[a.size as keyof typeof sizeOrder] || 999;
        const bOrder = sizeOrder[b.size as keyof typeof sizeOrder] || 999;

        return aOrder - bOrder;
      });
    } else {
      acc.push({
        color: variant.color,
        variants: [variant],
        imageUrl: variant.imageUrl,
      });
    }

    return acc;
  }, [] as VariantGroup[]);

  return grouped;
};
