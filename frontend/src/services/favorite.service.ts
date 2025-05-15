import apiClient from "./apiClient.service";
export const getFavorites = async () => {};

export const addFavorite = async (
  city: string,
  auth: { username: string; token: string }
) => {
  return await apiClient.post<null>(`/favorites`, { city }, auth.token);
};

export const removeFavorite = async (
  city: string,
  auth: { username: string; token: string }
) => {
  return await apiClient.delete<null>(`/favorites/${city}`, auth.token);
};
