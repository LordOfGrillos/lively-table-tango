
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchAndFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SearchAndFilterBar({ searchQuery, setSearchQuery }: SearchAndFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search inventory items..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button variant="outline" className="w-full sm:w-auto">
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </Button>
    </div>
  );
}
