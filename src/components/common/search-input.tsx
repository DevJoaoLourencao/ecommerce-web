"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <div className="relative">
      {!isOpen ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="h-10 w-10 rounded-full"
        >
          <SearchIcon className="h-5 w-5" />
        </Button>
      ) : (
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 rounded-full pr-10"
              autoFocus
              onBlur={() => {
                // Só fecha se não tiver texto
                if (!searchTerm.trim()) {
                  setIsOpen(false);
                }
              }}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 h-full rounded-full"
            >
              <SearchIcon className="h-4 w-4" />
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
