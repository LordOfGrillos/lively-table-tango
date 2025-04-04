
import { useNavigate } from "react-router-dom";
import { ChevronDown, Home, ShoppingCart, Users, Clock, FileText, Settings, LayoutGrid, Package, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  hasSubmenu?: boolean;
  isSubmenuOpen?: boolean;
  onClick?: () => void;
  className?: string;
};

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active = false, 
  hasSubmenu = false, 
  isSubmenuOpen = false,
  onClick,
  className
}: SidebarItemProps) => {
  return (
    <div 
      className={cn(
        "flex items-center w-full px-4 py-3 text-sm font-medium rounded-md cursor-pointer",
        active ? "bg-app-light-purple text-app-purple" : "text-gray-700 hover:bg-gray-100",
        className
      )}
      onClick={onClick}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="flex-1">{label}</span>
      {hasSubmenu && (
        <ChevronDown className={cn("w-4 h-4 transition-transform", isSubmenuOpen && "transform rotate-180")} />
      )}
    </div>
  );
};

type SidebarSubmenuProps = {
  isOpen: boolean;
  items: {
    label: string;
    active?: boolean;
    onClick?: () => void;
  }[];
};

const SidebarSubmenu = ({ isOpen, items }: SidebarSubmenuProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="ml-7 space-y-1 mt-1 mb-1 animate-slide-up">
      {items.map((item, index) => (
        <div 
          key={index}
          className={cn(
            "py-2 px-4 text-sm rounded-md cursor-pointer",
            item.active ? "text-app-purple font-medium" : "text-gray-600 hover:text-gray-900"
          )}
          onClick={item.onClick}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export function Sidebar() {
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  
  return (
    <div className="w-64 border-r border-gray-200 h-screen flex flex-col p-4">
      <div className="mb-6 flex items-center space-x-2 px-4">
        <div className="h-8 w-8 rounded-full bg-app-purple flex items-center justify-center">
          <span className="text-white font-bold text-lg">P</span>
        </div>
        <h1 className="text-xl font-bold">PayPoint</h1>
      </div>

      <div className="px-2 py-2 mb-2 border border-gray-200 rounded-lg">
        <div className="flex items-center px-2">
          <div className="flex-1">
            <h3 className="text-sm font-medium">Restaurant Name</h3>
            <p className="text-xs text-gray-500">Inventory</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-1 flex-1 overflow-y-auto mt-4">
        <SidebarItem 
          icon={Home} 
          label="Dashboard" 
          active={pathname === '/'}
          onClick={() => navigate('/')}
        />
        <SidebarItem 
          icon={LayoutGrid} 
          label="Table Management"
          active={pathname === '/' && pathname.indexOf('/inventory') === -1 && pathname.indexOf('/staff') === -1}
          onClick={() => navigate('/')}
        />
        <SidebarItem 
          icon={ShoppingCart} 
          label="Cashier" 
          hasSubmenu 
          isSubmenuOpen={true}
        />
        <SidebarSubmenu 
          isOpen={true}
          items={[
            { label: "Add Order", active: true },
            { label: "Order List" },
            { label: "Transaction Completed" }
          ]}
        />
        <SidebarItem 
          icon={Package} 
          label="Inventory" 
          active={pathname === '/inventory'}
          onClick={() => navigate('/inventory')}
        />
        <SidebarItem 
          icon={UserCog} 
          label="Personal y Roles" 
          active={pathname === '/staff'}
          onClick={() => navigate('/staff')}
        />
        <SidebarItem icon={Users} label="Master Data" hasSubmenu />
        <SidebarItem icon={Clock} label="Sales Transaction" />
        <SidebarItem icon={FileText} label="Reports" />
        <SidebarItem icon={Settings} label="Settings" />
      </div>
    </div>
  );
}
