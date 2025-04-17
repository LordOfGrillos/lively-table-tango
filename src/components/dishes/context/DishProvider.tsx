
import React, { createContext, useState, ReactNode } from "react";
import { Dish, Menu, DishContextType } from "../types";
import { mockDishes, mockMenus } from "../data/mockData";
import { useInventory } from "@/components/inventory/context";
import { createDishActions } from "./dishActions";
import { createMenuActions } from "./menuActions";
import { createDishUtils } from "./dishUtils";

// Create context
export const DishContext = createContext<DishContextType | undefined>(undefined);

// Provider component
export const DishProvider = ({ children }: { children: ReactNode }) => {
  const [dishes, setDishes] = useState<Dish[]>(mockDishes);
  const [menus, setMenus] = useState<Menu[]>(mockMenus);
  const { updateStock } = useInventory();

  // Initialize dish actions
  const dishActions = createDishActions({
    dishes,
    setDishes,
    menus,
    setMenus
  });

  // Initialize menu actions
  const menuActions = createMenuActions({
    menus,
    setMenus,
    setDishes
  });

  // Initialize utility functions
  const dishUtils = createDishUtils({
    dishes,
    menus
  });

  // Combine all context values
  const value: DishContextType = {
    dishes,
    menus,
    ...dishActions,
    ...menuActions,
    ...dishUtils
  };

  return <DishContext.Provider value={value}>{children}</DishContext.Provider>;
};
