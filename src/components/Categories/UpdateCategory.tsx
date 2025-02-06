import categoriesApi from "@/api/categories/categories.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { AddCategorySchema, TAddCategorySchema } from "@/schemas/AddCategorySchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { TypographyH1 } from "../Typography/h1";
import { zodResolver } from "@hookform/resolvers/zod";

const UpdateCategory = () => {
  const { id } = useParams();
  const [image, setImage] = useState<File | null>(null);

  const navigate = useNavigate();

  const form = useForm<TAddCategorySchema>({
    resolver: zodResolver(AddCategorySchema),
    reValidateMode: "onChange"
  })

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const getImagesPreview = () => {
    if (image) {
      const url = URL.createObjectURL(image);
      return url;
    }
  };

  useEffect(() => {
    getImagesPreview();
  }, [image]);

  const { data: category } = useQuery({
    queryKey: ["update-category"],
    queryFn: () => categoriesApi.GetCategoryById(id as string),
    enabled: !!id
  });


  const { mutate: mutationCategory } = useMutation({
    mutationFn: (body: any) => categoriesApi.UpdateCategory(body, id as string),
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

  const updateCategory: SubmitHandler<TAddCategorySchema> = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("category_name", category.category_name);
    formData.append("id", category.id);
    formData.append("image", category.image as File);

    mutationCategory(formData);
  };

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
                <Input placeholder="Categoria" {...field} value={category.category_name}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )} />


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
          <button type="submit">Finalizar</button>
        </form>
      </Form>
    </main>
  );
};

export default UpdateCategory
