import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useTokenStore } from "../stores/token";
import toast from "react-hot-toast";
import { ApiResponse } from "../types/api";

interface ErrorResponse {
  message: string;
  status: number;
  code: string;
}

export const dodamAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
});

dodamAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useTokenStore.getState();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

dodamAxios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      try {
        const { data } = await axios.post<{ accessToken: string }>(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        useTokenStore.getState().setAccessToken(data.accessToken);

        if (originalRequest) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return dodamAxios(originalRequest);
        }
      } catch (refreshError) {
        useTokenStore.getState().clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.message === "Network Error") {
      toast.error("네트워크 연결을 확인해주세요");
    } else if (error.message.includes("timeout")) {
      toast.error("요청 시간이 초과되었습니다");
    } else {
      toast.error("알 수 없는 오류가 발생했습니다");
    }

    switch (error.response?.status) {
      case 403:
        toast.error("권한이 없습니다");
        break;
      case 404:
        toast.error("요청한 리소스를 찾을 수 없습니다");
        break;
      case 500:
        toast.error("서버 오류가 발생했습니다");
        break;
    }

    return Promise.reject(error);
  }
);

export const api = {
  get: <T>(url: string, config = {}) =>
    dodamAxios.get<ApiResponse<T>>(url, config),

  post: <T>(url: string, data = {}, config = {}) =>
    dodamAxios.post<ApiResponse<T>>(url, data, config),

  put: <T>(url: string, data = {}, config = {}) =>
    dodamAxios.put<ApiResponse<T>>(url, data, config),

  patch: <T>(url: string, data = {}, config = {}) =>
    dodamAxios.patch<ApiResponse<T>>(url, data, config),

  delete: <T>(url: string, config = {}) =>
    dodamAxios.delete<ApiResponse<T>>(url, config),
};

export default dodamAxios;
