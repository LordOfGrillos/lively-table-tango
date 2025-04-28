
import { useState } from "react";
import { KitchenOrder } from "./types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, BellRing, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface OrderCardProps {
  order: KitchenOrder;
  onMarkInProgress: (orderId: string) => void;
  onMarkAsReady: (orderId: string) => void;
  onMarkAsDelivered: (orderId: string) => void;
  isOldest?: boolean;
}

export function OrderCard({ 
  order, 
  onMarkInProgress, 
  onMarkAsReady, 
  onMarkAsDelivered,
  isOldest = false
}: OrderCardProps) {
  // Si es la orden más antigua o si tiene prioridad alta, se expande automáticamente
  const [isExpanded, setIsExpanded] = useState(isOldest || order.priority === "rush" || order.priority === "high");
  
  const getStatusColor = (status: KitchenOrder['status']) => {
    switch (status) {
      case "waiting": return "bg-amber-500";
      case "in-progress": return "bg-blue-500";
      case "ready": return "bg-green-500";
      case "delivered": return "bg-gray-500";
    }
  };
  
  const getPriorityBadge = (priority: KitchenOrder['priority']) => {
    switch (priority) {
      case "rush":
        return <Badge className="bg-red-500 animate-pulse">RUSH</Badge>;
      case "high":
        return <Badge className="bg-orange-500">HIGH</Badge>;
      case "normal":
        return <Badge className="bg-green-500">Normal</Badge>;
    }
  };
  
  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  const getWaitingTime = () => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - order.createdAt.getTime()) / 60000);
    
    if (order.estimatedPrepTime && diffInMinutes > order.estimatedPrepTime) {
      return (
        <span className="text-red-500 font-bold flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {diffInMinutes} min ({diffInMinutes - order.estimatedPrepTime} min tarde)
        </span>
      );
    }
    
    return (
      <span className="text-gray-700 flex items-center">
        <Clock className="h-4 w-4 mr-1" />
        {diffInMinutes} min
      </span>
    );
  };
  
  // Resaltar la orden más antigua con un borde destacado
  const cardClasses = `border rounded-lg overflow-hidden transition-all duration-200 ${
    isOldest ? "border-red-500 border-4 shadow-lg" : 
    order.priority === "rush" ? "border-red-500 border-2" : 
    order.priority === "high" ? "border-orange-500" : "border-gray-200"
  }`;

  return (
    <div className={cardClasses}>
      <div 
        className="flex justify-between items-center p-3 cursor-pointer bg-gray-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></div>
          <span className="font-bold">Mesa #{order.tableNumber}</span>
          <span className="text-gray-500">#{order.orderNumber}</span>
          {getPriorityBadge(order.priority)}
        </div>
        
        <div className="flex items-center gap-2">
          {getWaitingTime()}
          {!isOldest && (
            <button 
              className="ml-2 text-gray-500"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? "▲" : "▼"}
            </button>
          )}
        </div>
      </div>
      
      {(isExpanded || isOldest) && (
        <div className="p-3 pt-0 border-t">
          <div className="text-sm text-gray-500 mb-2">
            Ordenado {formatTime(order.createdAt)}
          </div>
          
          <div className="space-y-2 mb-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <div>
                  <span className="font-medium">{item.quantity}x</span> {item.name}
                  {item.notes && <div className="text-sm text-gray-500">Nota: {item.notes}</div>}
                  {item.modifiers && item.modifiers.length > 0 && (
                    <div className="text-sm text-gray-500">
                      {item.modifiers.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-3 pt-2 border-t">
            {order.status === "waiting" && (
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600"
                onClick={() => onMarkInProgress(order.id)}
              >
                <Clock className="h-4 w-4 mr-2" />
                Comenzar Preparación
              </Button>
            )}
            
            {order.status === "in-progress" && (
              <Button 
                className="w-full bg-green-500 hover:bg-green-600"
                onClick={() => onMarkAsReady(order.id)}
              >
                <Check className="h-5 w-5 mr-2" />
                Marcar como Lista
              </Button>
            )}
            
            {order.status === "ready" && (
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => onMarkAsDelivered(order.id)}
              >
                <BellRing className="h-4 w-4 mr-2" />
                Alertar Mesero
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
