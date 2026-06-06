import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";

export const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
    timeout: import.meta.env.VITE_TIMEOUT,
    withCredentials: true
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("access_token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originRequest = error.config;

    if (originRequest.url.includes("/auth")) {
      return Promise.reject(error);
    }

    originRequest._retryCount = originRequest._retryCount || 0;

    if (error.response?.status == 401 && originRequest._retryCount < 1) {
      originRequest._retryCount += 1;

      const res = await api.post("auth/refresh");

      const { accessToken } = res.data

      if (!accessToken) {
        return Promise.reject(error);
      }

      localStorage.setItem("access_token", accessToken)

      originRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originRequest);
    }

    return Promise.reject(error);
  },
);
