import axios from "axios";

const API = axios.create({
  baseURL:
    "http://localhost:5000/api",
});

// ==========================================
// ADD TOKEN
// ==========================================

API.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// HANDLE EXPIRED TOKEN
// ==========================================

API.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {

    if (
      error.response?.status === 401 &&
      (
        error.response?.data?.message
          ?.toLowerCase()
          .includes("token") ||
        error.response?.data?.message
          ?.toLowerCase()
          .includes("expired")
      )
    ) {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "role"
      );

      window.location.href =
        "/login";
    }

    return Promise.reject(error);
  }
);

export default API;