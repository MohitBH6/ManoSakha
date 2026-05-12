import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000", // FastAPI backend
});

API.interceptors.request.use((config) => {
  const userId = localStorage.getItem("user_id");
  if (userId) {
    config.headers["X-User-ID"] = userId;  // custom header
  }
  return config;
});
export default API;
