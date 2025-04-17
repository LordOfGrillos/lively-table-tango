
import { Menu } from "../types";
import { generateId } from "@/components/inventory/utils/inventoryHelpers";
import { toast } from "sonner";

export interface MenuActionsProps {
  menus: Menu[];
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
  setDishes: React.Dispatch<React.SetStateAction<any[]>>;
}

// Factory function to create menu actions
export const createMenuActions = ({
  menus,
  setMenus,
  setDishes
}: MenuActionsProps) => {
  // Add a new menu category
  const addMenu = (menuData: Omit<Menu, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date();
    const newMenu: Menu = {
      ...menuData,
      id: generateId("menu"),
      createdAt: now,
      updatedAt: now,
    };
    
    setMenus(prev => [...prev, newMenu]);
    
    toast.success(`Categoría "${newMenu.name}" creada con éxito`, {
      description: "Se ha agregado a tu menú"
    });
  };

  // Update an existing menu
  const updateMenu = (id: string, updates: Partial<Menu>) => {
    setMenus(prev => prev.map(menu => {
      if (menu.id === id) {
        return {
          ...menu,
          ...updates,
          updatedAt: new Date()
        };
      }
      return menu;
    }));
    
    toast.success(`Categoría actualizada`, {
      description: "Cambios guardados con éxito"
    });
  };

  // Delete a menu
  const deleteMenu = (id: string) => {
    const menuToDelete = menus.find(menu => menu.id === id);
    
    if (!menuToDelete) return;
    
    // First, update all dishes that belong to this menu
    setDishes(prev => prev.map(dish => {
      if (dish.menuId === id) {
        return {
          ...dish,
          menuId: null,
          updatedAt: new Date()
        };
      }
      return dish;
    }));
    
    // Then delete the menu
    setMenus(prev => prev.filter(menu => menu.id !== id));
    
    toast.success(`Categoría "${menuToDelete.name}" eliminada`, {
      description: "Los platillos asociados ya no tienen categoría"
    });
  };

  return {
    addMenu,
    updateMenu,
    deleteMenu
  };
};
