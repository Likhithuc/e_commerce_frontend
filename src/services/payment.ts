import api from './api';
import type { PaymentResponse } from '../types';

export const processPayment = async (data: { orderId: number; paymentMethod: string }) => {
  const res = await api.post('/payments', data);
  return res.data.data;
};

export const getPaymentByOrderId = async (orderId: number) => {
  const res = await api.get<{ data: PaymentResponse }>(`/payments/${orderId}`);
  return res.data.data;
};
