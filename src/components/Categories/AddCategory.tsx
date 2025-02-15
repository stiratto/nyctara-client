import categoriesApi from "@/api/categories/categories.api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import queryClient from "@/main";
import { AddCategorySchema, TAddCategorySchema } from "@/schemas/AddCategorySchema";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { TypographyH2 } from "../Typography/h2";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Category } from "@/interfaces/Category.Interface";

const AddCategory = () => {
  const form = useForm<TAddCategorySchema>({
    resolver: zodResolver(AddCategorySchema),
    reValidateMode: "onChange",
  });

  const { isPending: isCreatingCategory, mutate: MutateCategory } = useMutation({
    mutationFn: (data: Category) => categoriesApi.CreateCategory(data),
    onMutate: async (data) => {
      const previousCategories = queryClient.getQueryData(['categories'])

      queryClient.setQueryData(['categories'], (oldData: Category[]) => oldData ? [...oldData, data] : [data])

      return { previousCategories }
    },
    onSuccess: () => {
      toast.success("La categoria fue creada");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err: any, _, context: any) => {
      queryClient.setQueryData(['categories'], context.previousCategories)
      toast.error(err.message);
      throw Error(err.message);
    },
  });

  const onSubmit: SubmitHandler<TAddCategorySchema> = async (data, e: any) => {
    e.preventDefault();
    try {
      const category = {
        category_name: data.category_name
      }
      MutateCategory(category);
    } catch (error: any) {
      toast.error(`Hubo un error al crear la categoria, ${error.message}`);
    }
  };
  return (
    <Form {...form} >
      <form
        className="flex flex-col items-start gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <TypographyH2>Crear nueva categoria</TypographyH2>

        <FormField
          control={form.control}
          name="category_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la categoria/marca</FormLabel>

              <FormControl>
                <Input placeholder="Categoria" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="bg-black w-full text-white rounded-xl p-2 flex gap-2 items-center"
        >

          Crear categoria
          {isCreatingCategory && <Loader2 className="animate-spin" />}
        </Button>
      </form>
    </Form>
  );
};

export default AddCategory;
