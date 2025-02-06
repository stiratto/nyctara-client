import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "/api";
const apiClient = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
});

apiClient.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    console.error("La llamada a la API fallo, error:", error);
    return Promise.reject(error);
  },
);

export default apiClient;
