import { AlertTriangle, TrendingDown, TrendingUp, Package, DollarSign, Clock } from "lucide-react";
import { useInventory } from "./InventoryContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { LowStockItems } from "./dashboard/LowStockItems";
import { InventoryValueChart } from "./dashboard/InventoryValueChart";
import { RecentTransactions } from "./dashboard/RecentTransactions";
import { InventoryAlerts } from "./dashboard/InventoryAlerts";
import { CategoryBreakdown } from "./dashboard/CategoryBreakdown";
import { EmptyInventory } from "./EmptyInventory";

export function InventoryDashboard({ onAddItem }: { onAddItem: () => void }) {
  const { items, alerts, transactions } = useInventory();
  
  // Show empty state if no items
  if (items.length === 0) {
    return <EmptyInventory onAddItem={onAddItem} />;
  }
  
  // Calculate stats
  const totalItems = items.length;
  const lowStockItems = items.filter(item => item.status === "low-stock").length;
  const outOfStockItems = items.filter(item => item.status === "out-of-stock").length;
  const unreadAlerts = alerts.filter(alert => !alert.isRead).length;
  
  // Calculate inventory value
  const inventoryValue = items.reduce((total, item) => {
    return total + (item.currentStock * item.cost);
  }, 0);
  
  // Get recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);
  
  // Calculate recent changes
  const lastWeekTransactions = transactions.filter(tx => 
    tx.date.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
  );
  
  const additions = lastWeekTransactions
    .filter(tx => tx.type === "addition")
    .reduce((sum, tx) => sum + tx.quantity, 0);
    
  const reductions = lastWeekTransactions
    .filter(tx => tx.type === "reduction" || tx.type === "order-usage")
    .reduce((sum, tx) => sum + tx.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Inventory Items"
          value={totalItems.toString()}
          icon={Package}
          color="blue"
        />
        <StatsCard 
          title="Inventory Value"
          value={`$${inventoryValue.toFixed(2)}`}
          icon={DollarSign}
          color="green"
        />
        <StatsCard 
          title="Low/Out Stock Items"
          value={`${lowStockItems + outOfStockItems}`}
          icon={AlertTriangle}
          color="red"
          subtitle={`${lowStockItems} Low, ${outOfStockItems} Out`}
        />
        <StatsCard 
          title="Unread Alerts"
          value={unreadAlerts.toString()}
          icon={Clock}
          color="yellow"
          subtitle={unreadAlerts > 0 ? "Needs attention" : "All clear"}
        />
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Inventory Movement */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Inventory Movement</h3>
              <span className="text-sm text-gray-500">Last 7 days</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Additions</p>
                  <p className="text-xl font-semibold">{additions.toFixed(0)} units</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reductions</p>
                  <p className="text-xl font-semibold">{reductions.toFixed(0)} units</p>
                </div>
              </div>
            </div>
            
            <InventoryValueChart className="mt-4 h-64" />
          </Card>
          
          {/* Low Stock Items */}
          <LowStockItems />
          
          {/* Recent Transactions */}
          <RecentTransactions transactions={recentTransactions} />
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Alerts */}
          <InventoryAlerts />
          
          {/* Category Breakdown */}
          <CategoryBreakdown />
        </div>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: "blue" | "green" | "red" | "yellow" | "purple";
  subtitle?: string;
}

function StatsCard({ title, value, icon: Icon, color, subtitle }: StatsCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-app-light-purple text-app-purple",
  };
  
  return (
    <Card className="p-4">
      <div className="flex items-center">
        <div className={`h-10 w-10 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </Card>
  );
}
