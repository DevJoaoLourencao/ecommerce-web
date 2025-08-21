"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useUpdateCartShipping } from "@/hooks/mutations/use-update-cart-shipping";
import { ShippingOption } from "@/lib/shipping";

import CartSummary from "./cart-summary";
import ShippingCalculator from "./shipping-calculator";

interface CheckoutManagerProps {
  subtotalInCents: number;
  products: Array<{
    id: string;
    name: string;
    variantName: string;
    quantity: number;
    priceInCents: number;
    imageUrl: string;
  }>;
  onShippingValidChange?: (isValid: boolean) => void;
  initialShipping?: {
    id: string;
    name: string;
    priceInCents: number;
    deliveryTimeInDays: number;
  } | null;
  readOnly?: boolean;
}

const CheckoutManager = ({
  subtotalInCents,
  products,
  onShippingValidChange,
  initialShipping,
  readOnly = false,
}: CheckoutManagerProps) => {
  const updateCartShippingMutation = useUpdateCartShipping();

  // Inicializar com dados do carrinho se disponíveis
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(
      initialShipping
        ? {
            id: initialShipping.id,
            name: initialShipping.name,
            description: "",
            priceInCents: initialShipping.priceInCents,
            deliveryTimeInDays: initialShipping.deliveryTimeInDays,
          }
        : null,
    );
  const [totalInCents, setTotalInCents] = useState(
    subtotalInCents + (initialShipping?.priceInCents || 0),
  );
  const [hasCalculated, setHasCalculated] = useState(!!initialShipping);

  // Atualizar total quando frete é selecionado
  useEffect(() => {
    const shippingCost = selectedShipping?.priceInCents || 0;
    setTotalInCents(subtotalInCents + shippingCost);
  }, [selectedShipping, subtotalInCents]);

  // Notificar mudança na validação do frete
  useEffect(() => {
    const isValid = hasCalculated && selectedShipping !== null;
    onShippingValidChange?.(isValid);
  }, [hasCalculated, selectedShipping, onShippingValidChange]);

  // Garantir que a validação inicial seja enviada apenas uma vez
  useEffect(() => {
    if (initialShipping && selectedShipping) {
      onShippingValidChange?.(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialShipping, selectedShipping]);

  // Salvar frete no carrinho quando selecionado
  useEffect(() => {
    if (selectedShipping && hasCalculated) {
      // Verificar se o frete mudou antes de salvar
      const hasChanged =
        !initialShipping ||
        initialShipping.id !== selectedShipping.id ||
        initialShipping.priceInCents !== selectedShipping.priceInCents;

      if (hasChanged) {
        updateCartShippingMutation.mutate(
          {
            shippingOptionId: selectedShipping.id,
            shippingOptionName: selectedShipping.name,
            shippingCostInCents: selectedShipping.priceInCents,
            shippingDeliveryDays: selectedShipping.deliveryTimeInDays,
          },
          {
            onSuccess: () => {
              // Frete salvo com sucesso
            },
            onError: (error) => {
              console.error("Erro ao salvar frete:", error);
              toast.error("Erro ao salvar opção de frete");
            },
          },
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShipping, hasCalculated, initialShipping]);

  const cartItems = products.map((product) => ({
    quantity: product.quantity,
  }));

  return (
    <div className="space-y-4">
      <CartSummary
        subtotalInCents={subtotalInCents}
        shippingInCents={selectedShipping?.priceInCents || 0}
        totalInCents={totalInCents}
        products={products}
      />

      {!readOnly && (
        <ShippingCalculator
          items={cartItems}
          totalValue={subtotalInCents}
          onShippingSelect={setSelectedShipping}
          selectedShipping={selectedShipping}
          onCalculationChange={setHasCalculated}
        />
      )}

      {readOnly && selectedShipping && (
        <ShippingCalculator
          items={cartItems}
          totalValue={subtotalInCents}
          onShippingSelect={setSelectedShipping}
          selectedShipping={selectedShipping}
          onCalculationChange={setHasCalculated}
          readOnly={true}
        />
      )}
    </div>
  );
};

export default CheckoutManager;
