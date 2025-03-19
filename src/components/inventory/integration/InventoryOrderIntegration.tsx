
import { useEffect } from "react";
import { useInventory } from "../InventoryContext";
import { MenuItemType } from "@/components/menu/MenuItem";
import { Order } from "@/components/tables/TableActionPanel";

interface InventoryOrderIntegrationProps {
  order: Order;
  menuItems: MenuItemType[];
}

export function InventoryOrderIntegration({ order, menuItems }: InventoryOrderIntegrationProps) {
  const { items, updateStock } = useInventory();
  
  useEffect(() => {
    // This function will be triggered whenever a new order is created
    // It finds menu items in the order, looks up their recipe ingredients,
    // and reduces inventory accordingly
    
    const processOrderItems = () => {
      order.items.forEach(orderItem => {
        // Find matching inventory items used in this menu item's recipe
        const inventoryItemsForRecipe = items.filter(inventoryItem => 
          inventoryItem.usedInRecipes.some(recipe => recipe.menuItemName === orderItem.name)
        );
        
        // For each inventory item used in this recipe, reduce stock based on quantity ordered
        inventoryItemsForRecipe.forEach(inventoryItem => {
          const recipeUsage = inventoryItem.usedInRecipes.find(
            recipe => recipe.menuItemName === orderItem.name
          );
          
          if (recipeUsage) {
            const totalUsage = recipeUsage.quantityUsed * orderItem.quantity;
            
            // Reduce inventory stock
            updateStock(
              inventoryItem.id,
              totalUsage,
              "reduce",
              `Used in Order #${order.id} - ${orderItem.name} x${orderItem.quantity}`
            );
          }
        });
      });
    };
    
    if (order.status === "new") {
      processOrderItems();
    }
  }, [order, items, updateStock]);
  
  // This is a utility component that doesn't render anything
  return null;
}
