
import React, { useState } from "react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Bell, Check, CheckCheck, Trash2, X } from "lucide-react";
import { useNotifications, NotificationCategory } from "@/context/NotificationContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// This maps categories to appropriate background colors and icons
const categoryConfig: Record<NotificationCategory, { bgColor: string; hoverColor: string }> = {
  inventory: { 
    bgColor: "bg-blue-50 border-blue-100", 
    hoverColor: "hover:bg-blue-100"
  },
  order: { 
    bgColor: "bg-green-50 border-green-100", 
    hoverColor: "hover:bg-green-100"
  },
  system: { 
    bgColor: "bg-purple-50 border-purple-100", 
    hoverColor: "hover:bg-purple-100"
  },
  staff: { 
    bgColor: "bg-amber-50 border-amber-100", 
    hoverColor: "hover:bg-amber-100"
  },
};

export function NotificationPanel() {
  const { state, markAsRead, markAllAsRead, dismissNotification, dismissAllNotifications } = useNotifications();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");

  const handleNotificationClick = (id: string, actionUrl?: string) => {
    markAsRead(id);
    
    if (actionUrl) {
      // Navigate to the action URL if provided
      window.location.href = actionUrl;
    }
  };

  const filteredNotifications = activeTab === "all" 
    ? state.notifications 
    : state.notifications.filter(n => n.category === activeTab);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5 text-gray-600" />
          {state.unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {state.unreadCount > 9 ? "9+" : state.unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[340px] md:w-[380px] p-0 shadow-lg"
        align="end"
        sideOffset={8}
      >
        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-medium">Notifications</h3>
          {state.unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs"
              onClick={markAllAsRead}
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1" />
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start px-3 pt-2 border-b border-gray-100 rounded-none bg-transparent">
            <TabsTrigger 
              value="all" 
              className="text-xs data-[state=active]:bg-gray-100 rounded-md"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="inventory" 
              className="text-xs data-[state=active]:bg-blue-100 rounded-md"
            >
              Inventory
            </TabsTrigger>
            <TabsTrigger 
              value="order" 
              className="text-xs data-[state=active]:bg-green-100 rounded-md"
            >
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="system" 
              className="text-xs data-[state=active]:bg-purple-100 rounded-md"
            >
              System
            </TabsTrigger>
            <TabsTrigger 
              value="staff" 
              className="text-xs data-[state=active]:bg-amber-100 rounded-md"
            >
              Staff
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0 focus-visible:outline-none">
            <ScrollArea className="h-[300px] max-h-[40vh]">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                  <div className="rounded-full bg-gray-100 p-3 mb-2">
                    <Bell className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No notifications to display</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={cn(
                        "p-3 relative transition-colors",
                        !notification.read && categoryConfig[notification.category].bgColor,
                        categoryConfig[notification.category].hoverColor
                      )}
                    >
                      <div 
                        className="cursor-pointer"
                        onClick={() => handleNotificationClick(notification.id, notification.actionUrl)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-sm font-medium",
                              !notification.read && "font-semibold"
                            )}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                          
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[10px] ml-2",
                              notification.category === "inventory" && "bg-blue-50 border-blue-200 text-blue-700",
                              notification.category === "order" && "bg-green-50 border-green-200 text-green-700",
                              notification.category === "system" && "bg-purple-50 border-purple-200 text-purple-700",
                              notification.category === "staff" && "bg-amber-50 border-amber-200 text-amber-700"
                            )}
                          >
                            {notification.category}
                          </Badge>
                        </div>
                        
                        <p className="text-sm mt-1 text-gray-700 line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                      
                      <div className="flex gap-1 mt-2 justify-end">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-6 text-[10px] px-2"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Mark as read
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-6 text-[10px] px-2 text-gray-500 hover:text-red-500"
                          onClick={() => dismissNotification(notification.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {state.notifications.length > 0 && (
          <div className="p-3 border-t border-gray-100 flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs text-gray-500 hover:text-red-500"
              onClick={dismissAllNotifications}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear all
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
