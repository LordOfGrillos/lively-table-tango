
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

// Types for our notifications
export type NotificationCategory = "inventory" | "order" | "system" | "staff";

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  category: NotificationCategory;
  actionUrl?: string;
}

// State type for our reducer
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

// Available actions for our reducer
type NotificationAction =
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "MARK_READ"; payload: string }
  | { type: "MARK_ALL_READ" }
  | { type: "DISMISS"; payload: string }
  | { type: "DISMISS_ALL" };

// Initial state
const initialState: NotificationState = {
  notifications: [
    {
      id: "1",
      title: "Inventory Alert",
      message: "Coffee beans are running low. Please restock soon.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      read: false,
      category: "inventory",
    },
    {
      id: "2",
      title: "New Order",
      message: "Table 5 has placed a new order. Please check the order tab.",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
      read: false,
      category: "order",
    },
    {
      id: "3",
      title: "System Update",
      message: "New system update available. Please restart the app when convenient.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true,
      category: "system",
    },
    {
      id: "4",
      title: "Staff Update",
      message: "Carlos has requested a schedule change for next week.",
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
      read: false,
      category: "staff",
    },
    {
      id: "5",
      title: "Inventory Alert",
      message: "Champagne stock is low. We recommend placing an order soon.",
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      read: false,
      category: "inventory",
    },
  ],
  unreadCount: 4, // Initial count of unread notifications
};

// Create context
const NotificationContext = createContext<{
  state: NotificationState;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  dismissAllNotifications: () => void;
}>({
  state: initialState,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  dismissNotification: () => {},
  dismissAllNotifications: () => {},
});

// Reducer function
const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    case "MARK_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
        unreadCount: state.unreadCount - 1 < 0 ? 0 : state.unreadCount - 1,
      };
    case "MARK_ALL_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) => ({
          ...notification,
          read: true,
        })),
        unreadCount: 0,
      };
    case "DISMISS":
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload
        ),
        unreadCount: state.notifications.find(n => n.id === action.payload && !n.read) 
          ? state.unreadCount - 1 
          : state.unreadCount,
      };
    case "DISMISS_ALL":
      return {
        ...state,
        notifications: [],
        unreadCount: 0,
      };
    default:
      return state;
  }
};

// Provider component
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    
    dispatch({ type: "ADD_NOTIFICATION", payload: newNotification });
    
    // Also show a toast for the new notification
    toast({
      title: notification.title,
      description: notification.message,
      variant: "default",
    });
  };

  const markAsRead = (id: string) => {
    dispatch({ type: "MARK_READ", payload: id });
  };

  const markAllAsRead = () => {
    dispatch({ type: "MARK_ALL_READ" });
  };

  const dismissNotification = (id: string) => {
    dispatch({ type: "DISMISS", payload: id });
  };

  const dismissAllNotifications = () => {
    dispatch({ type: "DISMISS_ALL" });
  };

  // Count unread notifications on mount and when notifications change
  useEffect(() => {
    const unreadCount = state.notifications.filter((n) => !n.read).length;
    if (unreadCount !== state.unreadCount) {
      dispatch({ 
        type: "ADD_NOTIFICATION", 
        payload: {
          ...state.notifications[0],
          id: Date.now().toString(),
          timestamp: new Date(),
          read: false
        } 
      });
    }
  }, [state.notifications]);

  return (
    <NotificationContext.Provider
      value={{
        state,
        addNotification,
        markAsRead,
        markAllAsRead,
        dismissNotification,
        dismissAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook for using the notification context
export const useNotifications = () => useContext(NotificationContext);
