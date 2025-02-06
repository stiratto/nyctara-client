import apiClient from "../index.ts";

export const apiLogIn = async (password: string) => {
  try {
    const response = await apiClient.post("/auth/login", { password: password });
    console.log(response.data)
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
