
import { useState } from "react";
import { MenuItem, MenuItemType, ItemCustomization } from "./MenuItem";
import { Badge } from "@/components/ui/badge";

interface MenuCategoryProps {
  category: string;
  items: MenuItemType[];
  onAddToOrder: (item: MenuItemType, quantity: number, customizations?: ItemCustomization) => void;
}

export function MenuCategory({ category, items, onAddToOrder }: MenuCategoryProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="mb-6">
      <div 
        className="flex items-center justify-between mb-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium">{category}</h2>
          <Badge variant="outline">{items.length}</Badge>
        </div>
        <div className="text-gray-500 text-sm">
          {expanded ? "Hide" : "Show"}
        </div>
      </div>
      
      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map(item => (
            <MenuItem 
              key={item.id} 
              item={item} 
              onAddToOrder={onAddToOrder} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
