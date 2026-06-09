import api from './api';
import type { ReviewResponse } from '../types';

export const getProductReviews = async (productId: number) => {
  const res = await api.get<{ data: ReviewResponse[] }>(`/reviews/product/${productId}`);
  return res.data.data;
};

export const addReview = async (data: { productId: number; rating: number; comment?: string }) => {
  const res = await api.post('/reviews', data);
  return res.data.data;
};

export const deleteReview = async (id: number) => {
  await api.delete(`/reviews/${id}`);
};
