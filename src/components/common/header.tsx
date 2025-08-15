"use client";

import {
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  ShoppingBagIcon,
  TruckIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Cart } from "./cart";

interface HeaderProps {
  categories?: { id: string; name: string; slug: string }[];
}

export const Header = ({ categories = [] }: HeaderProps) => {
  const { data: session } = authClient.useSession();
  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b bg-white p-5">
      <Link href="/">
        <Image src="/logo.svg" alt="BEWEAR" width={100} height={26.14} />
      </Link>

      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-80 rounded-l-3xl p-0 [&>button]:absolute [&>button]:top-4 [&>button]:right-4 [&>button]:flex [&>button]:h-10 [&>button]:w-10 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:bg-gray-100 [&>button]:hover:bg-gray-200">
            <div className="flex h-full flex-col">
              {/* Header do Menu */}
              <div className="p-6">
                <h2 className="text-xl font-semibold">Menu</h2>
              </div>
              <Separator />

              {/* Seção do usuário */}
              <div className="p-6">
                {session?.user ? (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={session?.user?.image as string | undefined}
                      />
                      <AvatarFallback className="text-lg">
                        {session?.user?.name?.split(" ")?.[0]?.[0]}
                        {session?.user?.name?.split(" ")?.[1]?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-base font-semibold">
                        {session?.user?.name}
                      </h3>
                      <span className="text-sm text-gray-600">
                        {session?.user?.email}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      Olá. Faça seu login!
                    </h2>
                    <Button asChild className="rounded-full">
                      <Link href="/authentication">
                        Login <LogInIcon className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
              <Separator />

              {/* Navegação Principal */}
              <div className="space-y-2 p-6">
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
                >
                  <HomeIcon className="h-5 w-5" />
                  <span className="font-medium">Início</span>
                </Link>

                {session?.user && (
                  <Link
                    href="/my-orders"
                    className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
                  >
                    <TruckIcon className="h-5 w-5" />
                    <span className="font-medium">Meus Pedidos</span>
                  </Link>
                )}

                <SheetClose asChild>
                  <button
                    onClick={() => {
                      // O SheetClose já fecha o menu
                      // Agora vamos disparar um clique no botão do carrinho
                      setTimeout(() => {
                        const cartButton = document.querySelector(
                          "[data-cart-trigger]",
                        ) as HTMLButtonElement;
                        if (cartButton) {
                          cartButton.click();
                        }
                      }, 100);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-50"
                  >
                    <ShoppingBagIcon className="h-5 w-5" />
                    <span className="font-medium">Sacola</span>
                  </button>
                </SheetClose>
              </div>
              <Separator />

              {/* Categorias */}
              <div className="mt-5 flex-1">
                {categories.length > 0 && (
                  <div className="space-y-1 p-6 pt-0">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="block rounded-lg p-3 transition-colors hover:bg-gray-50"
                      >
                        <span className="font-medium text-gray-700">
                          {category.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Sair da conta - só aparece quando logado */}
              {session?.user && (
                <div className="mt-auto">
                  <Separator />
                  <div className="p-6">
                    <button
                      onClick={() => authClient.signOut()}
                      className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-50"
                    >
                      <LogOutIcon className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-700">
                        Sair da conta
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
        <Cart />
      </div>
    </header>
  );
};
