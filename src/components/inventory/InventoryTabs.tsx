import { Package, BarChart2, Clock, AlertTriangle, ShoppingBag, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInventory } from "./context";

interface InventoryTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface TabProps {
  id: string;
  label: string;
  icon: React.ElementType;
  count?: number;
  onClick: () => void;
  isActive: boolean;
  highlight?: boolean;
}

const Tab = ({ id, label, icon: Icon, count, onClick, isActive, highlight }: TabProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center justify-center md:justify-start gap-2 py-3 px-4 rounded-lg transition-colors",
      "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-app-purple focus:ring-opacity-50",
      isActive ? "bg-app-light-purple text-app-purple font-medium" : "text-gray-700",
      highlight && !isActive ? "border-2 border-app-purple text-app-purple" : ""
    )}
  >
    <Icon className={cn("h-5 w-5", highlight && !isActive ? "text-app-purple" : "")} />
    <span className="hidden md:inline">{label}</span>
    {count !== undefined && count > 0 && (
      <span className={cn(
        "ml-auto hidden md:flex items-center justify-center h-5 min-w-5 px-1 text-xs font-medium rounded-full",
        isActive ? "bg-app-purple text-white" : "bg-gray-200 text-gray-700"
      )}>
        {count}
      </span>
    )}
  </button>
);

export function InventoryTabs({ activeTab, setActiveTab }: InventoryTabsProps) {
  const { alerts } = useInventory();
  const unreadAlerts = alerts.filter(alert => !alert.isRead).length;

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart2 },
    { id: "inventory", label: "Inventory Items", icon: Package },
    { id: "alerts", label: "Alerts", icon: AlertTriangle, count: unreadAlerts },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "history", label: "History", icon: Clock },
    { id: "add", label: "Add New", icon: PlusCircle, highlight: true },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex overflow-x-auto md:flex-wrap scrollbar-hide">
        {tabs.map((tab) => (
          <div key={tab.id} className="flex-shrink-0 md:flex-shrink">
            <Tab
              id={tab.id}
              label={tab.label}
              icon={tab.icon}
              count={tab.count}
              onClick={() => setActiveTab(tab.id)}
              isActive={activeTab === tab.id}
              highlight={tab.highlight}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
