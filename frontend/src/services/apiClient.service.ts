import axios, { type AxiosRequestConfig } from "axios";
import type { IResponse } from "../interfaces/response.interface";

const API_URL = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

const getAuthHeaders = (token: string | null, useAuth = true) => {
  if (!useAuth || !token) return {};
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const apiClient = {
  get: async <T>(
    url: string,
    token: string | null = null,
    useAuth = false,
    config?: AxiosRequestConfig
  ) => {
    const res = await instance.get<IResponse<T>>(url, {
      ...getAuthHeaders(token, useAuth),
      ...config,
    });
    return res.data;
  },

  post: async <T>(
    url: string,
    data?: any,
    token: string | null = null,
    useAuth = true,
    config?: AxiosRequestConfig
  ): Promise<IResponse<T>> => {
    const res = await instance.post<IResponse<T>>(url, data, {
      ...getAuthHeaders(token, useAuth),
      ...config,
    });
    return res.data;
  },

  delete: async <T>(
    url: string,
    token: string | null = null,
    useAuth = true,
    config?: AxiosRequestConfig
  ) => {
    const res = await instance.delete<IResponse<T>>(url, {
      ...getAuthHeaders(token, useAuth),
      ...config,
    });
    return res.data;
  },
};

export default apiClient;
