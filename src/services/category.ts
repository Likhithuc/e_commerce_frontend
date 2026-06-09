import api from './api';
import type { CategoryResponse } from '../types';

export const getCategories = async () => {
  const res = await api.get<{ data: CategoryResponse[] }>('/categories');
  return res.data.data;
};

export const getCategoryById = async (id: number) => {
  const res = await api.get<{ data: CategoryResponse }>(`/categories/${id}`);
  return res.data.data;
};

export const createCategory = async (data: { name: string; description?: string; status?: boolean }) => {
  const res = await api.post('/categories', data);
  return res.data;
};

export const updateCategory = async (id: number, data: { name?: string; description?: string; status?: boolean }) => {
  const res = await api.put(`/categories/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id: number) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};
