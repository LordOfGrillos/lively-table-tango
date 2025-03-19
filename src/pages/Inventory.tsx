import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { InventoryDashboard } from "@/components/inventory/InventoryDashboard";
import { InventoryTabs } from "@/components/inventory/InventoryTabs";
import { InventoryProvider } from "@/components/inventory/InventoryContext";

export default function Inventory() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <InventoryProvider>
      <div className="flex flex-col h-screen">
        <Header 
          title="Inventory Management" 
          subtitle="Track, manage, and optimize your inventory"
        />
        
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          <InventoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="mt-4">
            {activeTab === "dashboard" && <InventoryDashboard />}
            {/* Other tabs content will be rendered based on activeTab */}
          </div>
        </div>
      </div>
    </InventoryProvider>
  );
}
