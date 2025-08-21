"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { addProductToCart } from "@/actions/add-cart-product";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  productVariantId: string;
  quantity: number;
  stock: number;
}

const AddToCartButton = ({
  productVariantId,
  quantity,
  stock,
}: AddToCartButtonProps) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["addProductToCart", productVariantId, quantity],
    mutationFn: () =>
      addProductToCart({
        productVariantId,
        quantity,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      // Mostrar toast de sucesso
      toast.success("Produto adicionado à sacola!");

      // Abrir modal da sacola após pequeno delay
      setTimeout(() => {
        const cartButton = document.querySelector(
          "[data-cart-trigger]",
        ) as HTMLButtonElement;
        if (cartButton) {
          cartButton.click();
        }
      }, 500);
    },
    onError: () => {
      toast.error("Erro ao adicionar produto à sacola.");
    },
  });
  const isOutOfStock = stock === 0;
  const isLowStock = stock <= 3 && stock > 0;

  return (
    <Button
      className="rounded-full"
      size="lg"
      variant="outline"
      disabled={isPending || isOutOfStock}
      onClick={() => mutate()}
    >
      {isPending && <Loader2 className="animate-spin" />}
      {isOutOfStock ? "Fora de estoque" : "Adicionar à sacola"}
    </Button>
  );
};

export default AddToCartButton;
