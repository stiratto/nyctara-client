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
    updateCartProducts: (state, action: PayloadAction<{ products: Product[] }>) => {
      try {
        console.log(action.payload)
        const updatedQuantities = action.payload.products.map((product) => {
          const productWithId = state.products.find((p) => p.id === product.id) as Product
          if (productWithId) {
            return { ...product, product_quantity: productWithId.product_quantity }
          }
          return product
        })
        state.products = updatedQuantities
      } catch (err: any) {
        console.log(err)
      }
    },

    addProductToCart: (state, action: PayloadAction<{ product: Product, discountUserUsing: Discount }>) => {
      console.log(state.products)
      const productExists = state?.products?.find(
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

    changeProductPrice: (
      state,
      action: PayloadAction<{
        discount_total: string;
      }>,
    ) => {
      state.products.map((product) => {
        product.product_price -= Math.floor((product.product_price * parseInt(action.payload.discount_total)) / 100);

      });
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
  updateCartProducts,
  clearCart,
} = cartProductsSlice.actions;

export default cartProductsSlice.reducer;
