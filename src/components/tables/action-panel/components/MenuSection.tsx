
import { MenuList } from "@/components/menu/MenuList";
import { MenuItemType, ItemCustomization } from "@/components/menu/MenuItem";
import { SearchFilterBar } from "./SearchFilterBar";
import { useState } from "react";

interface MenuSectionProps {
  onAddToOrder: (item: MenuItemType, quantity: number, customizations?: ItemCustomization) => void;
}

export function MenuSection({ onAddToOrder }: MenuSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  return (
    <div>
      <SearchFilterBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <div className="max-h-[350px] overflow-y-auto pr-2">
        <MenuList 
          onAddToOrder={onAddToOrder} 
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />
      </div>
    </div>
  );
}
