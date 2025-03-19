
import { MenuItemType, ItemCustomization } from "@/components/menu/MenuItem";
import { OrderItem } from "../../TableActionPanel";

export const calculateItemPrice = (item: MenuItemType, customizations?: ItemCustomization): number => {
  let itemPrice = item.price;
  
  if (customizations?.extras && customizations.extras.length > 0) {
    const extrasCost = customizations.extras.reduce((total, extra) => total + extra.price, 0);
    itemPrice += extrasCost;
  }
  
  return itemPrice;
};

export const findExistingItemIndex = (currentOrder: OrderItem[], item: MenuItemType, customizations?: ItemCustomization): number => {
  return currentOrder.findIndex(orderItem => {
    if (orderItem.id !== item.id) return false;
    
    if (!orderItem.customizations && !customizations) return true;
    
    if (!orderItem.customizations || !customizations) return false;
    
    const removedIngredientsMatch = 
      orderItem.customizations.removedIngredients.length === customizations.removedIngredients.length &&
      orderItem.customizations.removedIngredients.every(ing => 
        customizations.removedIngredients.includes(ing)
      );
      
    const extrasMatch = 
      orderItem.customizations.extras.length === customizations.extras.length &&
      orderItem.customizations.extras.every(extra => 
        customizations.extras.some(e => e.name === extra.name && e.price === extra.price)
      );
      
    return removedIngredientsMatch && extrasMatch;
  });
};

export const createCustomizationSummary = (customizations?: ItemCustomization): string => {
  if (!customizations) return '';
  
  return `(${customizations.removedIngredients.length > 0 ? 'Removed items, ' : ''}${customizations.extras.length > 0 ? 'Added extras' : ''})`;
};

export const calculateOrderTotal = (orderItems: OrderItem[]): number => {
  return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
};
