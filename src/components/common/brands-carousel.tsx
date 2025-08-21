"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";

const brands = [
  { name: "Nike", logo: "/nike.svg" },
  { name: "Adidas", logo: "/adidas.svg" },
  { name: "Puma", logo: "/puma.svg" },
  { name: "New Balance", logo: "/newbalance.svg" },
  { name: "Zara", logo: "/zara.svg" },
  { name: "Ralph Lauren", logo: "/ralph-lauren.svg" },
];

export const BrandsCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section className="bg-slate-50 py-8">
      <div className="px-5 lg:px-5">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-2 text-left text-xl font-bold text-gray-900">
            Marcas Parceiras
          </h2>
          <p className="mb-6 text-left text-gray-600">
            Conheça as marcas que fazem parte do nosso portfólio
          </p>

          {/* Desktop Layout - Grid */}
          <div className="hidden gap-6 lg:grid lg:grid-cols-6">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Image
                  src={brand.logo}
                  alt={`Logo ${brand.name}`}
                  width={80}
                  height={40}
                  className="max-h-10 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Layout - Carousel usando shadcn/ui */}
      <div className="lg:hidden">
        <div className="pl-5">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {brands.map((brand, index) => (
                <CarouselItem
                  key={index}
                  className="basis-[calc(100%/3.5)] pl-4"
                >
                  <div className="flex aspect-square items-center justify-center rounded-lg border border-gray-200 bg-white">
                    <Image
                      src={brand.logo}
                      alt={`Logo ${brand.name}`}
                      width={80}
                      height={40}
                      className="max-h-10 w-auto object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Dots Navigation */}
          <div className="mt-6 flex justify-center space-x-2">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  index + 1 === current
                    ? "scale-110 bg-gray-800"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
