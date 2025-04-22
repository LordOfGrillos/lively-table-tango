
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { OrderItem } from "./CounterOrderSystem";
import { getCafeteriaMenu, CafeteriaMenuItem } from "./data/menuData";

interface ProductListProps {
  onAddToOrder: (item: OrderItem) => void;
}

export function ProductList({ onAddToOrder }: ProductListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const menuItems = getCafeteriaMenu();
  
  // Get unique categories
  const categories = ["all", ...new Set(menuItems.map(item => item.category))];
  
  // Filter menu items based on search and category
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Tabs 
        value={selectedCategory} 
        onValueChange={setSelectedCategory}
        className="w-full"
      >
        <ScrollArea className="w-full">
          <TabsList className="w-full flex flex-nowrap overflow-x-auto mb-4">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="flex-shrink-0"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>
        
        {categories.map(category => (
          <TabsContent key={category} value={category} className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems
                .filter(item => category === "all" || item.category === category)
                .map(item => (
                  <ProductCard 
                    key={item.id} 
                    product={item} 
                    onAddToOrder={onAddToOrder} 
                  />
                ))
              }
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
