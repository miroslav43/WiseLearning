
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification } from '@/types/notification';
import { v4 as uuidv4 } from 'uuid';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  removeNotification: () => {},
  clearAllNotifications: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

// Mock notifications for testing
const mockNotifications: Notification[] = [
  {
    id: uuidv4(),
    title: 'Bun venit pe platforma BacExamen!',
    message: 'Îți mulțumim pentru înregistrare. Explorează cursurile disponibile.',
    read: false,
    type: 'info',
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: uuidv4(),
    title: 'Reducere la cursuri',
    message: 'Profită de 25% reducere la toate cursurile până pe 15 mai.',
    read: false,
    type: 'success',
    link: '/courses',
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: uuidv4(),
    title: 'Curs nou disponibil',
    message: 'Un nou curs de matematică a fost adăugat. Verifică acum!',
    read: true,
    type: 'info',
    link: '/courses',
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
  },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Load notifications from localStorage on initial render
  useEffect(() => {
    const savedNotifications = localStorage.getItem('bacNotifications');
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        // Convert string dates back to Date objects
        const formattedNotifications = parsedNotifications.map((notification: any) => ({
          ...notification,
          createdAt: new Date(notification.createdAt)
        }));
        setNotifications(formattedNotifications);
      } catch (error) {
        console.error('Failed to parse notifications from localStorage:', error);
        setNotifications(mockNotifications);
      }
    } else {
      // Use mock notifications if none are saved
      setNotifications(mockNotifications);
    }
  }, []);

  // Calculate unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
    
    // Save notifications to localStorage
    localStorage.setItem('bacNotifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      read: false,
      createdAt: new Date(),
    };

    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
