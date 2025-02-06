import { Discount } from "@/interfaces/Discount.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DiscountsState = {
  discounts_user_already_used: Discount[];
  current_discount_being_used: Discount;
};

const initialState: DiscountsState = {
  discounts_user_already_used: [],
  current_discount_being_used: {} as Discount,
};

export const discountsSlice = createSlice({
  name: "discounts",
  initialState,
  reducers: {
    discountsUserAlreadyUsed: (state, action: PayloadAction<Discount>) => {
      state.discounts_user_already_used.push(action.payload);
      state.current_discount_being_used = action.payload;
    },
    clearCurrentDiscountUsing: (state) => {
      state.current_discount_being_used = null
    }
  },
});

export const { discountsUserAlreadyUsed, clearCurrentDiscountUsing } = discountsSlice.actions;

export default discountsSlice.reducer;
