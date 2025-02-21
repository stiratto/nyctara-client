import { ExternalLink, Frown, Loader2, PackageSearch, PersonStanding, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { cn, formatPrice } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import productsApi from "@/api/products/products.api";
import { Product } from "@/interfaces/Product.Interface";
import { IsAvailableBadge } from "@/components/Products/IsAvailableBadge";
import { TypographyH1 } from "@/components/Typography/h1";

export const NavbarSearchProducts = () => {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState<string>("")
  const [debouncedInput, setDebouncedInput] = useState<string>("")
  const divRef = useRef<HTMLDivElement>(null);

  let { isError, isLoading, refetch: getResults, data: results } = useQuery<Product[]>({
    queryKey: ['results', debouncedInput],
    queryFn: () => productsApi.SearchProducts(input),
    enabled: !!debouncedInput
  })


  const reveal = () => {
    setShow(!show)
    document.querySelector("body")?.classList?.toggle("no-scroll")
  }

  const memoizedResults = useMemo(() => results?.map((product) => (
    <NavLink to={`/producto/${product.id}`} className="flex gap-2 items-center" onClick={reveal}>

      <img src={product?.product_images?.[0] as string} className="w-24 h-24 rounded-xl" />
      <div className="flex flex-col gap-2">
        <p className="text-lg font-bold flex items-center gap-2 text-blue-500 underline">{product.product_name}<ExternalLink /></p>
        <p className="font-bold">${formatPrice(product.product_price)}</p>
        <IsAvailableBadge isAvailable={product.isAvailable} />
      </div>
    </NavLink>
  )), [results])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (input?.trim() === "" || input?.includes("/")) return
      setDebouncedInput(input)
      getResults()
    }, 400)
    return () => clearTimeout(timeout);

  }, [input])




  return (
    <div className="relative w-full" ref={divRef}>
      <div className="flex items-center justify-center w-full gap-4">
        <button
          type="button"
          className="cursor-pointer relative z-900 hover:scale-110 transition-all"
          onClick={reveal}
        >
          <Search size={18} />
        </button>
      </div>
      <div className={cn("fixed z-800 transition-all inset-0", show ? "opacity-100" : "opacity-0 pointer-events-none")}>
        <div className="relative space-y-4 ">
          <div
            className={cn("absolute w-screen h-screen left-0 top-0 inset-0 bg-black/70")}
            onClick={reveal}
          >
          </div>

          <div
            className={cn("bg-white rounded-xl p-8 min-w-sm max-w-sm md:min-w-lg md:max-w-lg flex flex-col justify-between my-16 z-1100 absolute top-0 right-4 mx-2 md:mx-24", show ? "opacity-100" : "opacity-0")}
          >
            <X className="self-end mb-4 cursor-pointer" size={20} onClick={reveal} />
            <div className="flex flex-col gap-8">
              <form className="relative">
                <Input
                  name="search"
                  type="text"
                  placeholder="Busca un producto"
                  className="p-2 z-900 placeholder:text-xs md:placeholder:text-sm"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                  }}
                />
                <div className="absolute top-2 right-4">

                  {input?.length === 0 ? <Search size={20} /> : <X size={20} className="cursor-pointer" onClick={() => {
                    setInput("")
                    setDebouncedInput("")
                  }} />}
                </div>
              </form>
              <div className="h-96 overflow-y-scroll px-8 py-4 border border-gray-500 rounded-lg ">
                {!isLoading && !isError && !results && <div className="flex justify-center items-start flex-col h-full gap-4">
                  <PackageSearch size={50} className="text-gray-500" />
                  <TypographyH1 className="text-gray-500">Busca un producto por su nombre</TypographyH1>
                </div>}

                {isLoading && <Loader2 size={40} className="animate-spin" />}
                {!isLoading && isError && <p>Hubo un error</p>}
                {!isLoading && results && results.length > 0 &&
                  <div className="space-y-4">
                    <p className="self-center w-full text-gray-500">{results?.length} resultados encontrados </p>
                    {memoizedResults}
                  </div>
                }
                {!isLoading && results && results.length === 0 && <p className="text-gray-500 flex flex-col gap-4">
                  <Frown size={40} />
                  No pudimos encontrar un producto con ese nombre
                </p>}

              </div>
            </div>

          </div>
        </div>
      </div>

    </div >
  );
};
