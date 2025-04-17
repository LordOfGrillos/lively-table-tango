
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Menu as MenuIcon, Pizza } from "lucide-react";
import { useDishContext } from "./context";
import { DishList } from "./DishList";
import { MenuList } from "./MenuList";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateMenuDialog } from "./CreateMenuDialog";

export function DishesDashboard() {
  const { dishes, menus } = useDishContext();
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Pizza className="h-5 w-5 text-app-purple" />
              <h3 className="text-lg font-medium">Platillos</h3>
            </div>
            <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
              {dishes.length} platillos
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Administra tus platillos, agrega, edita o elimina según sea necesario.
          </p>
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-app-purple hover:bg-app-purple/90">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Agregar Platillo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[1000px] h-[85vh] max-h-screen overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Agregar nuevo platillo</DialogTitle>
                </DialogHeader>
                <DishCreation />
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MenuIcon className="h-5 w-5 text-app-purple" />
              <h3 className="text-lg font-medium">Categorías / Menús</h3>
            </div>
            <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
              {menus.length} categorías
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Organiza tus platillos en diferentes categorías o menús para facilitar su gestión.
          </p>
          <div className="flex justify-end">
            <Dialog open={showCreateMenu} onOpenChange={setShowCreateMenu}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Agregar Categoría
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear nueva categoría</DialogTitle>
                </DialogHeader>
                <CreateMenuDialog onClose={() => setShowCreateMenu(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <DishList />
        <MenuList />
      </div>
    </div>
  );
}
