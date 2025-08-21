import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { getCategories } from "@/helpers/categories";
import { getCategoriesByGender } from "@/helpers/gender-categories";
import { formatCentsToBRL } from "@/helpers/money";

import EnhancedVariantSelector from "./components/enhanced-variant-selector";
import ProductActions from "./components/product-actions";

interface ProductVariantPageProps {
  params: Promise<{ slug: string }>;
}

const ProductVariantPage = async ({ params }: ProductVariantPageProps) => {
  const { slug } = await params;
  const [productVariant, categories, genderCategories] = await Promise.all([
    db.query.productVariantTable.findFirst({
      where: eq(productVariantTable.slug, slug),
      with: {
        product: {
          with: {
            variants: true,
          },
        },
      },
    }),
    getCategories(),
    getCategoriesByGender(),
  ]);
  if (!productVariant) {
    return notFound();
  }
  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, productVariant.product.categoryId),
    with: {
      variants: true,
    },
  });
  return (
    <>
      <Header categories={categories} genderCategories={genderCategories} />
      <div className="flex flex-col space-y-6 pt-19">
        <Image
          src={productVariant.imageUrl}
          alt={productVariant.name}
          sizes="100vw"
          height={0}
          width={0}
          className="h-auto w-full object-cover"
        />

        <div className="px-5">
          <EnhancedVariantSelector
            selectedVariantSlug={productVariant.slug}
            variants={productVariant.product.variants}
          />
        </div>

        <div className="px-5">
          {/* DESCRIÇÃO */}
          <h2 className="text-lg font-semibold">
            {productVariant.product.name}
          </h2>
          <h3 className="text-muted-foreground text-sm">
            {productVariant.name}
          </h3>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">
              {formatCentsToBRL(productVariant.priceInCents)}
            </h3>
            {productVariant.stock <= 3 && productVariant.stock > 0 && (
              <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-600">
                Apenas {productVariant.stock} em estoque
              </span>
            )}
            {productVariant.stock === 0 && (
              <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
                Fora de estoque
              </span>
            )}
          </div>
        </div>

        <ProductActions
          productVariantId={productVariant.id}
          stock={productVariant.stock}
          productName={productVariant.product.name}
          variantName={productVariant.name}
        />

        <div className="px-5">
          <p className="text-shadow-amber-600">
            {productVariant.product.description}
          </p>
        </div>

        <ProductList title="Talvez você goste" products={likelyProducts} />

        <Footer />
      </div>
    </>
  );
};

export default ProductVariantPage;
