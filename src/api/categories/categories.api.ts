import { store } from "@/store/store.ts";
import apiClient from "../index.ts";



const token = store.getState().user.token;

async function GetCategoryProducts(categoryId: string) {
  try {
    const response = await apiClient.get(
      `/categories/find-category-with-products/${categoryId}/`,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(`Error al obtener los productos de la categoria: ${error}`);
  }
}

async function GetCategoryById(categoryId: string) {
  try {
    const response = await apiClient.get(
      `/categories/find-category/${categoryId}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener la categoria: ${error}`);
  }
}

async function GetAllCategories() {
  try {
    const response = await apiClient.get(`/categories/`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener las categorias: ${error}`);
  }
}

async function CreateCategory(body: any) {
  try {
    const token = store.getState().user.token as any;
    console.log(token);

    const response = await apiClient.post("/categories/create-category", body, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": "Bearer " + token,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error al crear la categoria: ${error}`);
  }
}

async function UpdateCategory(body: any, id: string) {
  try {
    const response = await apiClient.patch(
      `/categories/update-category/${id}`,
      body,
      { headers: { "Authorization": "Bearer " + token } },
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error al crear la categoria: ${error}`);
  }
}

export default {
  GetCategoryProducts,
  GetAllCategories,
  CreateCategory,
  GetCategoryById,
  UpdateCategory,
};
