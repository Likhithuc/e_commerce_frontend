import api from './api';

export const forgotPassword = async (email: string) => {
  const res = await api.post('/auth/forgot-password', { email });
  return res.data;
};

export const resetPassword = async (data: { otp: string; email: string; newPassword: string; confirmPassword: string }) => {
  const res = await api.post('/auth/reset-password', data);
  return res.data;
};

export const refreshToken = async (refreshToken: string) => {
  const res = await api.post('/auth/refresh-token', { refreshToken });
  return res.data;
};
