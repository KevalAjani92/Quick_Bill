import api from './api';

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getSalesChart = async () => {
  const response = await api.get('/dashboard/sales-chart');
  return response.data;
};

export const getTopProducts = async () => {
  const response = await api.get('/dashboard/top-products');
  return response.data;
};

export const getInsights = async () => {
  const response = await api.get('/dashboard/insights');
  return response.data;
};
