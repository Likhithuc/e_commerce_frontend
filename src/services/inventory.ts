import api from './api';
import type { InventoryResponse } from '../types';

export const getInventory = async (productId: number) => {
  const res = await api.get<{ data: InventoryResponse }>(`/inventory/${productId}`);
  return res.data.data;
};

export const updateInventory = async (productId: number, data: { availableQuantity: number; reservedQuantity?: number }) => {
  const res = await api.put(`/inventory/${productId}`, data);
  return res.data.data;
};

export const getLowStockItems = async (threshold = 10) => {
  const res = await api.get<{ data: InventoryResponse[] }>('/inventory/low-stock', { params: { threshold } });
  return res.data.data;
};
