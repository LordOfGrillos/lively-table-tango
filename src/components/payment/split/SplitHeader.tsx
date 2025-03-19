
import { Button } from "@/components/ui/button";
import { Equal, List, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SplitHeaderProps {
  splitType: "equal" | "custom";
  numberOfCustomers: number;
  handleSplitTypeChange: (type: "equal" | "custom") => void;
  handleAddCustomer: () => void;
  handleRemoveCustomer: () => void;
}

export function SplitHeader({
  splitType,
  numberOfCustomers,
  handleSplitTypeChange,
  handleAddCustomer,
  handleRemoveCustomer
}: SplitHeaderProps) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Split the Bill</h3>
        <div className="flex items-center space-x-1">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleRemoveCustomer}
            disabled={numberOfCustomers <= 2}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="px-2">{numberOfCustomers}</span>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleAddCustomer}
            disabled={numberOfCustomers >= 8}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant={splitType === "equal" ? "default" : "outline"} 
          className={cn("flex-1", splitType === "equal" ? "bg-app-purple hover:bg-app-purple/90" : "")}
          onClick={() => handleSplitTypeChange("equal")}
        >
          <Equal className="mr-2 h-4 w-4" />
          Split Equally
        </Button>
        <Button 
          variant={splitType === "custom" ? "default" : "outline"} 
          className={cn("flex-1", splitType === "custom" ? "bg-app-purple hover:bg-app-purple/90" : "")}
          onClick={() => handleSplitTypeChange("custom")}
        >
          <List className="mr-2 h-4 w-4" />
          Split by Item
        </Button>
      </div>
    </div>
  );
}
