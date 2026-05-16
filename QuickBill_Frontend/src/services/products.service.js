import api from './api';

export const getProducts = async (search, stockFilter) => {
  const params = {};
  if (search) params.search = search;
  if (stockFilter) params.stockFilter = stockFilter;
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (data) => {
  const response = await api.post('/products', data);
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await api.patch(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const restockProduct = async (id, quantity) => {
  const response = await api.patch(`/products/${id}/restock`, { quantity });
  return response.data;
};
