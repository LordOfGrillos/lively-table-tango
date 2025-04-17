
import { useContext } from "react";
import { DishContext } from "../context/DishProvider";

export const useDishContext = () => {
  const context = useContext(DishContext);
  
  if (context === undefined) {
    throw new Error("useDishContext must be used within a DishProvider");
  }
  
  return context;
};
