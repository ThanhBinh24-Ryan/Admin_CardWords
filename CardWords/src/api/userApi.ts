// src/api/userApi.ts
import axiosInstance from './axiosInstance';

export const getUsers = async (params: any) => {
  return axiosInstance.get('/users', { params }); // For search, filter
};

export const getUserById = async (id: string) => {
  return axiosInstance.get(`/users/${id}`);
};

export const updateUser = async (id: string, data: any) => {
  return axiosInstance.put(`/users/${id}`, data);
};

export const lockUser = async (id: string) => {
  return axiosInstance.patch(`/users/${id}/lock`);
};

export const unlockUser = async (id: string) => {
  return axiosInstance.patch(`/users/${id}/unlock`);
};

export const resetUserPassword = async (id: string) => {
  return axiosInstance.patch(`/users/${id}/reset-password`);
};

export const assignRole = async (id: string, role: string) => {
  return axiosInstance.patch(`/users/${id}/assign-role`, { role });
};