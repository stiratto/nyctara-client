import { Discount } from "@/interfaces/Discount.interface.ts";
import { store } from "@/store/store.ts";
import apiClient from "../index.ts";

const token = store.getState().user.token;

async function GetDiscountByName(name: string): Promise<Discount> {
  try {
    const response = await apiClient.get(`/discounts/discount-name/${name}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener el descuento: ${error}`);
  }
}

async function GetDiscounts() {
  try {
    const response = await apiClient.get(`/discounts/all/`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener los descuentos: ${error}`);
  }
}

async function GetAllDiscounts() {
  try {
    const response = await apiClient.get(`/discounts/all`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener los descuentos: ${error}`);
  }
}

async function CreateDiscount(body: any) {
  try {
    const response = await apiClient.post(`/discounts/create-discount`, body, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error al crear el descuento: ${error}`);
  }
}

async function DeleteDiscount(id: string) {
  try {
    const response = await apiClient.delete(`/discounts/${id}`, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error al eliminar el descuento: ${error}`);
  }
}

export default {
  GetDiscountByName,
  CreateDiscount,
  DeleteDiscount,
  GetAllDiscounts,
  GetDiscounts,
};
