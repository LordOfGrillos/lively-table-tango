
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCog, ShieldCheck } from "lucide-react";

interface StaffTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function StaffTabs({ activeTab, setActiveTab }: StaffTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="employees" className="flex items-center justify-center gap-2">
          <UserCog className="h-4 w-4" />
          <span>Empleados</span>
        </TabsTrigger>
        <TabsTrigger value="roles" className="flex items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          <span>Roles y Permisos</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
