
import { useContext } from "react";
import { InventoryContext } from "../context/InventoryProvider";

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};
