import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const apiUrl = import.meta.env.VITE_API_URL || "/api";
const apiClient = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
});

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    if (error.status === 429) {
      toast.error("Muchas requests! Por favor, intenta en unos segundos, nos estamos cansando! :(", {
        id: "many-requests"
      })
    }
    return Promise.reject(error);
  },
);

export default apiClient;
