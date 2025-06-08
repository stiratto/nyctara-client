import { Discount } from "@/interfaces/Discount.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type DiscountsState = {
  discounts_user_already_used: Discount[];
  current_discount_being_used: Discount | null;
  error: null | string;
};


const initialState: DiscountsState = {
  discounts_user_already_used: [],
  current_discount_being_used: null,
  error: null,
};

export const discountsSlice = createSlice({
  name: "discounts",
  initialState,
  reducers: {
    applyDiscount: (state, action: PayloadAction<Discount>) => {
      console.log(action)
      state.current_discount_being_used = action.payload
      state.discounts_user_already_used.push(action.payload)
    },
    clearCurrentDiscountUsing: (state) => {
      state.current_discount_being_used = null
    },
    discountNotExistsError: (state, action: PayloadAction<{ error: string }>) => {
      state.error = action.payload.error
    },
    clearDiscountError: (state) => {
      state.error = null
    }

  },

});

export const { applyDiscount, clearCurrentDiscountUsing, discountNotExistsError, clearDiscountError } = discountsSlice.actions;

export default discountsSlice.reducer;
