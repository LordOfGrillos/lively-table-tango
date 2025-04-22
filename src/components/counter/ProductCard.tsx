
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { ProductCustomizationDialog } from "./ProductCustomizationDialog";
import { OrderItem } from "./CounterOrderSystem";
import { CafeteriaMenuItem } from "./data/menuData";

interface ProductCardProps {
  product: CafeteriaMenuItem;
  onAddToOrder: (item: OrderItem) => void;
}

export function ProductCard({ product, onAddToOrder }: ProductCardProps) {
  const [isCustomizing, setIsCustomizing] = useState(false);
  
  const handleQuickAdd = () => {
    // Add product without customization
    const newItem: OrderItem = {
      id: `${product.id}-${Date.now()}`,
      name: product.name,
      price: product.price,
      quantity: 1,
      customizations: []
    };
    
    onAddToOrder(newItem);
  };
  
  const handleAddWithCustomizations = (customizations: Array<{name: string, option: string, price: number}>) => {
    const newItem: OrderItem = {
      id: `${product.id}-${Date.now()}`,
      name: product.name,
      price: product.price,
      quantity: 1,
      customizations
    };
    
    onAddToOrder(newItem);
    setIsCustomizing(false);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
            <p className="text-sm font-bold mt-2">${product.price.toFixed(2)}</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              className="bg-app-purple hover:bg-app-purple/90"
              onClick={handleQuickAdd}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
            
            {product.customizable && (
              <Dialog open={isCustomizing} onOpenChange={setIsCustomizing}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                  >
                    Customize
                  </Button>
                </DialogTrigger>
                <ProductCustomizationDialog
                  product={product}
                  onAddToOrder={handleAddWithCustomizations}
                />
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
