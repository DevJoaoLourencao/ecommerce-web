"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  groupVariantsByColor,
  ProductVariant,
} from "@/helpers/variant-grouping";

interface EnhancedVariantSelectorProps {
  selectedVariantSlug: string;
  variants: ProductVariant[];
}

const EnhancedVariantSelector = ({
  selectedVariantSlug,
  variants,
}: EnhancedVariantSelectorProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingVariant, setLoadingVariant] = useState<string | null>(null);

  const groupedVariants = groupVariantsByColor(variants, false); // Mostrar todas as variações incluindo sem estoque
  const selectedVariant = variants.find((v) => v.slug === selectedVariantSlug);
  const [selectedColor, setSelectedColor] = useState(
    selectedVariant?.color || groupedVariants[0]?.color,
  );
  const [selectedSize, setSelectedSize] = useState(
    selectedVariant?.size || null,
  );

  // Prefetch todas as variantes para navegação mais rápida
  useEffect(() => {
    variants.forEach((variant) => {
      if (variant.slug !== selectedVariantSlug) {
        router.prefetch(`/product-variant/${variant.slug}`);
      }
    });
  }, [variants, selectedVariantSlug, router]);

  // Atualizar estado quando a variante selecionada mudar
  useEffect(() => {
    if (selectedVariant) {
      setSelectedColor(selectedVariant.color);
      setSelectedSize(selectedVariant.size);
    }
  }, [selectedVariant]);

  const handleColorClick = (color: string) => {
    setSelectedColor(color);

    // Encontrar a primeira variante desta cor (ou manter o tamanho se existir)
    const colorGroup = groupedVariants.find((g) => g.color === color);
    if (colorGroup) {
      const variantWithSameSize = colorGroup.variants.find(
        (v) => v.size === selectedSize,
      );
      const targetVariant = variantWithSameSize || colorGroup.variants[0];

      if (targetVariant.slug !== selectedVariantSlug) {
        navigateToVariant(targetVariant.slug);
      }

      setSelectedSize(targetVariant.size);
    }
  };

  const handleSizeClick = (size: string | null) => {
    setSelectedSize(size);

    // Encontrar a variante com esta cor e tamanho (permite navegar mesmo sem estoque)
    const targetVariant = variants.find(
      (v) => v.color === selectedColor && v.size === size,
    );

    if (targetVariant && targetVariant.slug !== selectedVariantSlug) {
      navigateToVariant(targetVariant.slug);
    }
  };

  const navigateToVariant = (variantSlug: string) => {
    setLoadingVariant(variantSlug);

    startTransition(() => {
      router.push(`/product-variant/${variantSlug}`);
    });
  };

  const currentColorGroup = groupedVariants.find(
    (g) => g.color === selectedColor,
  );
  const hasMultipleSizes =
    currentColorGroup && currentColorGroup.variants.length > 1;

  return (
    <div className="space-y-4">
      {/* Seletor de Cores */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-700">Cor</h3>
        <div className="flex items-center gap-3">
          {groupedVariants.map((colorGroup) => {
            const isSelected = selectedColor === colorGroup.color;
            const isLoading =
              loadingVariant &&
              variants.some(
                (v) =>
                  v.color === colorGroup.color && v.slug === loadingVariant,
              );
            const hasStock = colorGroup.variants.some((v) => v.stock > 0);

            return (
              <button
                key={colorGroup.color}
                onClick={() => handleColorClick(colorGroup.color)}
                disabled={isLoading}
                className={`relative rounded-xl transition-all duration-200 ${
                  isSelected
                    ? "ring-primary ring-2 ring-offset-2"
                    : "ring-2 ring-transparent hover:ring-gray-300"
                } ${isLoading ? "opacity-50" : ""} ${!hasStock ? "opacity-75" : ""}`}
              >
                <Image
                  width={68}
                  height={68}
                  src={colorGroup.imageUrl}
                  alt={colorGroup.color}
                  className="rounded-xl"
                />
                {isLoading && (
                  <div className="bg-opacity-20 absolute inset-0 flex items-center justify-center rounded-xl bg-black">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  </div>
                )}
                {!hasStock && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-lg font-bold text-white">
                      ×
                    </div>
                  </div>
                )}
                <div className="mt-1 text-center text-xs text-gray-600">
                  {colorGroup.color}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Seletor de Tamanhos */}
      {hasMultipleSizes && currentColorGroup && (
        <div>
          <h3 className="mb-3 text-sm font-medium text-gray-700">Tamanho</h3>
          <div className="flex flex-wrap gap-2">
            {currentColorGroup.variants.map((variant) => {
              const isSelected = selectedSize === variant.size;
              const isLoading = loadingVariant === variant.slug;
              const isLowStock = variant.stock <= 3 && variant.stock > 0;
              const isOutOfStock = variant.stock === 0;

              return (
                <div key={variant.id} className="relative">
                  <Button
                    onClick={() => handleSizeClick(variant.size)}
                    disabled={isLoading}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`min-w-[50px] ${isLoading ? "opacity-50" : ""} ${
                      isOutOfStock ? "opacity-75" : ""
                    }`}
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    ) : (
                      variant.size
                    )}
                  </Button>
                  {isLowStock && (
                    <div
                      className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-orange-500"
                      title={`Apenas ${variant.stock} em estoque`}
                    />
                  )}
                  {isOutOfStock && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="text-lg font-bold text-red-500">×</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedVariantSelector;
