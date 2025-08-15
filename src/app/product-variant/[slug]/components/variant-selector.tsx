"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { productVariantTable } from "@/db/schema";

interface VariantSelectorProps {
  selectedVariantSlug: string;
  variants: (typeof productVariantTable.$inferSelect)[];
}

const VariantSelector = ({
  selectedVariantSlug,
  variants,
}: VariantSelectorProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingVariant, setLoadingVariant] = useState<string | null>(null);

  // Prefetch todas as variantes para navegação mais rápida
  useEffect(() => {
    variants.forEach((variant) => {
      if (variant.slug !== selectedVariantSlug) {
        router.prefetch(`/product-variant/${variant.slug}`);
      }
    });
  }, [variants, selectedVariantSlug, router]);

  const handleVariantClick = (variantSlug: string) => {
    if (variantSlug === selectedVariantSlug) return;

    setLoadingVariant(variantSlug);

    startTransition(() => {
      router.push(`/product-variant/${variantSlug}`);
    });
  };

  return (
    <div className="flex items-center gap-4">
      {variants.map((variant) => {
        const isSelected = selectedVariantSlug === variant.slug;
        const isLoading = loadingVariant === variant.slug;

        return (
          <button
            key={variant.id}
            onClick={() => handleVariantClick(variant.slug)}
            disabled={isLoading}
            className={`relative rounded-xl transition-opacity ${
              isSelected
                ? "border-primary border-2"
                : "border-2 border-transparent"
            } ${isLoading ? "opacity-50" : ""}`}
          >
            <Image
              width={68}
              height={68}
              src={variant.imageUrl}
              alt={variant.name}
              className="rounded-xl"
            />
            {isLoading && (
              <div className="bg-opacity-20 absolute inset-0 flex items-center justify-center rounded-xl bg-black">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default VariantSelector;
