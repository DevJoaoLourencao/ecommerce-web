"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { UpdateCartShippingData, updateCartShippingSchema } from "./schema";

export async function updateCartShipping(data: UpdateCartShippingData) {
  try {
    // Validar os dados de entrada
    const validatedData = updateCartShippingSchema.parse(data);

    // Verificar se o usuário está autenticado
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      throw new Error("Usuário não autenticado");
    }

    // Buscar o carrinho do usuário
    const cart = await db.query.cartTable.findFirst({
      where: eq(cartTable.userId, session.user.id),
    });

    if (!cart) {
      throw new Error("Carrinho não encontrado");
    }

    // Atualizar o carrinho com as informações de frete
    await db
      .update(cartTable)
      .set({
        shippingOptionId: validatedData.shippingOptionId,
        shippingOptionName: validatedData.shippingOptionName,
        shippingCostInCents: validatedData.shippingCostInCents,
        shippingDeliveryDays: validatedData.shippingDeliveryDays,
      })
      .where(eq(cartTable.id, cart.id));

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar frete do carrinho:", error);
    throw new Error(
      error instanceof Error ? error.message : "Erro interno do servidor",
    );
  }
}
