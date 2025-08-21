"use client";

import { Loader2, Package, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCentsToBRL } from "@/helpers/money";
import { ShippingOption } from "@/lib/shipping";

interface ShippingCalculatorProps {
  items: Array<{
    quantity: number;
  }>;
  totalValue: number;
  onShippingSelect: (shippingOption: ShippingOption | null) => void;
  selectedShipping: ShippingOption | null;
  onCalculationChange?: (hasCalculated: boolean) => void;
  readOnly?: boolean;
}

const ShippingCalculator = ({
  items,
  totalValue,
  onShippingSelect,
  selectedShipping,
  onCalculationChange,
  readOnly = false,
}: ShippingCalculatorProps) => {
  const [cep, setCep] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Inicializar hasCalculated se há frete selecionado (dados carregados do carrinho)
  useEffect(() => {
    if (selectedShipping && !hasCalculated) {
      setHasCalculated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShipping]);

  // Notificar mudança no estado de cálculo
  useEffect(() => {
    onCalculationChange?.(hasCalculated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCalculated]);

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.replace(/(\d{5})(\d{3})/, "$1-$2");
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setCep(formatted);
  };

  const calculateShipping = async () => {
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
          onShippingSelect(data.options[0]);
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
  };

  const handleShippingSelect = (optionId: string) => {
    const option = shippingOptions.find((opt) => opt.id === optionId);
    onShippingSelect(option || null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          {readOnly ? "Frete Selecionado" : "Calcular Frete"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!readOnly && (
          <div className="space-y-2">
            <Label htmlFor="cep">CEP de entrega</Label>
            <div className="flex gap-2">
              <Input
                id="cep"
                placeholder="00000-000"
                value={cep}
                onChange={handleCepChange}
                maxLength={9}
                disabled={isCalculating}
              />
              <Button
                onClick={calculateShipping}
                disabled={isCalculating || !cep}
                className="whitespace-nowrap"
              >
                {isCalculating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Calcular"
                )}
              </Button>
            </div>
          </div>
        )}

        {readOnly && selectedShipping && (
          <div className="space-y-3">
            <div className="rounded-lg border bg-green-50 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-600" />
                  <div>
                    <span className="font-medium text-green-800">
                      {selectedShipping.name}
                    </span>
                    <span className="ml-2 text-xs text-green-600">
                      {selectedShipping.deliveryTimeInDays === 1
                        ? "1 dia útil"
                        : `${selectedShipping.deliveryTimeInDays} dias úteis`}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-green-800">
                  {selectedShipping.priceInCents === 0
                    ? "GRÁTIS"
                    : formatCentsToBRL(selectedShipping.priceInCents)}
                </span>
              </div>
              {selectedShipping.description && (
                <p className="mt-1 text-xs text-green-700">
                  {selectedShipping.description}
                </p>
              )}
            </div>
          </div>
        )}

        {readOnly && !selectedShipping && (
          <div className="text-muted-foreground py-4 text-center">
            <Package className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p className="text-sm">Nenhuma opção de frete selecionada</p>
          </div>
        )}

        {!readOnly && hasCalculated && shippingOptions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Opções de entrega:</h4>
            <RadioGroup
              value={selectedShipping?.id || ""}
              onValueChange={handleShippingSelect}
            >
              {shippingOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-gray-50"
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={option.id}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <Package className="h-4 w-4" />
                        <div>
                          <span className="font-medium">{option.name}</span>
                          <span className="text-muted-foreground ml-2 text-xs">
                            {option.deliveryTimeInDays === 1
                              ? "1 dia útil"
                              : `${option.deliveryTimeInDays} dias úteis`}
                          </span>
                        </div>
                      </Label>
                      <span className="text-primary font-bold">
                        {option.priceInCents === 0
                          ? "GRÁTIS"
                          : formatCentsToBRL(option.priceInCents)}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {!readOnly && hasCalculated && shippingOptions.length === 0 && (
          <div className="text-muted-foreground py-4 text-center">
            <Package className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p className="text-sm">
              Nenhuma opção de frete disponível para este CEP
            </p>
          </div>
        )}

        {!readOnly && !hasCalculated && (
          <div className="text-muted-foreground py-4 text-center">
            <Package className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p className="text-sm">Informe seu CEP para calcular o frete</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShippingCalculator;
