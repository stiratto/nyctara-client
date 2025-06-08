import { Input } from "../ui/input";
import categoriesApi from "@/api/categories/categories.api";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { ChangeEvent, useMemo, useState } from "react";
import { TypographyH3 } from "../Typography/h3";
import { CategoryTable } from "./CategoryTable";
import { Category } from "@/interfaces/Category.Interface";

export const UpdateCategoriesSelect = () => {
  const [query, setQuery] = useState("");

  let {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoriesApi.GetAllCategories();
      return response;
    },
  });

  const handleValue = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const filteredResults = useMemo(() => {
    return categories.filter((category) =>
      category.category_name.toLowerCase().includes(query.toLowerCase())
    );
  }, [categories, query]);

  return (
    <section className="w-full">
      <TypographyH3>Actualizar categoria</TypographyH3>
      <div className="relative flex items-center mb-8">
        <Input
          onChange={handleValue}
          placeholder="Busca por el nombre de la categoría"
          className="pl-8 w-fit"
        />
        <Search size={17} className="absolute top-[10px] left-2" />
      </div>
      <CategoryTable
        isLoading={isLoading}
        isError={isError}
        filteredResults={filteredResults}
      />
    </section>
  );
};
