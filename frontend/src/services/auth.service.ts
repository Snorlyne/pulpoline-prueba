import apiClient from "./apiClient.service";
export const login = async (username: string, password: string) => {
  return await apiClient.post<{ username: string; token: string }>(`/auth/login`, {
    username,
    password,
  });
};

export const register = async (username: string, password: string) => {
  return await apiClient.post<null>(`/auth/register`, { username, password });
};
