
import { useNavigate } from "react-router-dom";
import { useInventory } from "../InventoryContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Package, PlusCircle } from "lucide-react";

export function LowStockItems() {
  const { items, updateStock } = useInventory();
  const navigate = useNavigate();
  
  const lowStockItems = items
    .filter(item => item.status === "low-stock" || item.status === "out-of-stock")
    .sort((a, b) => {
      // Sort out-of-stock first, then by how far below minimum stock level
      if (a.status === "out-of-stock" && b.status !== "out-of-stock") return -1;
      if (a.status !== "out-of-stock" && b.status === "out-of-stock") return 1;
      
      const aPercentage = a.currentStock / a.minStockLevel;
      const bPercentage = b.currentStock / b.minStockLevel;
      return aPercentage - bPercentage;
    })
    .slice(0, 5);
  
  if (lowStockItems.length === 0) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-2">Low Stock Items</h3>
        <div className="py-8 text-center text-gray-500">
          <Package className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p>All items are above minimum stock levels.</p>
        </div>
      </Card>
    );
  }
  
  const handleRestock = (id: string, minStockLevel: number, currentStock: number) => {
    const restockAmount = minStockLevel - currentStock;
    updateStock(id, restockAmount, "add", "Restocked to minimum level");
  };
  
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Low Stock Items</h3>
        <Button variant="outline" size="sm" onClick={() => navigate('/inventory?tab=alerts')}>
          View All
        </Button>
      </div>
      
      <div className="space-y-3">
        {lowStockItems.map(item => (
          <div key={item.id} className="p-3 rounded-lg bg-gray-50 border">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {item.status === "out-of-stock" ? (
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  </div>
                )}
                <div>
                  <p className="font-medium">{item.name}</p>
                  <div className="flex items-center mt-1">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          item.status === "out-of-stock" 
                            ? "bg-red-500" 
                            : "bg-yellow-500"
                        }`}
                        style={{ width: `${Math.min(100, (item.currentStock / item.minStockLevel) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      {item.currentStock} / {item.minStockLevel} {item.unit}
                    </span>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => handleRestock(item.id, item.minStockLevel, item.currentStock)}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Restock
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
