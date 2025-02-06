import productsApi from "@/api/products/products.api";
import ProductsNotFound from "@/components/NotFound/ProductsNotFound";
import { ProductCard } from "@/components/Products/ProductCard";
import { Product } from "@/interfaces/Product.Interface";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const Homepage = () => {
  const { isLoading: loading, data: products } = useQuery({
    queryKey: ["homepage-products"],
    queryFn: () => productsApi.GetProductsByLimitAndCategory(4, "PP"),
  });

  return (
    <div className="flex flex-col justify-center items-center ">
      <div className="h-screen">
        <picture> <source srcSet="https://nyctara-perfumery-static.s3.us-east-1.amazonaws.com/nyctara%2Bgrande.webp" media="(min-width: 300px)" /> <img src="https://nyctara-perfumery-static.s3.us-east-1.amazonaws.com/nyctara%2Bgrande.webp" alt="landing image" height="100" width="600" loading="lazy" decoding="async" /> </picture>

      </div>

      {loading
        ? (
          <LoaderCircle
            size={70}
            className="animate-spin duration-600 "
          />
        )
        : products && products.length >= 1 && Array.isArray(products)
          ? (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 py-24 px-8">
              {products.map((product: Product) => (
                <ProductCard
                  key={uuidv4()}
                  id={product.id}
                  quantity={product.quantity}
                  product_quality={product.product_quality}
                  images={product.images}
                  description={product.description}
                  category={product.category}
                  name={product.name}
                  price={product.price}
                  tags={product.tags}
                  notes={product.notes}
                />
              ))}
            </ul>
          )
          : <ProductsNotFound />}
    </div>
  );
};

export default Homepage;
