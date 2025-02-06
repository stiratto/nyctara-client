import { LazyLoadImage } from "react-lazy-load-image-component";
import { Input } from "../ui/input";
import { NavLink as Link } from "react-router-dom";
import categoriesApi from "@/api/categories/categories.api";
import { CategoryInterface } from "@/interfaces/Category.Interface";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle, MoveRight, Search } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

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
    <section>
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
          <section className="space-y-8">
            <h1 className="text-6xl">Actualizar categoria</h1>
            <div className="relative flex items-center">
              <Input onChange={handleValue} placeholder="Busca por el nombre del producto" className="searchInput pl-8 !border-gray-500 w-min" />
              <Search size={17} className="absolute top-[10px] left-2" />
            </div>
            <div className="flex flex-col gap-4 h-[30rem] max-h-[30rem] overflow-y-auto  border border-gray-500">
              {filteredResults?.map((category: CategoryInterface) => (
                <Link
                  to={`/admin/editar-categoria/${category.id}`}
                  key={category.id}
                  className="border-gray-500 border-b p-4 flex gap-2 items-center"
                >
                  <LazyLoadImage
                    src={category.image as string}
                    alt="Foto de la categoria"
                    effect="black-and-white"
                    className="w-16 h-16 rounded-xl"
                  />
                  <h3 className="text-2xl font-bold">{category.category_name}</h3>
                  <button className="rounded-full p-1">
                    <MoveRight size={20} />
                  </button>
                </Link>
              ))}
            </div>
          </section>
        )
      }

    </section>

  )
}
