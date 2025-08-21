"use client";

import { Heart, User, Users } from "lucide-react";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GenderCategories } from "@/helpers/gender-categories";

interface GenderCategoriesAccordionProps {
  genderCategories: GenderCategories;
}

const GenderCategoriesAccordion = ({
  genderCategories,
}: GenderCategoriesAccordionProps) => {
  const genderConfig = [
    {
      key: "masculino" as const,
      label: "Masculino",
      icon: User,
      categories: genderCategories.masculino,
    },
    {
      key: "feminino" as const,
      label: "Feminino",
      icon: Heart,
      categories: genderCategories.feminino,
    },
    {
      key: "unissex" as const,
      label: "Unissex",
      icon: Users,
      categories: genderCategories.unissex,
    },
  ];

  return (
    <div className="space-y-1">
      <Accordion type="multiple" className="w-full">
        {genderConfig.map((gender) => {
          if (gender.categories.length === 0) return null;

          const Icon = gender.icon;

          return (
            <AccordionItem
              key={gender.key}
              value={gender.key}
              className="border-none"
            >
              <AccordionTrigger className="rounded-lg px-3 py-2 text-left hover:bg-gray-50 hover:no-underline">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-700">
                    {gender.label}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({gender.categories.length})
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <div className="ml-8 space-y-1">
                  {gender.categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}?gender=${gender.key}`}
                      className="block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-50"
                    >
                      <span className="text-gray-600 hover:text-gray-900">
                        {category.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default GenderCategoriesAccordion;
