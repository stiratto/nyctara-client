import productsApi from "@/api/products/products.api";
import { Product } from "@/interfaces/Product.Interface";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Frown, SearchIcon, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TypographyH1 } from "../Typography/h1";
import { Input } from "../ui/input";
import { ProductNotFoundCard } from "./ProductNotFoundCard";

const ProductsNotFound: React.FC<{ cart?: boolean }> = ({ cart }) => {
  const [input, setInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  const [show, setShow] = useState(false);
  const resultsRef: any = useRef();

  const { isLoading, data: products } = useQuery({
    queryKey: ["search", debouncedInput],
    queryFn: () => productsApi.SearchProducts(debouncedInput),
    enabled: !!debouncedInput,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedInput(input);
    }, 400);

    return () => clearTimeout(timeout);
  }, [input]);

  const handleClickOutside = (e: MouseEvent) => {
    if (resultsRef.current && !resultsRef.current.contains(e.target)) {
      setShow(false);
    }
  };

  const search = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setShow(true);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="flex gap-8 items-center flex-col justify-center px-4">
      <Frown size={70} />
      <TypographyH1>No se pudieron encontrar productos</TypographyH1>
      <p>
        No pudimos encontrar {cart ? <span>en tu carrito</span> : <span>en esta categoria</span>}. Prueba buscando otros productos o explora otras categorias
      </p>
      <div className="relative w-full space-y-1">
        <div className="relative flex">
          <Input
            placeholder="Buscar productos"
            onChange={search}
            className="rounded-lg border-black w-full"
          />
          <SearchIcon size={17} className="absolute right-4 top-3" />
        </div>

        <div
          ref={resultsRef}
          className={clsx(
            "w-full max-h-48 overflow-y-scroll overflow-x-hidden absolute top-38 border rounded-lg bg-white",
            show ? "block" : "hidden",
          )}
        >
          {isLoading && (
            <div className="p-4">
              <Loader2 className="animate-spin" />
            </div>
          )
          }

          {!isLoading && products && products.length > 0 ? (
            products?.map((product: Product) => <ProductNotFoundCard {...product} />)
          )
            :
            <div className="p-4 flex flex-col ">
              <p className="text-sm text-gray-700">No pudimos encontrar ningun producto con esa palabra</p>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default ProductsNotFound;
