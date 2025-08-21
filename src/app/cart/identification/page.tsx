import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { getCategories } from "@/helpers/categories";
import { getCategoriesByGender } from "@/helpers/gender-categories";
import { auth } from "@/lib/auth";

import CheckoutValidationWrapper from "./components/checkout-validation-wrapper";

const IdentificationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) {
    redirect("/");
  }
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });
  if (!cart || cart?.items.length === 0) {
    redirect("/");
  }
  const [shippingAddresses, categories, genderCategories] = await Promise.all([
    db.query.shippingAddressTable.findMany({
      where: eq(shippingAddressTable.userId, session.user.id),
    }),
    getCategories(),
    getCategoriesByGender(),
  ]);
  const cartTotalInCents = cart.items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0,
  );
  return (
    <div>
      <Header categories={categories} genderCategories={genderCategories} />
      <div className="px-5 pt-25">
        <CheckoutValidationWrapper
          subtotalInCents={cartTotalInCents}
          products={cart.items.map((item) => ({
            id: item.productVariant.id,
            name: item.productVariant.product.name,
            variantName: item.productVariant.name,
            quantity: item.quantity,
            priceInCents: item.productVariant.priceInCents,
            imageUrl: item.productVariant.imageUrl,
          }))}
          shippingAddresses={shippingAddresses}
          defaultShippingAddressId={cart.shippingAddress?.id || null}
          initialShipping={
            cart.shippingOptionId &&
            cart.shippingOptionName &&
            cart.shippingCostInCents !== null &&
            cart.shippingDeliveryDays
              ? {
                  id: cart.shippingOptionId,
                  name: cart.shippingOptionName,
                  priceInCents: cart.shippingCostInCents,
                  deliveryTimeInDays: cart.shippingDeliveryDays,
                }
              : null
          }
        />
      </div>
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default IdentificationPage;
