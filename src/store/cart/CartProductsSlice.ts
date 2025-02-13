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
    addProductToCart: (state, action: PayloadAction<{ product: Product, discountUserUsing: Discount }>) => {
      const productExists = state.products.find(
        (p) => p.id === action.payload.product.id,
      );
      const product = action.payload.product

      // check if user is using a discount and apply it before adding
      // hte product to cart

      if (productExists) {
        productExists.product_quantity += 1 as any;
        return
      }
      product.product_quantity = 1
      state.products.push(product);
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
        product.product_quantity += action.payload.quantity as any;
      }
    },
    /*
     * @param: discount_total: total amount to discount from products
     * @return: nothing 
     *
     *
     * */
    changeProductPrice: (
      state,
      action: PayloadAction<{
        discount_total: string;
        userIsUsingDiscount: Discount;
      }>,
    ) => {
      if (action.payload.userIsUsingDiscount) {
        return;
      } else {
        state.products.map((product) => {
          product.product_price %= parseInt(action.payload.discount_total);
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
        product.product_quantity -= action?.payload?.quantity as any;
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
