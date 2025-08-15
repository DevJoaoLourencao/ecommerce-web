import Image from "next/image";
import Link from "next/link";

import { Header } from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCategories } from "@/helpers/categories";

const CheckoutSuccessPage = async () => {
  const categories = await getCategories();

  return (
    <>
      <Header categories={categories} />
      <div className="px-5 pt-25">
        <div className="flex min-h-[80vh] items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <Image
                src="/success.png"
                alt="Success"
                width={200}
                height={200}
                className="mx-auto mb-6"
              />
              <h1 className="mb-4 text-2xl font-semibold">Pedido efetuado!</h1>
              <p className="mb-8 text-gray-600">
                Seu pedido foi efetuado com sucesso. Você pode acompanhar o
                status na seção de "Meus Pedidos".
              </p>

              <div className="space-y-3">
                <Button className="w-full rounded-full" size="lg" asChild>
                  <Link href="/my-orders">Ver meus pedidos</Link>
                </Button>
                <Button
                  className="w-full rounded-full"
                  variant="outline"
                  size="lg"
                  asChild
                >
                  <Link href="/">Voltar para a loja</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CheckoutSuccessPage;
