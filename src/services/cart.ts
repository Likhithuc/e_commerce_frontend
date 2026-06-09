import api from './api';
import type { CartResponse } from '../types';

export const getCart = async () => {
  const res = await api.get<{ data: CartResponse }>('/cart');
  return res.data.data;
};

export const addItemToCart = async (data: { productId: number; quantity: number }) => {
  const res = await api.post('/cart/items', data);
  return res.data.data;
};

export const updateCartItem = async (itemId: number, data: { productId: number; quantity: number }) => {
  const res = await api.put(`/cart/items/${itemId}`, data);
  return res.data.data;
};

export const removeCartItem = async (itemId: number) => {
  const res = await api.delete(`/cart/items/${itemId}`);
  return res.data.data;
};

export const clearCart = async () => {
  const res = await api.delete('/cart');
  return res.data.data;
};
