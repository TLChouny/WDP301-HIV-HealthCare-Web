// NotificationContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  createNotification,
  getAllNotifications,
  getNotificationById,
  getNotificationsByUserId,
  updateNotificationById,
  deleteNotificationById,
} from '../api/notificationApi'; // Import API functions
import { Notification } from '../types/notification'; // Import type Notification

interface NotificationContextType {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  createNotificationHandler: (notificationData: Partial<Notification>) => Promise<void>;
  getAllNotificationsHandler: () => Promise<void>;
  getNotificationByIdHandler: (id: string) => Promise<void>;
  getNotificationsByUserIdHandler: (userId: string) => Promise<void>;
  updateNotificationByIdHandler: (id: string, notificationData: Partial<Notification>) => Promise<void>;
  deleteNotificationByIdHandler: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const createNotificationHandler = async (notificationData: Partial<Notification>) => {
    setLoading(true);
    try {
      const response = await createNotification(notificationData);
      if (response.data) {
        setNotifications((prev) => [...prev, response.data!]);
      } else if (response.message) {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to create notification');
    } finally {
      setLoading(false);
    }
  };

  const getAllNotificationsHandler = async () => {
    setLoading(true);
    try {
      const response = await getAllNotifications();
      if (response.data) {
        setNotifications(response.data);
      } else if (response.message) {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const getNotificationByIdHandler = async (id: string) => {
    setLoading(true);
    try {
      const response = await getNotificationById(id);
      if (response.data) {
        setNotifications((prev) =>
          prev.some((n) => n._id === response.data?._id)
            ? prev.map((n) => (n._id === response.data?._id ? response.data! : n))
            : [...prev, response.data!]
        );
      } else if (response.message) {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to fetch notification');
    } finally {
      setLoading(false);
    }
  };

  const getNotificationsByUserIdHandler = useCallback(
    async (userId: string) => {
      setLoading(true);
      try {
        const response = await getNotificationsByUserId(userId);
        setNotifications(response.data || []);
      } catch (err) {
        setError('Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateNotificationByIdHandler = async (id: string, notificationData: Partial<Notification>) => {
    setLoading(true);
    try {
      const response = await updateNotificationById(id, notificationData);
      if (response.data) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === response.data?._id ? response.data! : n))
        );
      } else if (response.message) {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to update notification');
    } finally {
      setLoading(false);
    }
  };

  const deleteNotificationByIdHandler = async (id: string) => {
    setLoading(true);
    try {
      const response = await deleteNotificationById(id);
      if (response.message) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      } else if (response.message) {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to delete notification');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("user")) {
        // Nếu đã có user trong localStorage, không gọi getAllNotificationsHandler
        return;
      }
    }
    getAllNotificationsHandler();
  }, []);

  const value = {
    notifications,
    loading,
    error,
    createNotificationHandler,
    getAllNotificationsHandler,
    getNotificationByIdHandler,
    getNotificationsByUserIdHandler,
    updateNotificationByIdHandler,
    deleteNotificationByIdHandler,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};