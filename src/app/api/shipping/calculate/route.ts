import { NextRequest, NextResponse } from "next/server";

import { calculateProductWeight, calculateShipping } from "@/lib/shipping";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cep, items, totalValue } = body;

    // Validar dados de entrada
    if (
      !cep ||
      !items ||
      !Array.isArray(items) ||
      typeof totalValue !== "number"
    ) {
      return NextResponse.json(
        { success: false, error: "Dados inválidos" },
        { status: 400 },
      );
    }

    // Calcular peso total dos produtos
    const totalWeight = calculateProductWeight(items);

    // Calcular frete
    const shippingResult = await calculateShipping({
      cep,
      weight: totalWeight,
      value: totalValue,
      items: items.map((item: any) => ({
        quantity: item.quantity,
        weight: 500, // peso padrão por item
      })),
    });

    return NextResponse.json(shippingResult);
  } catch (error) {
    console.error("Erro na API de frete:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
