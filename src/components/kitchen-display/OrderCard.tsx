
import { useState } from "react";
import { KitchenOrder, KitchenOrderItem } from "./types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, BellRing, Check, ChefHat, ChevronsUp, ChevronsDown, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [showingRecipe, setShowingRecipe] = useState<string | null>(null);
  
  const getStatusColor = (status: KitchenOrder['status']) => {
    switch (status) {
      case "waiting": return "bg-amber-500";
      case "in-progress": return "bg-blue-500";
      case "ready": return "bg-green-500";
      case "delivered": return "bg-gray-500";
    }
  };
  
  const getStatusText = (status: KitchenOrder['status']) => {
    switch (status) {
      case "waiting": return "Esperando";
      case "in-progress": return "En preparación";
      case "ready": return "Listo";
      case "delivered": return "Entregado";
    }
  };
  
  const getPriorityBadge = (priority: KitchenOrder['priority']) => {
    switch (priority) {
      case "rush":
        return <Badge className="bg-red-500 animate-pulse text-white font-bold">URGENTE</Badge>;
      case "high":
        return <Badge className="bg-orange-500 text-white">ALTA</Badge>;
      case "normal":
        return <Badge className="bg-green-500 text-white">Normal</Badge>;
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
        <span className="text-red-500 font-bold flex items-center text-base">
          <Clock className="h-5 w-5 mr-2" />
          {diffInMinutes} min ({diffInMinutes - order.estimatedPrepTime} min tarde)
        </span>
      );
    }
    
    return (
      <span className="text-gray-700 flex items-center text-base">
        <Clock className="h-5 w-5 mr-2" />
        {diffInMinutes} min
      </span>
    );
  };

  const toggleRecipe = (itemId: string) => {
    if (showingRecipe === itemId) {
      setShowingRecipe(null);
    } else {
      setShowingRecipe(itemId);
    }
  };
  
  // Elegir la clase CSS para la tarjeta basada en prioridad y si es la más antigua
  const borderClass = isOldest 
    ? "border-red-500 border-4 shadow-lg" 
    : order.priority === "rush" 
      ? "border-red-500 border-2" 
      : order.priority === "high" 
        ? "border-orange-500 border-2" 
        : "border-gray-200";

  return (
    <Card className={`overflow-hidden transition-all duration-200 ${borderClass}`}>
      <CardHeader 
        className={`p-3 cursor-pointer flex flex-row justify-between items-center ${
          isOldest ? "bg-red-50" : 
          order.priority === "rush" ? "bg-red-50" : 
          order.priority === "high" ? "bg-orange-50" : 
          "bg-gray-50"
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full ${getStatusColor(order.status)}`}></div>
          <span className="font-bold text-lg">Mesa #{order.tableNumber}</span>
          <span className="text-gray-500 text-base">#{order.orderNumber}</span>
          {getPriorityBadge(order.priority)}
        </div>
        
        <div className="flex items-center gap-3">
          {getWaitingTime()}
          <button 
            className="text-gray-500 hover:text-gray-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronsUp className="h-5 w-5" /> : <ChevronsDown className="h-5 w-5" />}
          </button>
        </div>
      </CardHeader>
      
      {(isExpanded || isOldest) && (
        <CardContent className="p-4">
          <div className="text-sm text-gray-500 mb-3 flex justify-between items-center">
            <div>
              <span className="font-medium">Ordenado:</span> {formatTime(order.createdAt)}
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${getStatusColor(order.status)}`}></span>
              {getStatusText(order.status)}
            </Badge>
          </div>
          
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="font-semibold text-lg flex items-center">
                      <span className="bg-gray-100 px-2 py-1 rounded-md mr-2 text-gray-700">
                        {item.quantity}x
                      </span>
                      {item.name}
                    </div>
                    {item.notes && 
                      <div className="text-sm text-gray-600 mt-1 ml-2 italic">
                        Nota: {item.notes}
                      </div>
                    }
                    {item.modifiers && item.modifiers.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1 ml-2">
                        {item.modifiers.map((mod, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {mod}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {item.recipe && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      onClick={() => toggleRecipe(item.id)}
                    >
                      <ChefHat className="h-4 w-4" />
                      {showingRecipe === item.id ? "Ocultar receta" : "Ver receta"}
                    </Button>
                  )}
                </div>
                
                {showingRecipe === item.id && item.recipe && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-1" />
                      Receta para {item.name}
                    </h4>
                    <div className="space-y-1">
                      <h5 className="font-medium text-sm text-blue-700">Ingredientes:</h5>
                      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                        {item.recipe.ingredients.map((ing, idx) => (
                          <li key={idx}>
                            <span className="font-medium">{ing.name}</span>: {ing.quantity} {ing.unit}
                          </li>
                        ))}
                      </ul>
                      
                      {item.recipe.instructions && (
                        <>
                          <h5 className="font-medium text-sm text-blue-700 mt-2">Instrucciones:</h5>
                          <p className="text-sm text-gray-700">{item.recipe.instructions}</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <CardFooter className="flex justify-center mt-4 pt-3 px-0 border-t">
            {order.status === "waiting" && (
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 text-base"
                onClick={() => onMarkInProgress(order.id)}
              >
                <Clock className="h-5 w-5 mr-2" />
                Comenzar Preparación
              </Button>
            )}
            
            {order.status === "in-progress" && (
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 text-base"
                onClick={() => onMarkAsReady(order.id)}
              >
                <Check className="h-5 w-5 mr-2" />
                Marcar como Lista
              </Button>
            )}
            
            {order.status === "ready" && (
              <Button 
                variant="outline"
                className="w-full border-blue-300 hover:bg-blue-50 text-blue-700 font-medium py-2 text-base"
                onClick={() => onMarkAsDelivered(order.id)}
              >
                <BellRing className="h-5 w-5 mr-2" />
                Alertar Mesero
              </Button>
            )}
          </CardFooter>
        </CardContent>
      )}
    </Card>
  );
}
