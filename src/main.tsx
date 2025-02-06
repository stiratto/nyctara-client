import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import router from "./router/router";
import { persistor, store } from "./store/store.ts";
import { Suspense } from "react";
import LoadingPage from "./components/Other/LoadingPage.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>

        <Suspense fallback={
          <LoadingPage />
        }>

          <RouterProvider router={router} />
        </Suspense>
      </QueryClientProvider>
    </PersistGate>
  </Provider >,
);

export default queryClient;
