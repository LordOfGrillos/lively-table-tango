
import { useState } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { useInventory, InventoryItem } from "./InventoryContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

export function InventoryItemsList() {
  const { items } = useInventory();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filter items based on search query
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort items based on current sort settings
  const sortedItems = [...filteredItems].sort((a, b) => {
    let valueA: any = a[sortBy as keyof InventoryItem];
    let valueB: any = b[sortBy as keyof InventoryItem];

    // Handle special cases
    if (sortBy === "status") {
      const statusOrder = {
        "out-of-stock": 0,
        "low-stock": 1,
        "expired": 2,
        "in-stock": 3,
      };
      valueA = statusOrder[a.status as keyof typeof statusOrder];
      valueB = statusOrder[b.status as keyof typeof statusOrder];
    }

    if (valueA === undefined) return 0;
    if (valueB === undefined) return 0;

    // Compare values
    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortOrder === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else {
      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    }
  });

  // Toggle sort order and field
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Render status badge with appropriate color
  const renderStatusBadge = (status: string) => {
    const statusConfig = {
      "in-stock": { label: "In Stock", color: "bg-green-100 text-green-800" },
      "low-stock": { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" },
      "out-of-stock": { label: "Out of Stock", color: "bg-red-100 text-red-800" },
      "expired": { label: "Expired", color: "bg-gray-100 text-gray-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { 
      label: status, 
      color: "bg-gray-100 text-gray-800" 
    };

    return (
      <Badge className={`font-medium ${config.color}`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search inventory items..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Items Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <button
                    className="flex items-center gap-1 hover:text-app-purple"
                    onClick={() => toggleSort("name")}
                  >
                    Item Name
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center gap-1 hover:text-app-purple"
                    onClick={() => toggleSort("type")}
                  >
                    Type
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center gap-1 hover:text-app-purple"
                    onClick={() => toggleSort("category")}
                  >
                    Category
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    className="flex items-center gap-1 hover:text-app-purple ml-auto"
                    onClick={() => toggleSort("currentStock")}
                  >
                    Stock
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    className="flex items-center gap-1 hover:text-app-purple ml-auto"
                    onClick={() => toggleSort("cost")}
                  >
                    Cost
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center gap-1 hover:text-app-purple"
                    onClick={() => toggleSort("status")}
                  >
                    Status
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center gap-1 hover:text-app-purple"
                    onClick={() => toggleSort("lastRestocked")}
                  >
                    Last Restocked
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                    No inventory items found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              ) : (
                sortedItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="capitalize">{item.type}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right">
                      {item.currentStock} {item.unit}
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.cost.toFixed(2)}
                    </TableCell>
                    <TableCell>{renderStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      {item.lastRestocked
                        ? formatDistanceToNow(new Date(item.lastRestocked), {
                            addSuffix: true,
                          })
                        : "Never"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
