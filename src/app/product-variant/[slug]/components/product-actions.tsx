"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import AddToCartButton from "./add-to-cart-button";
import BuyNowButton from "./buy-now-button";
import NotifyAvailabilityButton from "./notify-availability-button";

interface ProductActionsProps {
  productVariantId: string;
  stock: number;
  productName: string;
  variantName: string;
}

const ProductActions = ({ 
  productVariantId, 
  stock, 
  productName, 
  variantName 
}: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = stock === 0;

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleIncrement = () => {
    setQuantity((prev) => (prev < stock ? prev + 1 : prev));
  };

  return (
    <>
      {!isOutOfStock && (
        <div className="px-5">
          <div className="space-y-4">
            <h3 className="font-medium">Quantidade</h3>
            <div className="flex w-[100px] items-center justify-between rounded-lg border">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full"
                onClick={handleDecrement}
              >
                <MinusIcon />
              </Button>
              <p>{quantity}</p>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full"
                onClick={handleIncrement}
              >
                <PlusIcon />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col space-y-4 px-5">
        {isOutOfStock ? (
          <NotifyAvailabilityButton
            productVariantId={productVariantId}
            productName={productName}
            variantName={variantName}
          />
        ) : (
          <>
            <AddToCartButton
              productVariantId={productVariantId}
              quantity={quantity}
              stock={stock}
            />
            <BuyNowButton
              productVariantId={productVariantId}
              quantity={quantity}
              stock={stock}
            />
          </>
        )}
      </div>
    </>
  );
};

export default ProductActions;
