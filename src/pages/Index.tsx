
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { TableManager } from "@/components/tables/TableManager";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Index() {
  const [activeView, setActiveView] = useState<'tables' | 'order'>('tables');
  const [orderMode, setOrderMode] = useState(false);
  
  const handleCreateNewOrder = () => {
    setOrderMode(true);
  };
  
  const handleCancelOrder = () => {
    setOrderMode(false);
  };
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {orderMode ? (
          <>
            <Header 
              title="New Order" 
              actionButton={
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleCancelOrder}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              }
            />
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-5xl mx-auto">
                <Tabs defaultValue="table" className="w-full">
                  <TabsList className="flex w-full mb-8">
                    <TabsTrigger value="table" className="flex-1">
                      1. Choose a Table
                    </TabsTrigger>
                    <TabsTrigger value="customer" className="flex-1">
                      2. Choose a Customer
                    </TabsTrigger>
                    <TabsTrigger value="menu" className="flex-1">
                      3. Select Menu
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="table" className="bg-white p-6 rounded-lg border animate-fade-in">
                    <h2 className="text-lg font-medium mb-4">Select a Table</h2>
                    <p className="text-gray-500 mb-4">Select a table for the new order.</p>
                    
                    <div className="h-[450px] overflow-y-auto">
                      <TableManager />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="customer" className="bg-white p-6 rounded-lg border animate-fade-in">
                    <h2 className="text-lg font-medium mb-4">Select a Customer</h2>
                    <p className="text-gray-500">Customer selection will be implemented here.</p>
                  </TabsContent>
                  
                  <TabsContent value="menu" className="bg-white p-6 rounded-lg border animate-fade-in">
                    <h2 className="text-lg font-medium mb-4">Select Menu Items</h2>
                    <p className="text-gray-500">Menu selection will be implemented here.</p>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </>
        ) : (
          <>
            <Header 
              title="Table Management" 
              subtitle="Manage your restaurant tables"
              actionButton={
                <Button 
                  className="bg-app-purple hover:bg-app-purple/90 flex items-center gap-2"
                  onClick={handleCreateNewOrder}
                >
                  <Plus className="h-4 w-4" />
                  New Order
                </Button>
              }
            />
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-7xl mx-auto">
                <Tabs defaultValue="tables" className="w-full" onValueChange={(v) => setActiveView(v as 'tables' | 'order')}>
                  <TabsList className="w-full max-w-md mx-auto flex mb-8">
                    <TabsTrigger value="tables" className="flex-1">
                      Table View
                    </TabsTrigger>
                    <TabsTrigger value="order" className="flex-1">
                      Order View
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="tables" className="animate-fade-in outline-none">
                    <TableManager />
                  </TabsContent>
                  
                  <TabsContent value="order" className="animate-fade-in outline-none">
                    <div className="bg-white p-8 rounded-lg border text-center">
                      <h2 className="text-lg font-medium mb-2">Order View Coming Soon</h2>
                      <p className="text-gray-500">This section will display active orders by table.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
