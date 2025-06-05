import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "/api";
const apiClient = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
});

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
