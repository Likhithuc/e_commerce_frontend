import api from './api';
import type { CouponResponse } from '../types';

export const getCoupons = async () => {
  const res = await api.get<{ data: CouponResponse[] }>('/coupons');
  return res.data.data;
};

export const createCoupon = async (data: Omit<CouponResponse, 'id'>) => {
  const res = await api.post('/coupons', data);
  return res.data.data;
};

export const updateCoupon = async (id: number, data: Partial<CouponResponse>) => {
  const res = await api.put(`/coupons/${id}`, data);
  return res.data.data;
};

export const deleteCoupon = async (id: number) => {
  await api.delete(`/coupons/${id}`);
};
