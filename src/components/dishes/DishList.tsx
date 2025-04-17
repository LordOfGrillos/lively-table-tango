
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { useDishContext } from "./context";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DishCreation } from "./DishCreation";

export function DishList() {
  const { dishes, menus, deleteDish } = useDishContext();
  const [editDishId, setEditDishId] = useState<string | null>(null);

  const handleDeleteDish = (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este platillo?")) {
      deleteDish(id);
    }
  };

  const getMenuName = (menuId: string | null) => {
    if (!menuId) return "Sin categoría";
    const menu = menus.find(m => m.id === menuId);
    return menu ? menu.name : "Sin categoría";
  };

  if (dishes.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">No hay platillos disponibles.</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Lista de Platillos</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Ingredientes</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dishes.map((dish) => (
              <TableRow key={dish.id}>
                <TableCell className="font-medium">{dish.name}</TableCell>
                <TableCell>${dish.price.toFixed(2)}</TableCell>
                <TableCell>{getMenuName(dish.menuId)}</TableCell>
                <TableCell>{dish.ingredients.length} ingredientes</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setEditDishId(dish.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteDish(dish.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editDishId} onOpenChange={() => setEditDishId(null)}>
        <DialogContent className="sm:max-w-[1000px] h-[85vh] max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar platillo</DialogTitle>
          </DialogHeader>
          <DishCreation />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
