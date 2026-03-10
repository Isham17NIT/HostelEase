import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // so as to send cookies
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const requestUrl = originalRequest.url || "";

    const isAuthRoute =
      requestUrl === "/auth/login" ||
      requestUrl === "/auth/refresh-token" ||
      requestUrl === "/auth/logout";

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;
      try{
        await api.post("/auth/refresh-token");
        return api(originalRequest)
      }catch(error){ /// refresh token expired or user logged out
        localStorage.removeItem("user");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
