import { AppStore } from "@/store/store";
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5017/api",
  withCredentials: true,
});

let store: AppStore;

export const injectStore = (_store: AppStore) => {
  store = _store;
};

api.interceptors.request.use(
  (config) => {
    const token = store?.getState().auth?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
