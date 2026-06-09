import api from './api';
import type { WishlistResponse } from '../types';

export const getWishlist = async () => {
  const res = await api.get<{ data: WishlistResponse[] }>('/wishlist');
  return res.data.data;
};

export const addToWishlist = async (productId: number) => {
  const res = await api.post('/wishlist', { productId });
  return res.data.data;
};

export const removeFromWishlist = async (id: number) => {
  await api.delete(`/wishlist/${id}`);
};
