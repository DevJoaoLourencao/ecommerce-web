import { useCallback, useState } from "react";
import { toast } from "sonner";

import { ShippingOption } from "@/lib/shipping";

interface UseShippingProps {
  items: Array<{ quantity: number }>;
  totalValue: number;
}

export const useShipping = ({ items, totalValue }: UseShippingProps) => {
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  const calculateShipping = useCallback(
    async (cep: string) => {
      if (!cep || cep.replace(/\D/g, "").length !== 8) {
        toast.error("Por favor, insira um CEP válido");
        return;
      }

      setIsCalculating(true);
      setHasCalculated(false);

      try {
        const response = await fetch("/api/shipping/calculate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cep: cep.replace(/\D/g, ""),
            items,
            totalValue,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setShippingOptions(data.options);
          setHasCalculated(true);

          // Auto-selecionar a primeira opção se não houver seleção
          if (!selectedShipping && data.options.length > 0) {
            setSelectedShipping(data.options[0]);
          }

          toast.success("Frete calculado com sucesso!");
        } else {
          toast.error(data.error || "Erro ao calcular frete");
          setShippingOptions([]);
        }
      } catch (error) {
        console.error("Erro ao calcular frete:", error);
        toast.error("Erro ao calcular frete. Tente novamente.");
        setShippingOptions([]);
      } finally {
        setIsCalculating(false);
      }
    },
    [items, totalValue, selectedShipping],
  );

  const getTotal = useCallback(
    (subtotal: number) => {
      return subtotal + (selectedShipping?.priceInCents || 0);
    },
    [selectedShipping],
  );

  const resetShipping = useCallback(() => {
    setSelectedShipping(null);
    setShippingOptions([]);
    setHasCalculated(false);
  }, []);

  return {
    selectedShipping,
    setSelectedShipping,
    shippingOptions,
    isCalculating,
    hasCalculated,
    calculateShipping,
    getTotal,
    resetShipping,
  };
};
