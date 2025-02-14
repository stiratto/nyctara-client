import categoriesApi from "@/api/categories/categories.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { AddCategorySchema, TAddCategorySchema } from "@/schemas/AddCategorySchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { TypographyH1 } from "../Typography/h1";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryInterface } from "@/interfaces/Category.Interface";

const UpdateCategory = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const form = useForm<TAddCategorySchema>({
    resolver: zodResolver(AddCategorySchema),
    reValidateMode: "onChange"
  })

  const { data: category } = useQuery<CategoryInterface>({
    queryKey: ["update-category"],
    queryFn: () => categoriesApi.GetCategoryById(id as string),
    enabled: !!id
  });


  const { mutate: mutationCategory } = useMutation({
    mutationFn: (data: CategoryInterface) => categoriesApi.UpdateCategory(data),
    onSuccess: () => {
      toast.success("La categoria fue actualizada");
      setTimeout(() => {
        navigate("/admin/admin-panel");
      }, 2000);
    },
    onError: (error) => {
      console.log(error);
      throw new Error(`Hubo un error al actualizar la categoria ${error}`);
    },
  });

  const updateCategory: SubmitHandler<TAddCategorySchema> = async (data, e: any) => {
    e.preventDefault();

    try {
      const categoryToSend = {
        id: (category?.id as string),
        category_name: data?.category_name
      }

      mutationCategory(categoryToSend);
    } catch (error: any) {
      console.log(error)
    }


  };

  useEffect(() => {
    form.reset({
      category_name: category?.category_name
    })
  }, [form, category])

  return (
    <main className="h-auto sm:h-screen py-24 px-8 md:px-24 flex items-center justify-center">
      <TypographyH1>Actualizar categoria</TypographyH1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(updateCategory)}
          className="flex flex-col sm:max-w-lg  mx-auto justify-center items-center gap-8"
        >
          <FormField control={form.control} name="category_name" render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la categoria/marca</FormLabel>
              <FormControl>
                <Input placeholder="Categoria" {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )} />

          <button type="submit">Finalizar</button>
        </form>
      </Form>
    </main>
  );
};

export default UpdateCategory
