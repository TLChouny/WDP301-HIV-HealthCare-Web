import axios from "axios";
import { BASE_URL, API_ENDPOINTS } from "../constants/api";
import type { Blog } from "../types/blog";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getAllBlogs = async (): Promise<Blog[]> => {
  const res = await apiClient.get(API_ENDPOINTS.BLOGS);
  return res.data;
};

export const getBlogById = async (id: string): Promise<Blog> => {
  const res = await apiClient.get(API_ENDPOINTS.BLOG_BY_ID(id));
  return res.data;
};

export const createBlog = async (data: Partial<Blog>): Promise<Blog> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Không tìm thấy token xác thực");
  const res = await apiClient.post(API_ENDPOINTS.BLOGS, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateBlog = async (id: string, data: Partial<Blog>): Promise<Blog> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Không tìm thấy token xác thực");
  const res = await apiClient.put(API_ENDPOINTS.BLOG_BY_ID(id), data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteBlog = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Không tìm thấy token xác thực");
  await apiClient.delete(API_ENDPOINTS.BLOG_BY_ID(id), {
    headers: { Authorization: `Bearer ${token}` },
  });
}; 