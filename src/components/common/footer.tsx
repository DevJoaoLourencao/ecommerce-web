import { Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Ações Rápidas */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Ações rápidas</h3>
            <div className="space-y-3">
              <Link
                href="/my-orders"
                className="block text-gray-200 transition-colors hover:text-white"
              >
                Meus pedidos
              </Link>
              <Link
                href="/authentication"
                className="block text-gray-200 transition-colors hover:text-white"
              >
                Minha conta
              </Link>
              <Link
                href="/"
                className="block text-gray-200 transition-colors hover:text-white"
              >
                Produtos em oferta
              </Link>
              <Link
                href="/"
                className="block text-gray-200 transition-colors hover:text-white"
              >
                Lançamentos
              </Link>
              <Link
                href="/"
                className="block text-gray-200 transition-colors hover:text-white"
              >
                Central de ajuda
              </Link>
              <Link
                href="/"
                className="block text-gray-200 transition-colors hover:text-white"
              >
                Rastrear pedido
              </Link>
            </div>
          </div>

          {/* Formas de Pagamento */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Formas de pagamento</h3>
            <div className="grid grid-cols-4 gap-3">
              {/* Simulando ícones de pagamento - você pode substituir por imagens reais */}
              <div className="flex h-8 items-center justify-center rounded bg-white px-2">
                <span className="text-xs font-bold text-orange-600">MC</span>
              </div>
              <div className="flex h-8 items-center justify-center rounded bg-white px-2">
                <span className="text-xs font-bold text-blue-600">VISA</span>
              </div>
              <div className="flex h-8 items-center justify-center rounded bg-white px-2">
                <span className="text-xs font-bold text-blue-700">AMEX</span>
              </div>
              <div className="flex h-8 items-center justify-center rounded bg-white px-2">
                <span className="text-xs font-bold text-black">ELO</span>
              </div>
              <div className="flex h-8 items-center justify-center rounded bg-white px-2">
                <span className="text-xs font-bold text-red-600">HC</span>
              </div>
              <div className="flex h-8 items-center justify-center rounded bg-white px-2">
                <span className="text-xs font-bold text-orange-600">DC</span>
              </div>
              <div className="flex h-8 items-center justify-center rounded bg-white px-2">
                <span className="text-xs font-bold text-teal-600">♦</span>
              </div>
            </div>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Redes sociais</h3>
            <div className="flex gap-4">
              <Link
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="my-8 border-t border-white/20"></div>

        {/* Links Legais */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-200">
          <Link href="#" className="hover:text-white">
            Política de privacidade
          </Link>
          <Link href="#" className="hover:text-white">
            Política de cookies
          </Link>
          <Link href="#" className="hover:text-white">
            Termos de uso
          </Link>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-xs text-gray-300">
          <p>© 2025 MARSEILLE. Todos os direitos reservados.</p>
          <p className="mt-1">
            Fisia Comércio de Produtos Esportivos Ltda - CNPJ:
            59.546.515/0045-55
          </p>
          <p className="mt-1">
            Rodovia Fernão Dias, S/N Km 947.5 - Galpão Modulo 3640 - CEP
            37640-903 - Extrema - MG
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
