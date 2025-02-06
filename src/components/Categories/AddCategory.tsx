import categoriesApi from "@/api/categories/categories.api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import queryClient from "@/main";
import { AddCategorySchema } from "@/schemas/AddCategorySchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { TypographyH2 } from "../Typography/h2";

interface Category {
  category_name: string;
  category_image: any;
}

const AddCategory = () => {
  const [categoryData, setData] = useState<Category>({
    category_name: "",
    category_image: [] as File[],
  });

  const { setValue, ...form } = useForm({
    resolver: yupResolver(AddCategorySchema),
    reValidateMode: "onChange",
  });

  const { mutate: MutateCategory } = useMutation({
    mutationFn: (data: FormData) => categoriesApi.CreateCategory(data),
    onMutate: async (data) => {
      const previousCategories = queryClient.getQueryData(['categories'])
      queryClient.setQueryData(['categories'], (oldData: Category[]) => {
        const product = {
          category_name: data.get('category_name'),
          category_image: categoryData.category_image[0]
        }

        return oldData ? [...oldData, product] : [product]
      })

      return { previousCategories }
    },
    onSuccess: () => {
      toast.success("La categoria fue creada");
      queryClient.refetchQueries({ queryKey: ["categories"] });
    },
    onError: (err: any, context: any) => {
      queryClient.setQueryData(['categories'], context.previousCategories)
      toast.error(err.message);
      console.error(err);
      throw err;
    },
  });

  const onSubmit: SubmitHandler<Category> = async (dataForm, e: any) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("category_name", dataForm.category_name);
      console.log(typeof categoryData.category_image)
      formData.append("category_image", categoryData.category_image);

      MutateCategory(formData);
    } catch (error: any) {
      toast.error(`Hubo un error al crear la categoria, ${error}`);
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files)
    if (e.target.files) {
      setData((prev) => ({
        ...prev,
        category_image: e?.target?.files && e.target.files[0],
      }));
    }
  };


  return (
    <Form {...form} setValue={setValue as any}>
      <form
        className="max-w-sm flex flex-col justify-center items-start gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <TypographyH2>Crear nueva categoria</TypographyH2>
        <span className="text-gray-600">Procura que sea una imagen con fondo transparente</span>

        {categoryData.category_image.length !== 0 && (
          <div>
            <img
              src={URL.createObjectURL(categoryData.category_image)}
              alt="Imagen de la categoria"
              className="rounded w-32 h-32 relative lg:w-52 lg:h-52 mx-auto object-contain"
            />

            <X onClick={() => setData((prev) => ({ ...prev, category_image: null }))} />
          </div>
        )}
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

        <FormField
          control={form.control}
          name="category_image"
          render={({ field }) => {
            const { value, ...fieldProps } = field; // Excluir `value`
            return (
              <FormItem>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    {...fieldProps}
                    onChangeCapture={handleImage}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

            )
          }}
        />

        <button
          type="submit"
          className="bg-black w-full text-white rounded-xl p-2"
        >
          Crear categoria
        </button>
      </form>
    </Form>
  );
};

export default AddCategory;
