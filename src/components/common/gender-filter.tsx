"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "../ui/button";

const genders = [
  { value: "todos", label: "Todos" },
  { value: "masculino", label: "Masculino" },
  { value: "feminino", label: "Feminino" },
  { value: "unissex", label: "Unissex" },
] as const;

interface GenderFilterProps {
  currentPath: string;
}

const GenderFilter = ({ currentPath }: GenderFilterProps) => {
  const searchParams = useSearchParams();
  const currentGender = searchParams.get("gender") || "todos";

  const createGenderUrl = (gender: string) => {
    const params = new URLSearchParams(searchParams);
    if (gender === "todos") {
      params.delete("gender");
    } else {
      params.set("gender", gender);
    }

    const queryString = params.toString();
    return `${currentPath}${queryString ? `?${queryString}` : ""}`;
  };

  return (
    <div className="rounded-3xl bg-[#F4EFFF] p-6">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">
        Filtrar por gênero
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {genders.map((gender) => (
          <Button
            key={gender.value}
            variant={currentGender === gender.value ? "default" : "ghost"}
            className="rounded-full text-xs font-semibold"
            asChild
          >
            <Link href={createGenderUrl(gender.value)}>{gender.label}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GenderFilter;
