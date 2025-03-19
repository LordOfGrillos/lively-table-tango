
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string | undefined;
  onCategoryChange: (category: string | undefined) => void;
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange
}: SearchFilterBarProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search menu..." 
          className="pl-9"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={undefined}><em>All Categories</em></SelectItem>
          <SelectItem value="Appetizers">Appetizers</SelectItem>
          <SelectItem value="Main Courses">Main Courses</SelectItem>
          <SelectItem value="Sides">Sides</SelectItem>
          <SelectItem value="Desserts">Desserts</SelectItem>
          <SelectItem value="Beverages">Beverages</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
