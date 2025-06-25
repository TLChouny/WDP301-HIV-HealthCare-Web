// notificationApi.ts

import { Notification } from '../types/notification'; // Import type Notification
import { API_ENDPOINTS, BASE_URL } from '../constants/api'; // Import BASE_URL và API_ENDPOINTS

// Interface cho phản hồi API
interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: number | string;
}

// Hàm tạo mới Notification
export const createNotification = async (notificationData: Partial<Notification>): Promise<ApiResponse<Notification>> => {
  try {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.NOTIFICATIONS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationData),
    });

    if (!response.ok) throw new Error('Failed to create notification');

    const data = await response.json();
    return { data };
  } catch (error) {
    return { message: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Hàm lấy tất cả Notification
// export const getAllNotifications = async (): Promise<ApiResponse<Notification[]>> => {
//   try {
//     const response = await fetch(`${BASE_URL}${API_ENDPOINTS.NOTIFICATIONS}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) throw new Error('Failed to fetch notifications');

//     const data = await response.json();
//     return { data };
//   } catch (error) {
//     return { message: error instanceof Error ? error.message : 'Unknown error' };
//   }
// };

// Hàm lấy Notification theo User ID
export const getNotificationsByUserId = async (userId: string): Promise<ApiResponse<Notification[]>> => {
  try {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.NOTIFICATIONS_BY_USER_ID(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch notifications by user ID');

    const data = await response.json();
    return { data };
  } catch (error) {
    return { message: error instanceof Error ? error.message : 'Unknown error' };
  }
};
// Hàm lấy Notification theo ID
export const getNotificationById = async (id: string): Promise<ApiResponse<Notification>> => {
  try {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.NOTIFICATION_BY_ID(id)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 404) throw new Error('Notification not found');
      throw new Error(errorData.message || 'Failed to fetch notification');
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { message: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Hàm cập nhật Notification theo ID
export const updateNotificationById = async (id: string, notificationData: Partial<Notification>): Promise<ApiResponse<Notification>> => {
  try {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.NOTIFICATION_BY_ID(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 404) throw new Error('Notification not found');
      throw new Error(errorData.message || 'Failed to update notification');
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { message: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Hàm xóa Notification theo ID
export const deleteNotificationById = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.NOTIFICATION_BY_ID(id)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 404) throw new Error('Notification not found');
      throw new Error(errorData.message || 'Failed to delete notification');
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { message: error instanceof Error ? error.message : 'Unknown error' };
  }
};