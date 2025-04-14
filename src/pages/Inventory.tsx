
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { InventoryDashboard } from "@/components/inventory/InventoryDashboard";
import { InventoryTabs } from "@/components/inventory/InventoryTabs";
import { InventoryProvider } from "@/components/inventory/context";
import { InventoryAddItem } from "@/components/inventory/InventoryAddItem";
import { InventoryItemsList } from "@/components/inventory/InventoryItemsList";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/Sidebar";

export default function Inventory() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Function to switch to add item tab
  const handleAddItem = () => {
    setActiveTab("add");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <InventoryProvider>
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header 
            title="Inventory Management" 
            subtitle="Track, manage, and optimize your inventory"
            actionButton={
              <Button 
                onClick={handleAddItem}
                className="bg-app-purple hover:bg-app-purple/90 shadow-md"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Add New Item
              </Button>
            }
          />
          
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
            <InventoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <div className="mt-4">
              {activeTab === "dashboard" && <InventoryDashboard onAddItem={handleAddItem} />}
              {activeTab === "inventory" && <InventoryItemsList />}
              {activeTab === "add" && <InventoryAddItem />}
              {/* Other tabs content will be rendered based on activeTab */}
            </div>
          </div>
        </div>
      </InventoryProvider>
    </div>
  );
}
