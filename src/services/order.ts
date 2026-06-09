import api from './api';
import type { OrderResponse, PageResponse } from '../types';

export const placeOrder = async (data: { addressId: number; couponCode?: string }) => {
  const res = await api.post('/orders', data);
  return res.data.data;
};

export const getUserOrders = async (params: { page?: number; size?: number }) => {
  const res = await api.get<{ data: PageResponse<OrderResponse> }>('/orders', { params });
  return res.data.data;
};

export const getOrderHistory = async (params: { page?: number; size?: number }) => {
  const res = await api.get<{ data: PageResponse<OrderResponse> }>('/orders/history', { params });
  return res.data.data;
};

export const getOrderById = async (id: number) => {
  const res = await api.get<{ data: OrderResponse }>(`/orders/${id}`);
  return res.data.data;
};

export const cancelOrder = async (id: number) => {
  const res = await api.put(`/orders/${id}/cancel`);
  return res.data.data;
};
