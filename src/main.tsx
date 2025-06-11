import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import router from "./router/router";
import { persistor, store } from "./store/store.ts";
import { queryClient } from "@/utils/react-query.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </PersistGate>
  </Provider>,
);

export default queryClient;
