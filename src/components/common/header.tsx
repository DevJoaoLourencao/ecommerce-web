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
import { useRouter } from "next/navigation";

import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Cart } from "./cart";
import { SearchInput } from "./search-input";

interface HeaderProps {
  categories?: { id: string; name: string; slug: string }[];
}

export const Header = ({ categories = [] }: HeaderProps) => {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const { isVisible } = useScrollDirection();

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between bg-white px-5 pt-6 pb-6">
        {/* Desktop Layout */}
        <div className="hidden w-full items-center justify-between lg:flex">
          {/* Left side - User greeting */}
          <div className="flex items-center">
            {session?.user ? (
              <span className="text-sm text-gray-600">
                Olá, {session.user.name?.split(" ")?.[0]}!
              </span>
            ) : (
              <Button asChild variant="ghost" className="rounded-full text-sm">
                <Link href="/authentication">
                  <LogInIcon className="mr-2 h-4 w-4" />
                  Olá. Faça seu login!
                </Link>
              </Button>
            )}
          </div>

          {/* Center - Logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 transform"
          >
            <Image src="/logo.svg" alt="BEWEAR" width={100} height={26.14} />
          </Link>

          {/* Right side - Search and Cart */}
          <div className="flex items-center gap-3">
            <SearchInput />
            <Cart />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex w-full items-center justify-between lg:hidden">
          <Link href="/">
            <Image src="/logo.svg" alt="BEWEAR" width={100} height={26.14} />
          </Link>

          <div className="flex items-center gap-3">
            <Cart />

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-primary rounded-full"
                >
                  <MenuIcon className="text-white" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-80 rounded-l-3xl p-0 [&>button]:absolute [&>button]:top-4 [&>button]:right-4 [&>button]:flex [&>button]:h-10 [&>button]:w-10 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:bg-gray-100 [&>button]:hover:bg-gray-200">
                <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
                <div className="flex h-full flex-col">
                  {/* Seção do usuário */}
                  <div className="mt-10 p-4">
                    {session?.user ? (
                      <div className="flex items-center gap-2">
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
                          <h3 className="text-sm font-semibold">
                            {session?.user?.name}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {session?.user?.email}
                          </p>
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
                  <div className="space-y-2 px-4 py-2">
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
                  <div className="flex-1 p-4">
                    {categories.length > 0 && (
                      <div className="space-y-1">
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
                      <div className="px-4 py-2">
                        <button
                          onClick={async () => {
                            await authClient.signOut();
                            router.push("/");
                          }}
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
          </div>
        </div>
      </header>

      {/* Desktop Categories Navigation - Only visible on desktop */}
      <nav
        className={`fixed top-[81px] right-0 left-0 z-40 hidden border-b bg-white transition-transform duration-300 ease-in-out lg:block ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex items-center justify-center space-x-8 py-4">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                >
                  {category.name}
                </Link>
              ))
            ) : (
              <>
                <Link
                  href="/category/camisetas"
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                >
                  Camisetas
                </Link>
                <Link
                  href="/category/bermuda-shorts"
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                >
                  Bermuda & Shorts
                </Link>
                <Link
                  href="/category/calcas"
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                >
                  Calças
                </Link>
                <Link
                  href="/category/jaquetas-moletons"
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                >
                  Jaquetas & Moletons
                </Link>
                <Link
                  href="/category/tenis"
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                >
                  Tênis
                </Link>
                <Link
                  href="/category/acessorios"
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                >
                  Acessórios
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};
