import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-api-url.com',
});

export const getDoctors = async () => {
  const response = await api.get('/doctors');
  return response.data;
};