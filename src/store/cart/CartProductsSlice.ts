// Add product to cart slice
import { Product } from "@/interfaces/Product.Interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Discount } from "@/interfaces/Discount.interface";

interface CartState {
  products: Product[];
}

const initialState: CartState = {
  products: [],
};

const cartProductsSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProductToCart: (state, action: PayloadAction<{product: Product}>) => {
      const productExists = state.products.find(
        (p) => p.id === action.payload.product.id,
      );

      if (productExists) {
        productExists.quantity += 1 as any;
      } else {
        action.payload.product.quantity = 1
        state.products.push(action.payload.product);
      }
    },
    removeProductFromCart: (state, action: PayloadAction<{ id: string }>) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload.id,
      );
    },
    clearCart: (state) => {
      state.products = [];
    },
    addQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const product = state.products.find(
        (product) => product.id === action.payload.id,
      );
      if (product) {
        product.quantity += action.payload.quantity as any;
      }
    },
    changeProductPrice: (
      state,
      action: PayloadAction<{
        discount_total: string;
        discount_name: string;
        userIsUsingDiscount: Discount;
      }>,
    ) => {
      if (action.payload.userIsUsingDiscount) {
        return;
      } else {
        state.products.map((product) => {
          product.price = product.price - parseInt(action.payload.discount_total);
        });
      }
    },
    removeQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const product = state.products.find(
        (product) => product.id === action.payload.id,
      );
      if (product) {
        product.quantity -= action.payload.quantity as any;
      }
    },
  },
});


export const {
  addProductToCart,
  removeProductFromCart,
  addQuantity,
  removeQuantity,
  changeProductPrice,
  clearCart,
} = cartProductsSlice.actions;

export default cartProductsSlice.reducer;
