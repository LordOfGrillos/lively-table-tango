
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Order } from "./types";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface OrdersTableProps {
  orders: Order[];
  onSelectOrder: (orderId: string) => void;
}

export function OrdersTable({ orders, onSelectOrder }: OrdersTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Order | null; direction: "asc" | "desc" }>({
    key: null,
    direction: "asc"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Handle search
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.tableId && order.tableId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle sort
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue === bValue) return 0;
    
    // Handle different types of data
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortConfig.direction === "asc" 
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }
    
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc" 
        ? aValue - bValue
        : bValue - aValue;
    }

    return 0;
  });

  // Handle pagination
  const pageCount = Math.ceil(sortedOrders.length / itemsPerPage);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key: keyof Order) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const renderSortIndicator = (key: keyof Order) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  // Status badge styling
  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "paid":
      case "finalizada":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
      case "voided":
      case "rechazada":
      case "anulada":
      case "cancelada":
        return "bg-red-100 text-red-800 border-red-200";
      case "accepted":
      case "open":
      case "created":
      case "abierta":
      case "creada":
      case "aceptada":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "denied":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar órdenes..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="pl-9 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
          />
        </div>
        <div className="text-sm text-gray-500">
          Mostrando {paginatedOrders.length} de {filteredOrders.length} órdenes
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-purple-50">
              <TableRow>
                <TableHead 
                  className="font-semibold cursor-pointer hover:bg-purple-100 transition-colors"
                  onClick={() => requestSort("id")}
                >
                  <div className="flex items-center">
                    ID {renderSortIndicator("id")}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold cursor-pointer hover:bg-purple-100 transition-colors"
                  onClick={() => requestSort("customerName")}
                >
                  <div className="flex items-center">
                    Cliente {renderSortIndicator("customerName")}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold cursor-pointer hover:bg-purple-100 transition-colors"
                  onClick={() => requestSort("createdAt")}
                >
                  <div className="flex items-center">
                    Fecha {renderSortIndicator("createdAt")}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold cursor-pointer hover:bg-purple-100 transition-colors"
                  onClick={() => requestSort("total")}
                >
                  <div className="flex items-center">
                    Monto {renderSortIndicator("total")}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold cursor-pointer hover:bg-purple-100 transition-colors"
                  onClick={() => requestSort("status")}
                >
                  <div className="flex items-center">
                    Estado {renderSortIndicator("status")}
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <TableRow 
                    key={order.id} 
                    className="hover:bg-purple-50 cursor-pointer"
                    onClick={() => onSelectOrder(order.id)}
                  >
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customerName || "-"}</TableCell>
                    <TableCell>
                      {order.createdAt.toLocaleDateString("es-MX", {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(order.total)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getStatusBadgeStyle(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOrder(order.id);
                        }}
                        className="text-purple-700 hover:text-purple-800 hover:bg-purple-100"
                      >
                        Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    {searchTerm ? "No se encontraron órdenes con esos criterios" : "No hay órdenes disponibles"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex justify-center mt-4">
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              Anterior
            </Button>
            
            {[...Array(pageCount)].map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(i + 1)}
                className={
                  currentPage === i + 1 
                    ? "bg-purple-600 hover:bg-purple-700" 
                    : "border-purple-200 text-purple-700 hover:bg-purple-50"
                }
              >
                {i + 1}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
              disabled={currentPage === pageCount}
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
