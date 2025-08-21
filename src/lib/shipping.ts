export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  deliveryTimeInDays: number;
  carrierLogo?: string;
}

export interface ShippingCalculationRequest {
  cep: string;
  weight: number; // em gramas
  value: number; // valor declarado em centavos
  items: Array<{
    quantity: number;
    weight: number; // peso por item em gramas
  }>;
}

export interface ShippingCalculationResponse {
  success: boolean;
  options: ShippingOption[];
  error?: string;
}

// Simula consulta de frete baseada no CEP
export async function calculateShipping(
  request: ShippingCalculationRequest,
): Promise<ShippingCalculationResponse> {
  try {
    // Validar CEP
    const cleanCep = request.cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      return {
        success: false,
        options: [],
        error: "CEP inválido",
      };
    }

    // Simular delay de API real
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Calcular peso total
    const totalWeight = request.items.reduce(
      (acc, item) => acc + item.quantity * item.weight,
      0,
    );

    // Simular diferentes preços baseados na região (primeiros 2 dígitos do CEP)
    const region = cleanCep.substring(0, 2);
    const distanceMultiplier = getDistanceMultiplier(region);

    // Opções de frete simuladas
    const baseOptions: Omit<ShippingOption, "priceInCents">[] = [
      {
        id: "pac",
        name: "PAC",
        description: "Encomenda econômica dos Correios",
        deliveryTimeInDays: 8,
      },
      {
        id: "sedex",
        name: "SEDEX",
        description: "Entrega expressa dos Correios",
        deliveryTimeInDays: 3,
      },
      {
        id: "sedex10",
        name: "SEDEX 10",
        description: "Entrega no próximo dia útil",
        deliveryTimeInDays: 1,
      },
    ];

    // Calcular preços baseados no peso, distância e valor
    const options: ShippingOption[] = baseOptions.map((option) => {
      let basePrice = 0;

      // Preço base por modalidade
      switch (option.id) {
        case "pac":
          basePrice = 1200; // R$ 12,00
          break;
        case "sedex":
          basePrice = 2500; // R$ 25,00
          break;
        case "sedex10":
          basePrice = 4500; // R$ 45,00
          break;
      }

      // Adicionar custo por peso (R$ 0,50 por 100g)
      const weightCost = Math.ceil(totalWeight / 100) * 50;

      // Aplicar multiplicador de distância
      const distanceCost = basePrice * distanceMultiplier;

      // Adicionar seguro baseado no valor (0.5% do valor)
      const insuranceCost = Math.ceil(request.value * 0.005);

      const finalPrice = basePrice + weightCost + distanceCost + insuranceCost;

      return {
        ...option,
        priceInCents: Math.max(finalPrice, 500), // Mínimo R$ 5,00
      };
    });

    // Filtrar opções muito caras (acima de R$ 150)
    const filteredOptions = options.filter(
      (option) => option.priceInCents <= 15000,
    );

    // Frete grátis para compras acima de R$ 200
    if (request.value >= 20000) {
      filteredOptions.unshift({
        id: "free",
        name: "Frete Grátis",
        description: "Entrega gratuita para compras acima de R$ 200",
        priceInCents: 0,
        deliveryTimeInDays: 10,
      });
    }

    return {
      success: true,
      options: filteredOptions,
    };
  } catch (error) {
    console.error("Erro ao calcular frete:", error);
    return {
      success: false,
      options: [],
      error: "Erro interno no cálculo do frete",
    };
  }
}

// Simula multiplicador de distância baseado na região do CEP
function getDistanceMultiplier(region: string): number {
  const regionMultipliers: Record<string, number> = {
    // São Paulo (região base)
    "01": 0.8,
    "02": 0.8,
    "03": 0.8,
    "04": 0.8,
    "05": 0.8,
    "08": 0.8,
    "09": 0.8,

    // Rio de Janeiro
    "20": 1.0,
    "21": 1.0,
    "22": 1.0,
    "23": 1.0,
    "24": 1.0,
    "28": 1.0,

    // Minas Gerais
    "30": 1.2,
    "31": 1.2,
    "32": 1.2,
    "33": 1.2,
    "34": 1.2,
    "35": 1.2,
    "36": 1.2,
    "37": 1.2,
    "38": 1.2,
    "39": 1.2,

    // Sul
    "80": 1.4,
    "81": 1.4,
    "82": 1.4,
    "83": 1.4,
    "84": 1.4,
    "85": 1.4, // PR
    "88": 1.6,
    "89": 1.6, // SC
    "90": 1.8,
    "91": 1.8,
    "92": 1.8,
    "93": 1.8,
    "94": 1.8,
    "95": 1.8, // RS
    "96": 1.8,
    "97": 1.8,
    "98": 1.8,
    "99": 1.8,

    // Nordeste
    "40": 2.2,
    "41": 2.2,
    "42": 2.2,
    "43": 2.2,
    "44": 2.2,
    "45": 2.2, // BA
    "50": 2.0,
    "51": 2.0,
    "52": 2.0,
    "53": 2.0,
    "54": 2.0,
    "55": 2.0, // PE
    "56": 2.0,
    "57": 2.0,
    "58": 2.0,
    "59": 2.0, // PB/RN
    "60": 1.8,
    "61": 1.8,
    "62": 1.8,
    "63": 1.8, // CE

    // Norte
    "68": 3.0,
    "69": 3.0, // AC
    "76": 2.8,
    "77": 2.8, // RO
    "78": 2.6,
    "79": 2.6, // MT/MS
  };

  return regionMultipliers[region] || 2.5; // Default para regiões não mapeadas
}

// Função para calcular peso estimado dos produtos
export function calculateProductWeight(
  items: Array<{ quantity: number }>,
): number {
  // Peso estimado por produto: 500g (tênis/roupas)
  return items.reduce((acc, item) => acc + item.quantity * 500, 0);
}
