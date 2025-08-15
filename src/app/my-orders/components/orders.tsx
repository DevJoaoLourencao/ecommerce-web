"use client";

import CartSummary from "@/app/cart/components/cart-summary";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";

interface OrdersProps {
  orders: {
    id: string;
    totalPriceInCents: number;
    status: string;
    createdAt: string;
    items: {
      imageUrl: string;
      productName: string;
      productVariantName: string;
      priceInCents: number;
      quantity: number;
    }[];
  }[];
}

const Orders = ({ orders }: OrdersProps) => {
  return (
    <div className="space-y-5">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent>
            <Accordion type="single" collapsible key={order.id}>
              <AccordionItem value="1">
                <AccordionTrigger>
                  <div className="flex items-center justify-between">
                    <p>
                      {`Pedido feito em ${new Date(order.createdAt).toLocaleDateString("pt-BR")}`}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-6">
                  <CartSummary
                    subtotalInCents={order.totalPriceInCents}
                    totalInCents={order.totalPriceInCents}
                    products={order.items.map((item) => ({
                      id: item.productName,
                      name: item.productName,
                      variantName: item.productVariantName,
                      quantity: item.quantity,
                      imageUrl: item.imageUrl,
                      priceInCents: item.priceInCents,
                    }))}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Orders;
