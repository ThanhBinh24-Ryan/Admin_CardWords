import axiosInstance from './axiosInstance';

export const getVocabs = async (params: any) => {
  return axiosInstance.get('/vocabs', { params });
};

export const getVocabById = async (id: string) => {
  return axiosInstance.get(`/vocabs/${id}`);
};

export const createVocab = async (data: any) => {
  return axiosInstance.post('/vocabs', data);
};

export const updateVocab = async (id: string, data: any) => {
  return axiosInstance.put(`/vocabs/${id}`, data);
};

export const deleteVocab = async (id: string) => {
  return axiosInstance.delete(`/vocabs/${id}`);
};

export const uploadMedia = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosInstance.post(`/vocabs/${id}/media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};