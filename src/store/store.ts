import { Action, combineReducers, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartProductsReducer from "./cart/CartProductsSlice";
import discountsReducer from "./discounts/DiscountsSlice";
import userAuthReducer from "./userAuth/userAuthSlice";
import filteringReducer from "./filtering/FilteringSlice";
import { changePriceApplyDiscount, changePriceIfUserUsingDiscount, checkIfUserAlreadyUsedDiscount } from "./middlewares.ts";

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

const middlewares = [checkIfUserAlreadyUsedDiscount, changePriceIfUserUsingDiscount, changePriceApplyDiscount]

const rootReducer = combineReducers({
  user: userAuthReducer,
  cart: cartProductsReducer,
  discounts: discountsReducer,
  filtering: filteringReducer
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  blacklist: ["filtering"],
  whitelist: ["user", "cart", "discounts"],

};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(middlewares),
});


export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
