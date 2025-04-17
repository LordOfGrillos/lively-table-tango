
import React, { createContext, useState, ReactNode } from "react";
import { toast } from "sonner";
import { Dish, Menu, DishContextType } from "../types";
import { mockDishes, mockMenus } from "../data/mockData";
import { generateId } from "@/components/inventory/utils/inventoryHelpers";
import { useInventory } from "@/components/inventory/context";

// Create context
export const DishContext = createContext<DishContextType | undefined>(undefined);

// Provider component
export const DishProvider = ({ children }: { children: ReactNode }) => {
  const [dishes, setDishes] = useState<Dish[]>(mockDishes);
  const [menus, setMenus] = useState<Menu[]>(mockMenus);
  const { updateStock } = useInventory();

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

  // Get a dish by ID
  const getDishById = (id: string) => {
    return dishes.find(dish => dish.id === id);
  };

  // Get a menu by ID
  const getMenuById = (id: string) => {
    return menus.find(menu => menu.id === id);
  };

  const value: DishContextType = {
    dishes,
    menus,
    addDish,
    updateDish,
    deleteDish,
    addMenu,
    updateMenu,
    deleteMenu,
    getDishById,
    getMenuById
  };

  return <DishContext.Provider value={value}>{children}</DishContext.Provider>;
};
