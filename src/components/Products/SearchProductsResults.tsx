import productsApi from "@/api/products/products.api";
import { Product } from "@/interfaces/Product.Interface";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { LoaderCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import ProductsNotFound from "../NotFound/ProductsNotFound";
import { ProductCard } from "./ProductCard";

const SearchProductsResults = () => {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("query") as string;

  const {
    isLoading,
    isError,
    data: products,
  } = useQuery({
    queryKey: ["productsResults", query],
    queryFn: () => productsApi.SearchProducts(query),
    enabled: !!query,
  });

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center py-24 px-2 md:px-8",
        {
          "h-screen": isLoading || isError,
        },
      )}
    >
      <h1>Resultados para la busqueda: "{query}"</h1>

      {isLoading && <LoaderCircle className="animate-spin mx-auto" size={120} />}
      <div
        className={clsx(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-full gap-4 p-8",
          { "!flex !justify-center !items-center": products?.length === 0 },
        )}
      >
        {!isLoading && isError && <p>No se pudo obtener los productos...</p>}
        {!isLoading && !isError && products.length === 0 && <ProductsNotFound />}
        {!isLoading
          && !isError
          && products.length > 0
          && products?.map((product: Product) => {
            return (
              <ProductCard
                {...product}
              />
            );
          })}
      </div>
    </div>
  );
};

export default SearchProductsResults;
