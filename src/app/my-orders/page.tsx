import { Header } from "@/components/common/header";
import { db } from "@/db";
import { orderTable } from "@/db/schema";
import { getCategories } from "@/helpers/categories";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Orders from "./components/orders";

const MyOrdersPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return redirect("/authentication");
  }

  const [orders, categories] = await Promise.all([
    db.query.orderTable.findMany({
      where: eq(orderTable.userId, session.user.id),
      with: {
        items: {
          with: {
            productVariant: {
              with: {
                product: true,
              },
            },
          },
        },
      },
    }),
    getCategories(),
  ]);

  return (
    <>
      <Header categories={categories} />
      <div className="px-5 pt-25">
        <Orders
          orders={orders.map((order) => ({
            id: order.id,
            totalPriceInCents: order.totalPriceInCents,
            status: order.status,
            createdAt: order.createdAt.toISOString(),
            items: order.items.map((item) => ({
              imageUrl: item.productVariant.imageUrl,
              productName: item.productVariant.product.name,
              productVariantName: item.productVariant.name,
              priceInCents: item.productVariant.priceInCents,
              quantity: item.quantity,
            })),
          }))}
        />
      </div>
    </>
  );
};

export default MyOrdersPage;
