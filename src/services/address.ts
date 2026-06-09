import api from './api';
import type { AddressResponse } from '../types';

export const getAddresses = async () => {
  const res = await api.get<{ data: AddressResponse[] }>('/addresses');
  return res.data.data;
};

export const createAddress = async (data: Omit<AddressResponse, 'id'>) => {
  const res = await api.post('/addresses', data);
  return res.data.data;
};

export const updateAddress = async (id: number, data: Omit<AddressResponse, 'id'>) => {
  const res = await api.put(`/addresses/${id}`, data);
  return res.data.data;
};

export const deleteAddress = async (id: number) => {
  await api.delete(`/addresses/${id}`);
};
