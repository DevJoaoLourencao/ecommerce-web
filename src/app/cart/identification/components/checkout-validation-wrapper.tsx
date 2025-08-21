"use client";

import { useCallback, useState } from "react";

import CheckoutManager from "../../components/checkout-manager";
import Addresses from "./addresses";

interface CheckoutValidationWrapperProps {
  subtotalInCents: number;
  products: Array<{
    id: string;
    name: string;
    variantName: string;
    quantity: number;
    priceInCents: number;
    imageUrl: string;
  }>;
  shippingAddresses: Array<{
    id: string;
    name: string;
    phone: string;
    cep: string;
    street: string;
    number: string;
    complement: string | null;
    neighborhood: string;
    city: string;
    state: string;
    userId: string;
    createdAt: Date;
  }>;
  defaultShippingAddressId: string | null;
  initialShipping?: {
    id: string;
    name: string;
    priceInCents: number;
    deliveryTimeInDays: number;
  } | null;
}

const CheckoutValidationWrapper = ({
  subtotalInCents,
  products,
  shippingAddresses,
  defaultShippingAddressId,
  initialShipping,
}: CheckoutValidationWrapperProps) => {
  // O frete é válido se existe initialShipping (dados salvos no carrinho)
  const [isShippingValid, setIsShippingValid] = useState(
    !!initialShipping &&
      !!initialShipping.id &&
      !!initialShipping.priceInCents !== undefined,
  );

  // Usar useCallback para evitar re-criações desnecessárias da função
  const handleShippingValidChange = useCallback((isValid: boolean) => {
    setIsShippingValid(isValid);
  }, []);

  return (
    <div className="space-y-4">
      <CheckoutManager
        subtotalInCents={subtotalInCents}
        products={products}
        onShippingValidChange={handleShippingValidChange}
        initialShipping={initialShipping}
      />
      <Addresses
        shippingAddresses={shippingAddresses}
        defaultShippingAddressId={defaultShippingAddressId}
        isShippingValid={isShippingValid}
      />
    </div>
  );
};

export default CheckoutValidationWrapper;
