import api from './api';

export const performVisualSearch = async (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post('/ai/visual-search', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};
