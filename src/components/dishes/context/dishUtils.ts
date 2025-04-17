
import { Dish, Menu } from "../types";

export interface DishUtilsProps {
  dishes: Dish[];
  menus: Menu[];
}

export const createDishUtils = ({ dishes, menus }: DishUtilsProps) => {
  // Get a dish by ID
  const getDishById = (id: string) => {
    return dishes.find(dish => dish.id === id);
  };

  // Get a menu by ID
  const getMenuById = (id: string) => {
    return menus.find(menu => menu.id === id);
  };

  return {
    getDishById,
    getMenuById
  };
};
