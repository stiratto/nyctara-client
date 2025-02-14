import productsApi from "@/api/products/products.api"
import { TypographyH1 } from "@/components/Typography/h1"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Product } from "@/interfaces/Product.Interface"
import queryClient from "@/main";
import { RootState } from "@/store/store";
import { useMutation, useQuery } from "@tanstack/react-query"
import { warn } from "console";
import { ExternalLink, LoaderCircle, Search, Trash2 } from "lucide-react";
import { ChangeEvent, memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { toast } from "sonner"

const DeleteBulkProducts = () => {
  const [results, setResults] = useState<Product[]>()
  const [productsToDelete, setProductsToDelete] = useState<Set<string>>(new Set())
  const containerRef = useRef(null);

  const { isLoading, isError, data: products } = useQuery<Product[]>({
    queryKey: ["all-products"],
    queryFn: async () => {
      const response = await productsApi.GetAllProducts()
      setResults(response)
      return response
    },


  })
  const search = (e: ChangeEvent<HTMLInputElement>) => {
    const searchResults: any = products?.filter((p) => p.product_name.includes(e.target.value))
    setResults(searchResults)
  }

  const onCheckBox = (productId: string) => {
    setProductsToDelete((prev) => {
      const set = new Set(prev)
      if (set.has(productId)) {
        set.delete(productId)
      } else {
        set.add(productId)
      }
      return set
    })
  }

  const token = useSelector((state: RootState) => state.user.token) as string

  const { mutate } = useMutation({
    mutationKey: ['deleteBulkProducts'],
    mutationFn: (productsToDeleteArray: string[]) => productsApi.DeleteBulkProducts(productsToDeleteArray, token),
    onMutate: async () => {
      try {
        // Cancel the queries on the category-products
        queryClient.cancelQueries({ queryKey: ['all-products'] });
        queryClient.cancelQueries({ queryKey: ['category-products'] });

        // Get the previous products in case of an error
        const previousProducts = queryClient.getQueryData(['all-products'])
        const previousCategoryProducts = queryClient.getQueryData(['category-products'])


        // Return all the products that are not inside the productsToDelete 
        queryClient.setQueryData(["all-products"], (oldData: any) => oldData.filter((product: any) => !productsToDelete?.has(product.id)))

        // Same here, just if the user hasn't been in the category products route
        // return the old data.
        queryClient.setQueriesData({ queryKey: ["category-products"] }, (oldData: any) => {
          if (oldData) {
            return oldData.filter((product: Product) => !productsToDelete?.has(product.id as string))
          } else {
            return oldData
          }
        })

        return { previousProducts, previousCategoryProducts }

      } catch (err) {
        console.log(err)
        throw new Error(`Hubo un error: ${err}`)
      }
    },
    onSuccess: () => {
      toast.success("Los productos fueron eliminados");
      queryClient.refetchQueries({ queryKey: ['all-products'] });
      queryClient.invalidateQueries({ queryKey: ['category-products'] });
      setProductsToDelete([] as unknown as Set<any>)
    },
    onError: async ({ error, context }: any) => {
      queryClient.setQueryData(['all-products'], context.previousProducts)
      queryClient.setQueryData(['category-products'], context.previousCategoryProducts)
      toast.error("Hubo un error al eliminar los productos")
      throw new Error(`Ocurrio un error: ${error}`)
    }

  })
  const onSubmit = () => {
    const productsToDeleteArray = Array.from(productsToDelete as Set<string>)
    mutate(productsToDeleteArray)
  }

  return (
    <div className="space-y-4 w-full max-w-xl mx-auto">

      <TypographyH1>Eliminar productos</TypographyH1>
      <div className="bg-[#ecefdc] relative">
        <Input onChange={search} placeholder="Busca por el nombre del producto" className="searchInput pl-8 border-gray-500! w-min" />
        <Search size={17} className="absolute top-[10px] left-2" />
      </div>


      {isLoading && !isError && <LoaderCircle size={30} className="animate-spin mx-auto" />}
      {!isLoading && isError && <p className="text-red-500">Hubo un error.</p>}
      {!isLoading && !isError && (
        <Table className="block h-[24rem] overflow-y-scroll border border-gray-500 rounded-sm w-full max-w-xl" >
          <TableHeader className="sticky top-0 shadow-sm bg-[#ecefdc] w-full">
            <TableRow>
              <TableHead className="w-[200px]">Nombre</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Categoria</TableHead>
            </TableRow>
          </TableHeader>


          <TableBody className="" ref={containerRef}>
            {results && results.length > 0 ? results?.map((p) => (
              <TableRow className="w-full" key={p.id}>

                <TableCell className="flex items-center gap-2 w-[200px]">
                  <Input
                    type="checkbox"
                    className="w-min productCheckbox"
                    onChange={() => onCheckBox(p.id as string)}
                  />
                  <NavLink
                    target="_blank"
                    to={`/producto/${p.id}`}
                    className="underline text-blue-500 flex items-center gap-1"
                  >
                    {p.product_name}
                    <ExternalLink size={20} />
                  </NavLink>
                </TableCell>
                <TableCell className="w-min">{p.product_price}</TableCell>
                <TableCell>{p?.product_category?.category_name}</TableCell>
              </TableRow>


            )) : <TableRow>
              <TableCell className="w-full">
                <h1 className="text-gray-600 py-2">No se pudieron encontrar productos por ese nombre</h1>
              </TableCell>
            </TableRow>}
          </TableBody>
        </Table>

      )}
      <Button
        variant="destructive"
        onClick={onSubmit}
        className="space-x-8 w-full"
        disabled={Array.from(productsToDelete as Set<string>).length < 1}>
        <Trash2 size={20} />
        Eliminar seleccionados
      </Button>





    </div>
  )
}

export default DeleteBulkProducts
