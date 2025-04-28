
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegisterSettings } from "@/components/settings/RegisterSettings";
import { PrinterSettings } from "@/components/settings/PrinterSettings";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("registers");
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Configuración del Sistema" 
          subtitle="Administra cajas registradoras, impresoras y otras configuraciones"
        />
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center mb-4">
              <SettingsIcon className="h-6 w-6 mr-2 text-muted-foreground" />
              <h1 className="text-2xl font-semibold">Configuraciones</h1>
            </div>
            
            <Tabs
              defaultValue="registers"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-[400px] mb-4">
                <TabsTrigger value="registers">Cajas Registradoras</TabsTrigger>
                <TabsTrigger value="printers">Impresoras</TabsTrigger>
              </TabsList>
              
              <TabsContent value="registers" className="space-y-4">
                <RegisterSettings />
              </TabsContent>
              
              <TabsContent value="printers" className="space-y-4">
                <PrinterSettings />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
