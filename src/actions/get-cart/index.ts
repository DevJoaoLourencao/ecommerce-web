"use server";

import { headers } from "next/headers";

import { db } from "@/db";
import { cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const getCart = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
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
  if (!cart) {
    const [newCart] = await db
      .insert(cartTable)
      .values({
        userId: session.user.id,
      })
      .returning();
    return {
      ...newCart,
      items: [],
      subtotalInCents: 0,
      totalPriceInCents: 0,
      shippingAddress: null,
    };
  }
  const subtotalInCents = cart.items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0,
  );
  const shippingCostInCents = cart.shippingCostInCents || 0;

  return {
    ...cart,
    subtotalInCents,
    totalPriceInCents: subtotalInCents + shippingCostInCents,
  };
};
