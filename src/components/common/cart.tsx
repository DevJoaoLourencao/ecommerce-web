"use client";

import { ShoppingBag, ShoppingBasketIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { formatCentsToBRL } from "@/helpers/money";
import { useCart } from "@/hooks/queries/use-cart";

import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import CartItem from "./cart-item";

export const Cart = () => {
  const { data: cart } = useCart();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" data-cart-trigger>
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-80 rounded-l-3xl p-0 [&>button]:absolute [&>button]:top-4 [&>button]:right-4 [&>button]:flex [&>button]:h-10 [&>button]:w-10 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:bg-gray-100 [&>button]:hover:bg-gray-200">
        <div className="flex h-full flex-col">
          {/* Header da Sacola */}
          <div className="p-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">Sacola</h2>
            </div>
          </div>
          <Separator />

          {/* Lista de Produtos */}
          <div className="flex-1 overflow-hidden">
            {cart?.items && cart?.items.length > 0 ? (
              <ScrollArea className="h-full">
                <div className="space-y-4 p-6">
                  {cart?.items.map((item) => (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      productVariantId={item.productVariant.id}
                      productName={item.productVariant.product.name}
                      productVariantName={item.productVariant.name}
                      productVariantImageUrl={item.productVariant.imageUrl}
                      productVariantPriceInCents={
                        item.productVariant.priceInCents
                      }
                      quantity={item.quantity}
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-6">
                  <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Sua sacola está vazia
                </h3>
                <p className="mb-6 text-sm text-gray-500">
                  Adicione produtos à sua sacola para vê-los aqui
                </p>
                <SheetClose asChild>
                  <Button className="rounded-full">Começar a comprar</Button>
                </SheetClose>
              </div>
            )}
          </div>

          {/* Footer com Resumo e Botões */}
          {cart?.items && cart?.items.length > 0 && (
            <div className="p-6">
              <div className="mb-2 space-y-3">
                <div className="flex items-center justify-between text-base font-medium">
                  <p>Subtotal</p>
                  <p>{formatCentsToBRL(cart?.totalPriceInCents ?? 0)}</p>
                </div>
              </div>

              <Separator className="mb-4" />
              <div className="space-y-3">
                <Button
                  className="h-12 w-full rounded-full bg-purple-600 text-white hover:bg-purple-700"
                  asChild
                >
                  <Link href="/cart/identification">Finalizar a compra</Link>
                </Button>

                <SheetClose asChild>
                  <Button variant="ghost" className="h-12 w-full rounded-full">
                    Continuar comprando
                  </Button>
                </SheetClose>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

// SERVER ACTION
