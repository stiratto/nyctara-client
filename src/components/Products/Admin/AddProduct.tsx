import categoriesApi from "@/api/categories/categories.api";
import productsApi from "@/api/products/products.api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Category } from "@/interfaces/Category.Interface.ts";
import { Product, ProductQuality } from "@/interfaces/Product.Interface.ts";
import queryClient from "@/main";
import {
  TAddProductSchema,
  AddProductSchema,
} from "@/schemas/AddProductSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CloudUpload, X } from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getImagesPreview } from "@/utils/utils";
import { useFormActions } from "@/hooks/useFormActions";
import { FormFieldWrapper } from "@/components/Other/FormFieldWrapper";

const AddProduct = () => {
  const [tempImagesUrls, setTempImagesUrls] = useState<string[]>([]);
  const form = useForm<TAddProductSchema>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: {
      product_tags: [],
      product_notes: [],
      product_images: [],
    },
  });

  const product_notes = form.getValues("product_notes");
  const product_images = form.getValues("product_images");
  const product_tags = form.getValues("product_tags");

  const { addItemToFormState, deleteItemFromFormState, handleImageChangeForm } =
    useFormActions(form);

  const handleValue = (e: ChangeEvent<HTMLInputElement>) => {
    form.setValue(e.target.name as keyof TAddProductSchema, e.target.value, {
      shouldValidate: true,
    });
  };

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.GetAllCategories(),
    retry: 3,
  });

  const { isPending: isCreatingProduct, mutate: createProduct } = useMutation({
    mutationFn: (data: any) => productsApi.CreateProduct(data),
    onMutate: () => {
      queryClient.invalidateQueries({ queryKey: ["category-products"] });
      const previousProducts = queryClient.getQueryData<Product[]>([
        "category-products",
      ]);
      return { previousProducts };
    },
    onSuccess: () => toast.success("Producto creado exitosamente"),
    onError: (error: any, context) => {
      queryClient.setQueryData(["category-products"], context.previousProducts);
      toast.success("Hubo un error al tratar de crear el producto");
      throw new Error(`Hubo un error! ${error}`);
    },
  });

  const onSubmit: SubmitHandler<TAddProductSchema> = (data, e) => {
    e?.preventDefault();
    try {
      toast.success("Agregando producto...");
      const formData = new FormData();

      formData.append("product_name", data.product_name);
      formData.append("product_price", data.product_price.toString());
      formData.append("product_description", data.product_description);
      formData.append("product_quality", data.product_quality);

      let product_category = {
        category_name: data.product_category,
      };

      formData.append("product_category", JSON.stringify(product_category));

      data.product_tags?.forEach((tag: string) => {
        formData.append("product_tags[]", tag);
      });

      data.product_notes?.forEach((note: string) => {
        formData.append("product_notes[]", note);
      });

      data.product_images?.forEach((image: any) => {
        formData.append("product_images", image);
      });

      createProduct(formData);
    } catch (err) {
      toast.error("Hubo un error, verifica los campos");
      throw new Error("Hubo un error" + err);
    }
  };

  // Memoize the categories to avoid unnecesary re-renders when
  // interacting with the form inputs
  const memoizedCategories = useMemo(() => {
    return categories?.map((category) => {
      return (
        <SelectItem key={category.id} value={category.category_name}>
          {category.category_name}
        </SelectItem>
      );
    });
  }, [categories]);

  // Each time product_images in the form changes, we get the URL of
  // each image to display the preview
  useEffect(() => {
    const newImages = getImagesPreview(product_images);
    setTempImagesUrls(newImages);
  }, [product_images]);

  return (
    <section className="flex flex-col   items-center justify-center py-24 px-4">
      <h1 className="text-3xl font-bold mb-8">Agregar producto</h1>
      <Form {...form}>
        <form
          className="flex flex-col justify-center w-full max-w-4xl gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormFieldWrapper
            name="product_name"
            label="Nombre del producto"
            placeholder="Nombre del producto"
            form={form}
          />

          <FormFieldWrapper
            name="product_description"
            label="product_description"
            placeholder="Descripcion del producto"
            textarea
            form={form}
          />
          <FormFieldWrapper
            name="product_price"
            label="Precio del producto"
            placeholder="Precio del producto"
            type={"number"}
            form={form}
          />

          <FormField
            control={form.control}
            name="product_quality"
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                className="w-full flex flex-col"
              >
                {Object.values(ProductQuality).map((item: any) => (
                  <FormItem key={item} className="flex items-center gap-2">
                    <FormControl>
                      <RadioGroupItem value={item} />
                    </FormControl>
                    <FormLabel>{item}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            )}
          />

          <FormField
            control={form.control}
            name="product_category"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>{memoizedCategories}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col justify-center gap-8">
            <div className="flex flex-col gap-4">
              <label htmlFor="image" className="text-xl font-bold">
                Imagenes del producto
              </label>
              <div className="flex gap-4">
                {product_images?.length > 0 ? (
                  tempImagesUrls?.length >= 1 &&
                  tempImagesUrls?.map((imageUrl: any, index: any) => (
                    <div key={index}>
                      <img
                        src={imageUrl as string}
                        alt="Imagen del producto"
                        className="w-32 h-32 object-cover rounded-xl"
                      />
                      <button
                        className="bg-red-500 text-white p-1 rounded-full relative bottom-32 left-24"
                        type="button"
                        onClick={() =>
                          deleteItemFromFormState(index, "product_images")
                        }
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div>
                    <p className="text-sm  text-gray-500">
                      Aquí se mostrarán las imagenes que selecciones...
                    </p>
                  </div>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="product_images"
              render={({ field }) => (
                <FormItem>
                  <label className="flex flex-col items-center justify-center w-full h-32 border border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-300">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 ">
                      <CloudUpload size={40} />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 font-semibold">
                        Click para subir una imagen{" "}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <FormControl>
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        {...field}
                        onChange={handleImageChangeForm}
                        value=""
                      />
                    </FormControl>
                  </label>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="space-y-4 border p-2 border-black rounded-xl w-full">
              <FormField
                control={form.control}
                name="product_tags"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Etiqueta"
                          name="tag"
                          onChange={handleValue}
                        />
                        <Button
                          type="button"
                          className="bg-black"
                          onClick={() =>
                            addItemToFormState("product_tags", field)
                          }
                        >
                          Añadir tag
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Lista de tags */}
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {product_tags.map((tag, index) => (
                  <Badge
                    key={index}
                    className="bg-gray-700 w-fit relative z-20"
                  >
                    {tag}

                    <button
                      type="button"
                      className="bg-red-500 absolute -top-2 -right-2 z-50 w-fit p-1 rounded-full"
                      onClick={() =>
                        deleteItemFromFormState(index, "product_tags")
                      }
                    >
                      <X size={12} color="white" />
                    </button>
                  </Badge>
                ))}
              </ul>
            </div>

            <div className="space-y-4 border p-2 border-black rounded-xl w-full">
              <FormField
                control={form.control}
                name="product_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          name="note"
                          type="text"
                          placeholder="Escribe una nota"
                          onChange={handleValue}
                        />

                        <Button
                          type="button"
                          className="bg-black"
                          onClick={() =>
                            addItemToFormState("product_notes", field)
                          }
                        >
                          Añadir nota
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {product_notes?.map((note, index) => (
                  <Badge
                    key={index}
                    className="bg-gray-700 w-fit relative z-20"
                  >
                    {note}

                    <button
                      type="button"
                      className="bg-red-500 absolute -top-2 -right-2 z-50 w-fit p-1 rounded-full"
                      onClick={() =>
                        deleteItemFromFormState(index, "product_notes")
                      }
                    >
                      <X size={12} color="white" />
                    </button>
                  </Badge>
                ))}
              </ul>
            </div>
          </div>
          <Button
            type="submit"
            className="border rounded-xl w-full p-2 border-black hover:cursor-pointer"
            disabled={isCreatingProduct}
          >
            Añadir producto
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default AddProduct;
