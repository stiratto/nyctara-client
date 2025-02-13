import { Discount } from "@/interfaces/Discount.interface.ts";
import { store } from "@/store/store.ts";
import apiClient from "../index.ts";
import axios, { AxiosError, AxiosPromise } from "axios";
import { getAxiosErrorResponse } from "@/utils/utils.ts";

const token = store.getState().user.token;


async function GetDiscountByName(name: string): Promise<Discount> {
  try {
    const response = await apiClient.get(`/discounts/discount-name/${name}`);
    return response.data;
  } catch (error) {
    const errorMessage = getAxiosErrorResponse(error)
    throw new Error(errorMessage);
  }
}

async function GetDiscounts() {
  try {
    const response = await apiClient.get(`/discounts/all/`);
    return response.data;
  } catch (error) {
    const errorMessage = getAxiosErrorResponse(error)
    throw new Error(errorMessage);
  }
}

async function CreateDiscount(body: any) {
  try {
    const response = await apiClient.post(`/discounts/create-discount`, body, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = getAxiosErrorResponse(error)
    throw new Error(errorMessage);

  }
}

async function DeleteDiscount(id: string) {
  try {
    const response = await apiClient.delete(`/discounts/${id}`, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data;
  } catch (error) {
    const errorMessage = getAxiosErrorResponse(error)
    throw new Error(errorMessage);
  }
}

export default {
  GetDiscountByName,
  CreateDiscount,
  DeleteDiscount,
  GetDiscounts,
};
