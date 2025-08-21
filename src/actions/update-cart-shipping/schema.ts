import { z } from "zod";

export const updateCartShippingSchema = z.object({
  shippingOptionId: z.string().min(1, "ID da opção de frete é obrigatório"),
  shippingOptionName: z.string().min(1, "Nome da opção de frete é obrigatório"),
  shippingCostInCents: z.number().min(0, "Custo do frete deve ser >= 0"),
  shippingDeliveryDays: z.number().min(1, "Prazo de entrega deve ser >= 1"),
});

export type UpdateCartShippingData = z.infer<typeof updateCartShippingSchema>;
