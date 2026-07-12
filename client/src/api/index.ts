import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Products
export const getProducts = (params?: Record<string, string>) =>
  api.get('/products', { params });

export const getProduct = (id: string) =>
  api.get(`/products/${id}`);

export const getRelatedProducts = (categoryId: string, productId: string) =>
  api.get('/products/related', { params: { categoryId, productId } });

export const adminGetProducts = () =>
  api.get('/products/admin/all');

export const createProduct = (data: any) =>
  api.post('/products', data);

export const updateProduct = (id: string, data: any) =>
  api.put(`/products/${id}`, data);

export const deleteProduct = (id: string) =>
  api.delete(`/products/${id}`);

// Categories
export const getCategories = () =>
  api.get('/categories');

export const adminGetCategories = () =>
  api.get('/categories/admin/all');

export const createCategory = (data: any) =>
  api.post('/categories', data);

export const updateCategory = (id: string, data: any) =>
  api.put(`/categories/${id}`, data);

export const deleteCategory = (id: string) =>
  api.delete(`/categories/${id}`);

// Orders
export const placeOrder = (data: any) =>
  api.post('/orders', data);

export const getOrder = (id: string) =>
  api.get(`/orders/${id}`);

export const adminGetOrders = (status?: string) =>
  api.get('/orders/admin/all', { params: status ? { status } : {} });

export const updateOrderStatus = (id: string, status: string) =>
  api.put(`/orders/admin/${id}/status`, { status });

// Dashboard
export const getDashboard = () =>
  api.get('/dashboard');

// Admin Auth
export const adminLogin = (data: { email: string; password: string }) =>
  api.post('/admin/login', data);

export const getAdminProfile = () =>
  api.get('/admin/profile');

// Upload
export const uploadImage = (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/upload/single', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Banners
export const getBanners = () =>
  api.get('/banners');

export const adminGetBanners = () =>
  api.get('/banners/admin/all');

export const createBanner = (data: any) =>
  api.post('/banners', data);

export const updateBanner = (id: string, data: any) =>
  api.put(`/banners/${id}`, data);

export const deleteBanner = (id: string) =>
  api.delete(`/banners/${id}`);

export default api;
