"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { addProductToCart } from "@/actions/add-cart-product";
import { Button } from "@/components/ui/button";

interface BuyNowButtonProps {
  productVariantId: string;
  quantity: number;
  stock: number;
}

const BuyNowButton = ({
  productVariantId,
  quantity,
  stock,
}: BuyNowButtonProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["buyNow", productVariantId, quantity],
    mutationFn: () =>
      addProductToCart({
        productVariantId,
        quantity,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      // Navegar diretamente para o checkout
      router.push("/cart/identification");
    },
    onError: () => {
      toast.error("Erro ao processar compra.");
    },
  });

  const isOutOfStock = stock === 0;

  return (
    <Button
      className="rounded-full"
      size="lg"
      disabled={isPending || isOutOfStock}
      onClick={() => mutate()}
    >
      {isPending && <Loader2 className="mr-2 animate-spin" />}
      Comprar agora
    </Button>
  );
};

export default BuyNowButton;
