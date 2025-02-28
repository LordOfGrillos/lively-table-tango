
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableStatus } from "@/components/tables/TableShape";

type TableFilterOption = {
  label: string;
  value: TableStatus;
  color: string;
};

const filterOptions: TableFilterOption[] = [
  { label: "Available", value: "available", color: "bg-table-available" },
  { label: "Reserved", value: "reserved", color: "bg-table-reserved" },
  { label: "Filled", value: "filled", color: "bg-table-filled" },
  { label: "Occupied", value: "occupied", color: "bg-table-occupied" }
];

type TableFilterBarProps = {
  selectedFilters: TableStatus[];
  onFilterChange: (filters: TableStatus[]) => void;
  onSearch: (query: string) => void;
};

export function TableFilterBar({ 
  selectedFilters, 
  onFilterChange, 
  onSearch 
}: TableFilterBarProps) {
  const toggleFilter = (status: TableStatus) => {
    if (selectedFilters.includes(status)) {
      onFilterChange(selectedFilters.filter(s => s !== status));
    } else {
      onFilterChange([...selectedFilters, status]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            variant="outline"
            className={`
              flex items-center gap-2 border rounded-full px-4 py-1 h-auto transition-all
              ${selectedFilters.includes(option.value) ? 'bg-gray-100 border-gray-300' : 'bg-white'}
            `}
            onClick={() => toggleFilter(option.value)}
          >
            <span className={`h-3 w-3 rounded-full ${option.color}`} />
            <span className="text-sm">{option.label}</span>
          </Button>
        ))}
      </div>
      
      <div className="relative w-full lg:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search tables..."
          className="pl-10 pr-4 py-2 rounded-full"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
