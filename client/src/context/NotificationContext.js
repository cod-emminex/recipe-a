// client/src/context/NotificationContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { userAPI } from "../services/api";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotifications();
      initializeWebSocket();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await userAPI.getNotifications();
      setNotifications(response.data);
      updateUnreadCount(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const updateUnreadCount = (notifs) => {
    const unread = notifs.filter((n) => !n.read).length;
    setUnreadCount(unread);
  };

  const markAsRead = async (notificationId) => {
    try {
      await userAPI.markNotificationAsRead(notificationId);
      setNotifications(
        notifications.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const initializeWebSocket = () => {
    const ws = new WebSocket(process.env.REACT_APP_WS_URL);

    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    return () => ws.close();
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
