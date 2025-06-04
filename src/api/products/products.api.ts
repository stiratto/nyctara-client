import { Product } from "@/interfaces/Product.Interface.ts";
import apiClient from "../index.ts";
import { store } from "@/store/store.ts";
import { getAxiosErrorResponse } from "@/utils/utils.ts";


const token = store.getState().user.token;

// GET REQUESTS
async function GetAllProducts() {
  try {
    const response = await apiClient.get(`/products`);
    return response.data;
  } catch (error: any) {
    const errorMessage = getAxiosErrorResponse(error)
    throw new Error(errorMessage);
  }
}

async function GetAllNotes() {
  try {
    const response = await apiClient.get(`/products/get-all-notes`);
    return response.data;
  } catch (error: any) {
    const errorMessage = getAxiosErrorResponse(error)
    throw new Error(errorMessage);
  }
}

async function GetCartProducts(ids: string[]) {
  try {
    const response = await apiClient.get(`/products/cartProducts/${ids}`)
    return response.data

  } catch (error: any) {
    const errorMessage = getAxiosErrorResponse(error)
    throw new Error(errorMessage)
  }

}

async function FilterProducts(params: string, categoryId: string) {
  try {
    console.log("Filtrando productos... products.api.ts:45")
    const response = await apiClient.get(`/products/filter-products/${categoryId}?${params}`)
    return response.data

  } catch (err: any) {
    const errorMessage = getAxiosErrorResponse(err)
    throw new Error(errorMessage)
  }
}

async function GetProductImage(id: string) {
  try {
    const response = await apiClient.get(`/products/cart/${id}`);
    return response.data;
  } catch (error: any) {
    const errorMessage = getAxiosErrorResponse(error)
    throw new Error(errorMessage);
  }
}

async function GetProductById(id: string): Promise<Product> {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  } catch (error: any) {
    const errorMessage = getAxiosErrorResponse(error)
    throw new Error(errorMessage);
  }
}

async function SearchProducts(word: string) {
  try {
    const response = await apiClient.get(`/products/search/${word}`);
    return response.data;
  } catch (error: any) {
    const errorMessage = getAxiosErrorResponse(error)
    throw new Error(errorMessage);
  }
}

async function GetProductsByLimit(limit: number, id: string) {
  try {
    let response: any;
    if (id) {
      // If ID is included then it means to exclude the product
      // that has that id
      response = await apiClient.get(`/products/limit/${limit}/${id}`);
    } else {
      // Else, get any products by limit
      response = await apiClient.get(`/products/limit/${limit}`);
    }
    return response.data;
  } catch (error: any) {
    const errorMessage = getAxiosErrorResponse(error)
    throw new Error(errorMessage);
  }
}

async function GetProductsByLimitAndCategory(limit: number, category: string) {
  try {
    const response = await apiClient.get(
      `/products/homepage/${category}/${limit}`,
    );
    return response.data;
  } catch (error: any) {
    const errorMessage = getAxiosErrorResponse(error)
    throw new Error(errorMessage);
  }
}


// POSTS

async function CreateProduct(body: any, token: string) {
  try {
    console.log(token)
    const response = await apiClient.post("/products/create-product", body, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = getAxiosErrorResponse(error)
    throw new Error(errorMessage);
  }
}



// PATCH
async function EditProduct(id: string, body: FormData) {
  try {
    const response = await apiClient.patch(`/products/${id}`, body, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = getAxiosErrorResponse(error)
    throw new Error(errorMessage);
  }
}

// DELETE
async function DeleteProduct(id: string) {
  try {
    const response = await apiClient.delete(`/products/deleteProduct/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = getAxiosErrorResponse(error)
    throw new Error(errorMessage);
  }
}

async function DeleteProductImage(id: string, image: string) {
  try {
    const response = await apiClient.delete(`/products/image/${id}/${image}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = getAxiosErrorResponse(error)
    throw new Error(errorMessage);
  }
}

async function DeleteBulkProducts(products: string[]) {
  try {
    const response = await apiClient.delete(`/products/deleteBulkProducts`, {
      headers: {
        Authorization: "Bearer " + token,
      },
      data: {
        products,
      }
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = getAxiosErrorResponse(error)
    throw new Error(errorMessage);
  }
}




export default {
  EditProduct,
  DeleteProductImage,
  DeleteProduct,
  GetAllProducts,
  GetProductById,
  GetAllNotes,
  GetProductsByLimit,
  DeleteBulkProducts,
  GetProductsByLimitAndCategory,
  GetProductImage,
  SearchProducts,
  FilterProducts,
  CreateProduct,
  GetCartProducts
};
