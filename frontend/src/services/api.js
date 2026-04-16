import axios from "axios";

export const BASE_URL_BACKEND =
  import.meta.env.VITE_BASE_URL_BACKEND ||
  (import.meta.env.DEV
    ? "http://localhost:5000/api"
    : "https://tripzy-backend-j5t5.onrender.com/api");

const API = axios.create({
  baseURL: BASE_URL_BACKEND,
});

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export default API;
