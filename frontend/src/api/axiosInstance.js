import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true // so as to send
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh-token"
    ) {
      originalRequest._retry = true;
      await api.post("/auth/refresh-token");
      return api(originalRequest);
    }
    return Promise.reject(error);
  },
);

export default api;
