import { LazyLoadImage } from "react-lazy-load-image-component";
import { Input } from "../ui/input";
import { NavLink as Link } from "react-router-dom";
import categoriesApi from "@/api/categories/categories.api";
import { CategoryInterface } from "@/interfaces/Category.Interface";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, LoaderCircle, MoveRight, Search } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export const UpdateCategoriesSelect = () => {

  const [query, setQuery] = useState('')
  const [filteredResults, setFilteredResults] = useState<CategoryInterface[]>([])

  let {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery<CategoryInterface[]>({
    queryKey: ["categories"],
    // Query key
    queryFn: async () => {
      const response = await categoriesApi.GetAllCategories()
      setFilteredResults(response)
      return response
    },

  });

  const handleValue = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const search = () => {
    let results = categories.filter((category) => category.category_name.toLowerCase().includes(query.toLowerCase()))
    setFilteredResults(results)

  }


  useEffect(() => {
    if (!query) {
      setFilteredResults(categories);
    }
  }, [categories, query]);

  useEffect(() => {
    search()
  }, [query])


  return (
    <section className="w-full">

      {isLoading && <LoaderCircle className="animate-spin my-8" />}
      {
        !isLoading && isError && (
          <p className="text-red-500 my-8">
            Ocurrio un error, no pudimos obtener las categorias
          </p>
        )
      }

      {
        !isLoading && !isError && filteredResults && (
          <section className="space-y-8 max-w-lg mx-auto">
            <h1 className="text-6xl">Actualizar categoria</h1>
            <div className="relative flex items-center">
              <Input onChange={handleValue} placeholder="Busca por el nombre de la categoria" className="searchInput pl-8 !border-gray-500 w-min" />
              <Search size={17} className="absolute top-[10px] left-2" />
            </div>
            <div className="flex flex-col gap-4 h-[30rem] max-h-[30rem] overflow-y-auto  border border-gray-500">
              <Table className="w-full">
                <TableHeader >
                  <TableRow>
                    <TableHead >Categoria</TableHead>
                    <TableHead >Fecha de creacion</TableHead>
                    <TableHead>Ultima vez actualizada</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((category) => (
                    <TableRow className="w-full ">
                      <TableCell className="w-full flex items-center gap-2">
                        <Link
                          key={category.id}
                          to={`/admin/editar-categoria/${category.id}`}
                          className="border-gray-500 w-full border-b p-4 flex gap-2 items-center text-blue-500 underline">

                          {category.category_name}
                          <ExternalLink size={20} />
                        </Link>
                      </TableCell>

                      <TableCell>
                        <p>
                          {new Date(category?.createdAt as string).toLocaleDateString()}
                        </p>
                      </TableCell>

                      <TableCell>
                        <p>
                          {new Date(category?.updatedAt as string).toLocaleDateString()}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))}

                </TableBody>
              </Table>
            </div>
          </section>
        )
      }

    </section>

  )
}
