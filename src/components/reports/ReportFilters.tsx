
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { brands, channels, orderTypes, statuses } from "./data/mockData";

interface ReportFiltersProps {
  filters: {
    brands: string[];
    channels: string[];
    orderTypes: string[];
    statuses: string[];
  };
  setFilters: (filters: any) => void;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

export function ReportFilters({ filters, setFilters, isVisible, setIsVisible }: ReportFiltersProps) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>(filters.brands);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(filters.channels);
  const [selectedOrderTypes, setSelectedOrderTypes] = useState<string[]>(filters.orderTypes);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(filters.statuses);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleFilter = () => {
    setIsVisible(!isVisible);
  };

  const handleApplyFilters = () => {
    setFilters({
      brands: selectedBrands,
      channels: selectedChannels,
      orderTypes: selectedOrderTypes,
      statuses: selectedStatuses
    });
  };

  const handleClearFilters = () => {
    setSelectedBrands([]);
    setSelectedChannels([]);
    setSelectedOrderTypes([]);
    setSelectedStatuses([]);
    setSearchTerm("");
    setFilters({
      brands: [],
      channels: [],
      orderTypes: [],
      statuses: []
    });
  };

  const activeFiltersCount = 
    selectedBrands.length + 
    selectedChannels.length + 
    selectedOrderTypes.length + 
    selectedStatuses.length;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <Button
          variant="ghost"
          onClick={toggleFilter}
          className="text-purple-700 hover:text-purple-900 hover:bg-purple-50 pl-1"
        >
          <div className="flex items-center">
            Filtros
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 bg-purple-600 hover:bg-purple-700">
                {activeFiltersCount}
              </Badge>
            )}
            {isVisible ? (
              <ChevronUp className="ml-2 h-5 w-5" />
            ) : (
              <ChevronDown className="ml-2 h-5 w-5" />
            )}
          </div>
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleClearFilters}
            className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-900"
          >
            Limpiar Filtros
          </Button>
          <Button 
            size="sm" 
            onClick={handleApplyFilters}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Aplicar Filtros
          </Button>
        </div>
      </div>

      {isVisible && (
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-5 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Buscar</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por número o cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Marcas</h3>
              <div className="flex flex-wrap gap-2">
                <ToggleGroup 
                  type="multiple" 
                  value={selectedBrands}
                  onValueChange={setSelectedBrands}
                  className="justify-start flex-wrap"
                >
                  {brands.map((brand) => (
                    <ToggleGroupItem 
                      key={brand.id} 
                      value={brand.id}
                      className="border border-purple-200 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-900 rounded-full px-3 py-1 text-sm"
                    >
                      {brand.name}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Canales</h3>
              <div className="flex flex-wrap gap-2">
                <ToggleGroup 
                  type="multiple" 
                  value={selectedChannels}
                  onValueChange={setSelectedChannels}
                  className="justify-start flex-wrap"
                >
                  {channels.map((channel) => (
                    <ToggleGroupItem 
                      key={channel.id} 
                      value={channel.id}
                      className="border border-purple-200 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-900 rounded-full px-3 py-1 text-sm"
                    >
                      {channel.name}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Tipo de Orden</h3>
                <RadioGroup 
                  value={selectedOrderTypes[0] || ""} 
                  onValueChange={(value) => setSelectedOrderTypes([value])}
                  className="flex flex-wrap gap-4"
                >
                  {orderTypes.map((type) => (
                    <div className="flex items-center space-x-2" key={type.id}>
                      <RadioGroupItem value={type.id} id={`type-${type.id}`} />
                      <Label htmlFor={`type-${type.id}`} className="text-gray-700">{type.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Estatus</h3>
                <ToggleGroup 
                  type="multiple" 
                  value={selectedStatuses}
                  onValueChange={setSelectedStatuses}
                  className="justify-start flex-wrap gap-2"
                >
                  {statuses.map((status) => (
                    <ToggleGroupItem 
                      key={status.id} 
                      value={status.id}
                      className={`border rounded-full px-3 py-1 text-sm ${
                        status.color === 'green' 
                          ? 'border-green-200 data-[state=on]:bg-green-100 data-[state=on]:text-green-900' 
                          : status.color === 'red'
                            ? 'border-red-200 data-[state=on]:bg-red-100 data-[state=on]:text-red-900'
                            : status.color === 'yellow'
                              ? 'border-amber-200 data-[state=on]:bg-amber-100 data-[state=on]:text-amber-900'
                              : status.color === 'gray'
                                ? 'border-gray-200 data-[state=on]:bg-gray-100 data-[state=on]:text-gray-900'
                                : 'border-blue-200 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-900'
                      }`}
                    >
                      {status.name}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
