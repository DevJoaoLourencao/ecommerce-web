"use client";

import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react";
import Image from "next/image";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCentsToBRL } from "@/helpers/money";

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

const getStatusInfo = (status: string) => {
  switch (status) {
    case "pending":
      return {
        label: "Processando",
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        description: "Estamos processando seu pedido",
      };
    case "paid":
      return {
        label: "Confirmado",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        description: "Pedido confirmado e sendo preparado",
      };
    case "canceled":
      return {
        label: "Cancelado",
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        description: "Pedido cancelado",
      };
    default:
      return {
        label: "Processando",
        color: "bg-gray-100 text-gray-800",
        icon: Clock,
        description: "Estamos processando seu pedido",
      };
  }
};

const Orders = ({ orders }: OrdersProps) => {
  if (orders.length === 0) {
    return (
      <div className="py-12 text-center">
        <Package className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          Nenhum pedido encontrado
        </h3>
        <p className="mb-6 text-gray-500">
          Você ainda não fez nenhum pedido. Que tal começar a comprar?
        </p>
        <Button asChild className="rounded-full">
          <a href="/">Começar a comprar</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meus Pedidos</h1>
        <p className="text-gray-600">Acompanhe o status dos seus pedidos</p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {orders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          const StatusIcon = statusInfo.icon;
          const orderDate = new Date(order.createdAt);

          return (
            <AccordionItem
              key={order.id}
              value={order.id}
              className="rounded-lg border"
            >
              <Card className="overflow-hidden border-0">
                <AccordionTrigger className="p-0 hover:no-underline">
                  <CardHeader className="w-full">
                    <div className="flex w-full flex-col justify-between gap-2">
                      <Badge
                        variant="outline"
                        className={`${statusInfo.color} rounded-full`}
                      >
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusInfo.label}
                      </Badge>
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-left">
                            <h3 className="font-semibold text-gray-900">
                              Pedido #{order.id.slice(-8).toUpperCase()}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {orderDate.toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {formatCentsToBRL(order.totalPriceInCents)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.items.length}{" "}
                            {order.items.length === 1 ? "item" : "itens"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </AccordionTrigger>

                <AccordionContent>
                  <CardContent className="p-6 pt-0">
                    <div className="space-y-6">
                      {/* Status Description */}
                      <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-gray-600">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">
                          {statusInfo.description}
                        </span>
                      </div>

                      {/* Order Summary */}
                      <div>
                        <h4 className="mb-3 font-semibold text-gray-900">
                          Resumo do Pedido
                        </h4>
                        <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">
                              {formatCentsToBRL(order.totalPriceInCents)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Frete</span>
                            <span className="font-medium text-green-600">
                              Grátis
                            </span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>
                              {formatCentsToBRL(order.totalPriceInCents)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* All Products */}
                      <div>
                        <h4 className="mb-3 font-semibold text-gray-900">
                          Itens do Pedido
                        </h4>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-4 rounded-lg border bg-white p-3"
                            >
                              <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                                <Image
                                  src={item.imageUrl}
                                  alt={item.productName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="mb-1 font-medium text-gray-900">
                                  {item.productName}
                                </p>
                                <p className="mb-1 text-sm text-gray-500">
                                  {item.productVariantName}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Quantidade: {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900">
                                  {formatCentsToBRL(
                                    item.priceInCents * item.quantity,
                                  )}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {formatCentsToBRL(item.priceInCents)} cada
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Details */}
                      <div>
                        <h4 className="mb-3 font-semibold text-gray-900">
                          Detalhes do Pedido
                        </h4>
                        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                          <div className="space-y-2">
                            <div>
                              <span className="text-gray-600">
                                Número do Pedido:
                              </span>
                              <p className="font-medium">
                                #{order.id.slice(-8).toUpperCase()}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                Data do Pedido:
                              </span>
                              <p className="font-medium">
                                {orderDate.toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="text-gray-600">Status:</span>
                              <p className="font-medium">{statusInfo.label}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                Forma de Pagamento:
                              </span>
                              <p className="font-medium">Cartão de Crédito</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 border-t pt-4">
                        {order.status === "paid" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 rounded-full"
                          >
                            <Truck className="mr-2 h-4 w-4" />
                            Rastrear pedido
                          </Button>
                        )}
                        {order.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 rounded-full"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancelar pedido
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default Orders;
