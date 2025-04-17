
import { useInventory } from "../context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, Clock, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function InventoryAlerts() {
  const { alerts, markAlertAsRead } = useInventory();
  const navigate = useNavigate();
  
  const unreadAlerts = alerts
    .filter(alert => !alert.isRead)
    .sort((a, b) => {
      // Sort by severity first
      if (a.severity === "high" && b.severity !== "high") return -1;
      if (a.severity !== "high" && b.severity === "high") return 1;
      
      // Then by date
      return b.date.getTime() - a.date.getTime();
    })
    .slice(0, 5);
  
  if (unreadAlerts.length === 0) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-2">Alerts</h3>
        <div className="py-6 text-center text-gray-500">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <p>No active alerts at this time.</p>
        </div>
      </Card>
    );
  }
  
  const getAlertIcon = (type: string, severity: string) => {
    switch (type) {
      case "low-stock":
      case "out-of-stock":
        return (
          <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
            severity === "high" ? "bg-red-100" : "bg-yellow-100"
          }`}>
            <AlertTriangle className={`h-4 w-4 ${
              severity === "high" ? "text-red-600" : "text-yellow-600"
            }`} />
          </div>
        );
      case "expiry":
        return (
          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
            <Clock className="h-4 w-4 text-red-600" />
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
            <AlertTriangle className="h-4 w-4 text-gray-600" />
          </div>
        );
    }
  };
  
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Alerts</h3>
        <Button variant="outline" size="sm" onClick={() => navigate('/inventory?tab=alerts')}>
          View All
        </Button>
      </div>
      
      <div className="space-y-3">
        {unreadAlerts.map(alert => (
          <div key={alert.id} className={`p-3 rounded-lg border ${
            alert.severity === "high" 
              ? "bg-red-50 border-red-100" 
              : alert.severity === "medium"
                ? "bg-yellow-50 border-yellow-100"
                : "bg-gray-50 border-gray-100"
          }`}>
            <div className="flex items-start">
              {getAlertIcon(alert.type, alert.severity)}
              
              <div className="flex-1 min-w-0">
                <p className="font-medium">{alert.itemName}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{alert.message}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(alert.date, { addSuffix: true })}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-7 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => markAlertAsRead(alert.id)}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Mark as read
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
