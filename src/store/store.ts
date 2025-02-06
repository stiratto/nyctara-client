import { Action, combineReducers, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartProductsReducer from "./cart/CartProductsSlice";
import discountsReducer from "./discounts/DiscountsSlice";
import userAuthReducer from "./userAuth/userAuthSlice";
import { checkDiscountUsing } from "./middlewares/checkDiscountUsing";


export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

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
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(checkDiscountUsing),

});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
