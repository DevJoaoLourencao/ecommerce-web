import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCartShipping } from "@/actions/update-cart-shipping";
import { UpdateCartShippingData } from "@/actions/update-cart-shipping/schema";

import { getUseCartQueryKey } from "../queries/use-cart";

export function useUpdateCartShipping() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCartShippingData) => updateCartShipping(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUseCartQueryKey(),
      });
    },
  });
}
