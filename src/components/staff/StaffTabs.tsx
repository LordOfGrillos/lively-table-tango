
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StaffTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function StaffTabs({ activeTab, setActiveTab }: StaffTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="employees">Empleados</TabsTrigger>
        <TabsTrigger value="roles">Roles y Permisos</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
