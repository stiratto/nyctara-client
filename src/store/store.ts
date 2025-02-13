import { Action, combineReducers, configureStore, createAsyncThunk, ThunkAction } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartProductsReducer from "./cart/CartProductsSlice";
import discountsReducer from "./discounts/DiscountsSlice";
import userAuthReducer from "./userAuth/userAuthSlice";
import { changePriceIfUserUsingDiscount, checkIfUserAlreadyUsedDiscount } from "./middlewares.ts";


export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

const middlewares = [changePriceIfUserUsingDiscount, checkIfUserAlreadyUsedDiscount]

const rootReducer = combineReducers({
  user: userAuthReducer,
  cart: cartProductsReducer,
  discounts: discountsReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
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
