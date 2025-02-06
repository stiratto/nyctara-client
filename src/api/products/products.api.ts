import { Product } from "@/interfaces/Product.Interface.ts";
import apiClient from "../index.ts";
import { store } from "@/store/store.ts";

// GETS

const token = store.getState().user.token;

async function GetAllProducts() {
  try {
    const response = await apiClient.get(`/products`);
    return response.data;
  } catch (error: any) {
    throw new Error(`Error al obtener el producto: ${error}`);
  }
}

async function GetProductImage(id: string) {
  try {
    const response = await apiClient.get(`/products/cart/${id}`);
    return response.data;
  } catch (err: any) {
    throw new Error(`Error al obtener la imagen del producto: ${err}`);
  }
}

async function CreateProduct(body: any, token: string) {
  try {
    const response = await apiClient.post("/products/create-product", body, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(`Error al crear el producto: ${error}`);
  }
}

async function GetProductById(id: string): Promise<Product> {
  try {
    const response = await apiClient.get(`/products/findProductById/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(`Error al obtener el producto: ${error}`);
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
    throw new Error(`Error al obtener los productos por limite: ${error}`);
  }
}

async function GetProductsByLimitAndCategory(limit: number, category: string) {
  try {
    const response = await apiClient.get(
      `/products/homepage/${category}/${limit}`,
    );
    return response.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

async function SearchProducts(word: string) {
  try {
    const response = await apiClient.get(`/products/search/${word}`);
    return response.data;
  } catch (error: any) {
    throw new Error(`Error al buscar productos: ${error}`);
  }
}

// POSTS

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
    throw new Error(`Error al editar el producto: ${error}`);
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
  } catch (err: any) {
    throw new Error(`Error al eliminar el producto: ${err}`);
  }
}

async function DeleteProductImage(id: string, image: string, token: string) {
  try {
    const response = await apiClient.delete(`/products/image/${id}/${image}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (err: any) {
    console.log(`Error al eliminar la imagen: ${err}`);
  }
}

async function DeleteBulkProducts(products: string[], token: string) {
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
  } catch (err: any) {
    throw new Error(`Error al eliminar el producto: ${err}`);
  }
}



export default {
  EditProduct,
  DeleteProductImage,
  DeleteProduct,
  GetAllProducts,
  GetProductById,
  GetProductsByLimit,
  DeleteBulkProducts,
  GetProductsByLimitAndCategory,
  GetProductImage,
  SearchProducts,
  CreateProduct,
};
