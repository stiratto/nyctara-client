import { store } from "@/store/store.ts";
import apiClient from "../index.ts";
import { getAxiosErrorResponse } from "@/utils/utils.ts";
import { Category } from "@/interfaces/Category.Interface.ts";

const token = store.getState().user.token;

async function GetCategoryProducts(categoryId: string) {
  try {
    const response = await apiClient.get(
      `/categories/find-category-with-products/${categoryId}/`,
    );
    return response.data;
  } catch (error: any) {
    const errorMessage = getAxiosErrorResponse(error)
    throw new Error(errorMessage);
  }
}

async function GetCategoryById(categoryId: string) {
  try {
    const response = await apiClient.get(
      `/categories/find-category/${categoryId}`,
    );
    return response.data;
  } catch (error: any) {
    const errorMessage = getAxiosErrorResponse(error)
    throw new Error(errorMessage);
  }
}

async function GetAllCategories() {
  try {
    const response = await apiClient.get(`/categories/`);
    return response.data;
  } catch (error) {
    const errorMessage = getAxiosErrorResponse(error)
    throw new Error(errorMessage);

  }
}

async function CreateCategory(body: any) {
  try {
    const token = store.getState().user.token as any;

    const response = await apiClient.post("/categories/create-category", body, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage = getAxiosErrorResponse(error)
    throw new Error(errorMessage);
  }
}


async function UpdateCategory(data: Category) {
  try {
    const response = await apiClient.patch(
      `/categories/update-category/${data.id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        }
      },
    );
    return response.data;
  } catch (error) {
    const errorMessage = getAxiosErrorResponse(error)
    throw new Error(errorMessage);
  }
}

export default {
  GetCategoryProducts,
  GetAllCategories,
  CreateCategory,
  GetCategoryById,
  UpdateCategory,
};
