import { createBrowserRouter } from "react-router-dom";
import App from "../App.tsx";
import { lazy } from "react";
import Layout from "../layouts/Layout.tsx"
import { FilteringDrawerContextProvider } from "@/contexts/FilteringDrawerContext.tsx";
import { FilteringProvider } from "@/contexts/filteringContext.tsx";
const Login = lazy(() => import('../pages/Login.tsx'))
const PageNotFound = lazy(() => import('../components/NotFound/PageNotFound.tsx'))
const AddUpdateCategory = lazy(() => import('@/components/Categories/AddUpdateCategory.tsx'))
const Product = lazy(() => import('../components/Products/Product.tsx'))
const ProductsAdminPanel = lazy(() => import('../components/Products/Admin/ProductAdminPanel.tsx'))
const EditProduct = lazy(() => import('../components/Products/Admin/EditProduct.tsx'))
const Discounts = lazy(() => import('../components/Discounts/Discounts.tsx'))
const Cart = lazy(() => import('@/components/Cart/Cart.tsx'))
const AdminPanel = lazy(() => import('@/components/Admin/AdminPanel.tsx'))
const PrivateRoute = lazy(() => import('./PrivateRoute.tsx'))
const UpdateCategory = lazy(() => import('../components/Categories/UpdateCategory.tsx'))
const CategoryProducts = lazy(() => import('../components/Products/CategoryProducts.tsx'))

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "/login",
        // path="/s/v/n/p/u/whyhsvnblhy/svnblhukv"
        element: <Login />,
      },
      {
        path: "/categoria/:id",
        element:
          <FilteringProvider>
            <FilteringDrawerContextProvider>
              <CategoryProducts />
            </FilteringDrawerContextProvider>,
          </FilteringProvider>
      },
      {
        path: "/producto/:id",
        element: <Product />,
      },
      {
        path: "/carrito",
        element: <Cart />,
      },
      {
        element: <PrivateRoute />,
        children: [
          { path: "/admin/productos", element: <ProductsAdminPanel /> },
          { path: "/admin/categorias", element: <AddUpdateCategory /> },
          { path: "/admin/editar-categoria/:id", element: <UpdateCategory /> },
          { path: "/admin/admin-panel", element: <AdminPanel /> },
          { path: "/admin/descuentos", element: <Discounts /> },
          { path: "/admin/editar-producto/:id", element: <EditProduct /> },
        ],
      },
      { path: "*", element: <PageNotFound /> },
    ],
  },
]);

export default router;
