import axios from "axios";
import { ApiUrl } from "./Config";

export const AxiosConfig = axios.create({
  baseURL: ApiUrl,
});

export const ProtectedAxiosConfig = axios.create({
  baseURL: ApiUrl,
});

AxiosConfig.interceptors.request.use(
  (config) => {
    const token = "";
    if (token) {
      // config.headers['Authorization'] = 'Bearer ' + token;
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AxiosConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
