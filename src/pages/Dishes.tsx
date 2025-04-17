
import React from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { DishProvider } from "@/components/dishes/context/DishProvider";
import { DishesDashboard } from "@/components/dishes/DishesDashboard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { DishCreation } from "@/components/dishes/DishCreation";

export default function Dishes() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <DishProvider>
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header 
            title="Gestión de Platillos" 
            subtitle="Crea y administra tus platillos y menús"
            actionButton={
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-app-purple hover:bg-app-purple/90 shadow-md">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Crear Platillo
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[1000px] h-[85vh] max-h-screen overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Crear nuevo platillo</DialogTitle>
                  </DialogHeader>
                  <DishCreation />
                </DialogContent>
              </Dialog>
            }
          />
          
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
            <DishesDashboard />
          </div>
        </div>
      </DishProvider>
    </div>
  );
}
