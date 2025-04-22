
import { useState } from "react";
import { 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";
import { CafeteriaMenuItem, CustomizationCategory } from "./data/menuData";

interface ProductCustomizationDialogProps {
  product: CafeteriaMenuItem;
  onAddToOrder: (customizations: Array<{name: string, option: string, price: number}>) => void;
}

export function ProductCustomizationDialog({ 
  product, 
  onAddToOrder 
}: ProductCustomizationDialogProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, {name: string, price: number}>>({});
  
  const handleRequiredOptionChange = (categoryName: string, optionName: string, price: number) => {
    setSelectedOptions({
      ...selectedOptions,
      [categoryName]: { name: optionName, price }
    });
  };
  
  const handleOptionalOptionChange = (categoryName: string, optionName: string, price: number, checked: boolean) => {
    if (checked) {
      setSelectedOptions({
        ...selectedOptions,
        [categoryName]: { name: optionName, price }
      });
    } else {
      const newOptions = { ...selectedOptions };
      delete newOptions[categoryName];
      setSelectedOptions(newOptions);
    }
  };
  
  const handleAddToOrder = () => {
    // Check if all required options are selected
    const requiredCategories = product.customizationOptions?.filter(cat => cat.required) || [];
    const allRequiredSelected = requiredCategories.every(cat => selectedOptions[cat.name]);
    
    if (!allRequiredSelected) {
      // Show error or handle missing required options
      return;
    }
    
    // Convert selectedOptions to array format needed for the order
    const customizations = Object.entries(selectedOptions).map(([name, option]) => ({
      name,
      option: option.name,
      price: option.price
    }));
    
    onAddToOrder(customizations);
  };
  
  // Calculate the total with customizations
  const calculateTotal = () => {
    const basePrice = product.price;
    const customizationPrice = Object.values(selectedOptions).reduce((sum, option) => sum + option.price, 0);
    return basePrice + customizationPrice;
  };
  
  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Customize {product.name}</DialogTitle>
      </DialogHeader>
      
      <ScrollArea className="max-h-[60vh] pr-4">
        <div className="space-y-6 py-2">
          {product.customizationOptions?.map((category, index) => (
            <div key={category.name}>
              <h3 className="text-sm font-medium mb-2">
                {category.name}
                {category.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </h3>
              
              {category.required ? (
                // Required options use RadioGroup (single selection)
                <RadioGroup 
                  value={selectedOptions[category.name]?.name || ""}
                  onValueChange={(value) => {
                    const option = category.options.find(opt => opt.name === value);
                    if (option) {
                      handleRequiredOptionChange(category.name, option.name, option.price);
                    }
                  }}
                >
                  <div className="grid grid-cols-1 gap-2">
                    {category.options.map(option => (
                      <div key={option.name} className="flex items-center justify-between border p-2 rounded-md">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem id={`${category.name}-${option.name}`} value={option.name} />
                          <Label htmlFor={`${category.name}-${option.name}`} className="cursor-pointer">
                            {option.name}
                          </Label>
                        </div>
                        {option.price > 0 && (
                          <span className="text-sm text-gray-600">+${option.price.toFixed(2)}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              ) : (
                // Optional options use Checkboxes (multiple selection allowed)
                <div className="grid grid-cols-1 gap-2">
                  {category.options.map(option => (
                    <div key={option.name} className="flex items-center justify-between border p-2 rounded-md">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`${category.name}-${option.name}`} 
                          checked={selectedOptions[category.name]?.name === option.name}
                          onCheckedChange={(checked) => 
                            handleOptionalOptionChange(
                              category.name, 
                              option.name, 
                              option.price, 
                              checked as boolean
                            )
                          }
                        />
                        <Label htmlFor={`${category.name}-${option.name}`} className="cursor-pointer">
                          {option.name}
                        </Label>
                      </div>
                      {option.price > 0 && (
                        <span className="text-sm text-gray-600">+${option.price.toFixed(2)}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {index < (product.customizationOptions?.length || 0) - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
          
          <Separator className="my-4" />
          
          <div className="flex justify-between text-lg font-medium">
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </ScrollArea>
      
      <DialogFooter>
        <Button 
          className="w-full bg-app-purple hover:bg-app-purple/90"
          onClick={handleAddToOrder}
        >
          <Check className="mr-2 h-4 w-4" />
          Add to Order
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
