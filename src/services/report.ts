import api from './api';
import type { ReportResponse } from '../types';

export const getSalesReport = async (startDate?: string, endDate?: string) => {
  const res = await api.get<{ data: ReportResponse }>('/reports/sales', { params: { startDate, endDate } });
  return res.data.data;
};

export const getOrdersReport = async (startDate?: string, endDate?: string) => {
  const res = await api.get<{ data: ReportResponse }>('/reports/orders', { params: { startDate, endDate } });
  return res.data.data;
};

export const getCustomersReport = async (startDate?: string, endDate?: string) => {
  const res = await api.get<{ data: ReportResponse }>('/reports/customers', { params: { startDate, endDate } });
  return res.data.data;
};

export const getInventoryReport = async (startDate?: string, endDate?: string) => {
  const res = await api.get<{ data: ReportResponse }>('/reports/inventory', { params: { startDate, endDate } });
  return res.data.data;
};
