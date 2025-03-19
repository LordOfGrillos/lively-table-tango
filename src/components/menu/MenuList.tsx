
import { MenuCategory } from "./MenuCategory";
import { MenuItemType, ItemCustomization } from "./MenuItem";
import { getMenuByCategory } from "@/data/menuData";

interface MenuListProps {
  onAddToOrder: (item: MenuItemType, quantity: number, customizations?: ItemCustomization) => void;
  searchQuery?: string;
  selectedCategory?: string;
}

export function MenuList({ onAddToOrder, searchQuery = "", selectedCategory }: MenuListProps) {
  const menuByCategory = getMenuByCategory();
  
  // Filter categories based on selectedCategory if provided
  const categoriesToShow = selectedCategory 
    ? { [selectedCategory]: menuByCategory[selectedCategory] } 
    : menuByCategory;
  
  // Filter items based on search query
  const filteredCategories: Record<string, MenuItemType[]> = {};
  
  Object.entries(categoriesToShow).forEach(([category, items]) => {
    const filteredItems = items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (filteredItems.length > 0) {
      filteredCategories[category] = filteredItems;
    }
  });
  
  if (Object.keys(filteredCategories).length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        No menu items found matching your search.
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {Object.entries(filteredCategories).map(([category, items]) => (
        <MenuCategory
          key={category}
          category={category}
          items={items}
          onAddToOrder={onAddToOrder}
        />
      ))}
    </div>
  );
}
