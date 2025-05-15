import axios, { AxiosError } from "axios";

export interface ParsedAxiosError {
  message: string;
  statusCode?: number;
  data?: any;
}

export function handleAxiosError(error: unknown): ParsedAxiosError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      return {
        message:
          (axiosError.response.data as { message?: string })?.message ||
          axiosError.response.statusText ||
          "An error occurred while processing your request.",
        statusCode: axiosError.response.status,
        data: axiosError.response.data,
      };
    } else if (axiosError.request) {
      return {
        message:
          "No response received from server. Please check your network connection.",
      };
    } else {
      return {
        message: axiosError.message || "Unexpected Axios error.",
      };
    }
  }

  return {
    message: error instanceof Error ? error.message : "An unexpected error occurred.",
  };
}
