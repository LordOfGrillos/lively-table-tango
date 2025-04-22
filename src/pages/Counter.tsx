
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { CounterOrderSystem } from "@/components/counter/CounterOrderSystem";
import { InventoryProvider } from "@/components/inventory/context";

export default function Counter() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Counter Order System" 
          subtitle="Take orders directly from the counter"
        />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <InventoryProvider>
              <CounterOrderSystem />
            </InventoryProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
