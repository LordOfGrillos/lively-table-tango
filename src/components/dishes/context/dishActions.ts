
import { Dish, Menu } from "../types";
import { generateId } from "@/components/inventory/utils/inventoryHelpers";
import { toast } from "sonner";

export interface DishActionsProps {
  dishes: Dish[];
  setDishes: React.Dispatch<React.SetStateAction<Dish[]>>;
  menus: Menu[];
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
}

// Factory function to create dish actions
export const createDishActions = ({
  dishes,
  setDishes,
  menus,
  setMenus
}: DishActionsProps) => {
  // Add a new dish
  const addDish = (dishData: Omit<Dish, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date();
    const newDish: Dish = {
      ...dishData,
      id: generateId("dish"),
      createdAt: now,
      updatedAt: now,
    };
    
    setDishes(prev => [...prev, newDish]);
    
    // If the dish has a menu, update the menu's dishes array
    if (newDish.menuId) {
      setMenus(prev => prev.map(menu => {
        if (menu.id === newDish.menuId) {
          return {
            ...menu,
            dishes: [...menu.dishes, newDish.id],
            updatedAt: now
          };
        }
        return menu;
      }));
    }
    
    toast.success(`Platillo "${newDish.name}" creado con éxito`, {
      description: "Se ha agregado a tu menú"
    });
  };

  // Update an existing dish
  const updateDish = (id: string, updates: Partial<Dish>) => {
    const now = new Date();
    
    // If the menuId is being updated, we need to handle it specially
    const dish = dishes.find(d => d.id === id);
    const oldMenuId = dish?.menuId;
    const newMenuId = updates.menuId;
    
    setDishes(prev => prev.map(dish => {
      if (dish.id === id) {
        return {
          ...dish,
          ...updates,
          updatedAt: now
        };
      }
      return dish;
    }));
    
    // If the menu is changing, update both the old and new menus
    if (oldMenuId !== newMenuId && (oldMenuId || newMenuId)) {
      setMenus(prev => prev.map(menu => {
        // Remove from old menu
        if (menu.id === oldMenuId) {
          return {
            ...menu,
            dishes: menu.dishes.filter(dishId => dishId !== id),
            updatedAt: now
          };
        }
        // Add to new menu
        else if (menu.id === newMenuId) {
          return {
            ...menu,
            dishes: [...menu.dishes, id],
            updatedAt: now
          };
        }
        return menu;
      }));
    }
    
    toast.success(`Platillo actualizado`, {
      description: "Cambios guardados con éxito"
    });
  };

  // Delete a dish
  const deleteDish = (id: string) => {
    const dishToDelete = dishes.find(dish => dish.id === id);
    
    if (!dishToDelete) return;
    
    setDishes(prev => prev.filter(dish => dish.id !== id));
    
    // If the dish has a menu, update the menu's dishes array
    if (dishToDelete.menuId) {
      setMenus(prev => prev.map(menu => {
        if (menu.id === dishToDelete.menuId) {
          return {
            ...menu,
            dishes: menu.dishes.filter(dishId => dishId !== id),
            updatedAt: new Date()
          };
        }
        return menu;
      }));
    }
    
    toast.success(`Platillo "${dishToDelete.name}" eliminado`, {
      description: "Se ha eliminado de tu menú"
    });
  };

  return {
    addDish,
    updateDish,
    deleteDish
  };
};
