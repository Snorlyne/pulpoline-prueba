import type { IAutocomplete, IWeather } from "../interfaces/weather.interface";
import apiClient from "./apiClient.service";

export const autocomplete = async (query: string) => {
  return await apiClient.get<IAutocomplete[]>(`/weather/autocomplete?query=${query}`);
};

export const getWeather = async (city: string) => {
  return await apiClient.get<IWeather>(`/weather?city=${city}`);
};
