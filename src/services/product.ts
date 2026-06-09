import api from './api';
import type { ProductResponse, PageResponse } from '../types';

export const getProducts = async (params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}) => {
  const res = await api.get<{ data: PageResponse<ProductResponse> }>('/products', { params });
  return res.data.data;
};

export const getProductById = async (id: number) => {
  const res = await api.get<{ data: ProductResponse }>(`/products/${id}`);
  return res.data.data;
};

export const searchProducts = async (params: Record<string, string | number | undefined>) => {
  const res = await api.get<{ data: PageResponse<ProductResponse> }>('/products/search', { params });
  return res.data.data;
};

export const createProduct = async (data: {
  name: string; description?: string; sku: string; price: number;
  salePrice?: number; stockQuantity: number; brand?: string; status?: boolean; categoryId: number;
}) => {
  const res = await api.post('/products', data);
  return res.data.data;
};

export const addProductImages = async (productId: number, files: File[]) => {
  const formData = new FormData();
  files.forEach(f => formData.append('files', f));
  const res = await api.post(`/products/${productId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
};

export const updateProduct = async (id: number, data: Record<string, unknown>) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id: number) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};
