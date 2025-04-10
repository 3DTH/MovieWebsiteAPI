import api from './index';

interface UploadResponse {
  success: boolean;
  data: {
    url: string;
    public_id: string;
  };
}

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  return api.post<UploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    }
  });
};