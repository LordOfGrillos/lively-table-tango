
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { useDishContext } from "./context";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateMenuDialog } from "./CreateMenuDialog";

export function MenuList() {
  const { menus, dishes, deleteMenu } = useDishContext();
  const [editMenuId, setEditMenuId] = useState<string | null>(null);
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());

  const handleDeleteMenu = (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      deleteMenu(id);
    }
  };

  const toggleMenu = (id: string) => {
    const newOpenMenus = new Set(openMenus);
    if (newOpenMenus.has(id)) {
      newOpenMenus.delete(id);
    } else {
      newOpenMenus.add(id);
    }
    setOpenMenus(newOpenMenus);
  };

  const getDishesForMenu = (menuId: string) => {
    return dishes.filter(dish => dish.menuId === menuId);
  };

  if (menus.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">No hay categorías disponibles.</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Categorías / Menús</h3>
      <div className="space-y-4">
        {menus.map((menu) => {
          const menuDishes = getDishesForMenu(menu.id);
          const isOpen = openMenus.has(menu.id);
          
          return (
            <Collapsible
              key={menu.id}
              open={isOpen}
              onOpenChange={() => toggleMenu(menu.id)}
              className="border rounded-md"
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 mr-2">
                      <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <div>
                    <h4 className="font-medium">{menu.name}</h4>
                    <p className="text-sm text-gray-500">{menu.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {menuDishes.length} platillos
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setEditMenuId(menu.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteMenu(menu.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <CollapsibleContent>
                <div className="px-4 pb-4 pt-0">
                  {menuDishes.length > 0 ? (
                    <ul className="space-y-2">
                      {menuDishes.map(dish => (
                        <li key={dish.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">{dish.name}</span>
                          <span>${dish.price.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-2">
                      No hay platillos en esta categoría.
                    </p>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>

      <Dialog open={!!editMenuId} onOpenChange={() => setEditMenuId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar categoría</DialogTitle>
          </DialogHeader>
          <CreateMenuDialog menuId={editMenuId || undefined} onClose={() => setEditMenuId(null)} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
