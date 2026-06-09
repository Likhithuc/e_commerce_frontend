import api from './api';
import type { NotificationResponse, PageResponse } from '../types';

export const getNotifications = async (params: { page?: number; size?: number }) => {
  const res = await api.get<{ data: PageResponse<NotificationResponse> }>('/notifications', { params });
  return res.data.data;
};

export const getUnreadCount = async () => {
  const res = await api.get<{ data: { unreadCount: number } }>('/notifications/unread-count');
  return res.data.data;
};

export const markAsRead = async (id: number) => {
  await api.put(`/notifications/${id}/read`);
};

export const markAllAsRead = async () => {
  await api.put('/notifications/read-all');
};
