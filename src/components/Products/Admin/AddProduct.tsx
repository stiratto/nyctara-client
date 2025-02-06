import categoriesApi from "@/api/categories/categories.api";
import productsApi from "@/api/products/products.api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CategoryInterface } from "@/interfaces/Category.Interface.ts";
import { Product, ProductQuality } from "@/interfaces/Product.Interface.ts";
import queryClient from "@/main";
import { TAddProductSchema, AddProductSchema } from "@/schemas/AddProductSchema";
import { RootState } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CloudUpload, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AddProduct = () => {
  const [product, setProduct] = useState<Product>({
    product_name: "",
    product_price: 0,
    tag: "",
    note: "",
    product_notes: [] as string[],
    product_tags: [] as string[],
    product_images: [] as (File | string)[],
    categories: [] as CategoryInterface[],
    product_category: {} as CategoryInterface,
    product_quality: "",
  });

  const [tempImagesUrl, setTempImagesUrl] = useState<string[]>([])

  const token = useSelector((state: RootState) => state.user?.token) as string;

  const form = useForm<TAddProductSchema>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: {
      product_tags: [],
      product_notes: [],
      product_images: []
    },

  });


  const removeImage = (index: number) => {
    try {
      setProduct((prev: Product) => {
        const updatedImages = prev?.product_images?.filter((_, i) => i !== index) as File[] || []
        form.setValue("product_images", updatedImages, { shouldDirty: true, shouldValidate: true })
        return {
          ...prev,
          product_images: updatedImages
        }
      })
      const filteredImagesUrl = tempImagesUrl.filter((_, i) => i !== index)
      setTempImagesUrl(filteredImagesUrl)
    } catch (err) {
      console.log(err);
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = Array.from(e.target.files ?? []);
      setProduct((prev) => ({
        ...prev,
        product_images: [...(prev.product_images as File[]), ...files],
      }));

      form.setValue('product_images', [...(product.product_images as File[]), ...files], { shouldDirty: true, shouldValidate: true });
    } catch (err) {
      console.log(err);
    }
  };

  const getImagesPreview = () => {
    const objectUrls = (product.product_images || []).map((image: File | string) => {
      if (image instanceof File) {
        return URL.createObjectURL(image)
      }

      return image
    })
    setTempImagesUrl(objectUrls)

  };

  const deleteItem = (index: number, state: "product_notes" | "product_tags") => {
    const newState = product[state].filter((_, i) => i !== index)
    form.setValue(state, newState, { shouldValidate: true, shouldDirty: true })
    setProduct((prev) => ({ ...prev, [state]: newState }))
  };

  const { data: categories } = useQuery<CategoryInterface[]>({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.GetAllCategories(),
    initialData: () => queryClient.getQueryData<any>(["categories"]).data || [],
    enabled: false,
    retry: 3,
  });

  const { mutate: createProduct } = useMutation({
    mutationFn: (data: any) => productsApi.CreateProduct(data, token),
    onMutate: () => {
      queryClient.invalidateQueries({ queryKey: ["category-products"] });
      const previousProducts = queryClient.getQueryData<Product[]>(["category-products"])
      return { previousProducts }
    },
    onSuccess: () => toast.success("Producto creado exitosamente"),
    onError: (error: any, context) => {
      queryClient.setQueryData(["category-products"], context.previousProducts)
      toast.success("Hubo un error al tratar de crear el producto");
      throw new Error(`Hubo un error! ${error}`);
    },
  });


  const onSubmit: SubmitHandler<TAddProductSchema> = async (data, e: any) => {
    e.preventDefault();
    try {
      toast.success("Agregando producto...");
      const formData = new FormData();
      formData.append("product_name", data.product_name);
      formData.append("product_price", data.product_price.toString());
      formData.append("product_description", data.product_description);
      formData.append("product_quality", data.product_quality);

      let product_category = {
        category_name: data.product_category
      }

      formData.append("product_category", JSON.stringify(product_category));

      product?.product_tags?.forEach((tag: string) => {
        formData.append("product_tags[]", tag);
      });

      product.product_notes?.forEach((note: string) => {
        formData.append("product_notes[]", note);
      });
      product.product_images?.forEach((image: any) => {
        formData.append("product_images", image);
      });

      createProduct(formData);
    } catch (err) {
      toast.error("Hubo un error, verifica los campos");
      throw new Error("Hubo un error" + err);
    }


  };

  useEffect(() => {
    getImagesPreview();
    console.log(product.product_images)
  }, [product.product_images]);


  return (
    <section className="flex flex-col items-center justify-center py-24 px-4">
      <h1 className="text-3xl font-bold mb-8">Agregar producto</h1>
      <Form {...form}>
        <form
          className="flex flex-col justify-center w-full max-w-4xl gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >

          <FormField control={form.control} name="product_name" render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  placeholder="Nombre del producto"
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="product_description" render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  className="bg-transparent w-full"
                  placeholder="Descripcion"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="product_price" render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  {...field}

                  placeholder="Precio del producto"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />



          <FormField
            control={form.control}
            name="product_quality"
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                className="w-full flex items-center justify-center"
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
                  <SelectContent>
                    {categories?.map((category: any) => (
                      <SelectItem key={category.id} value={category.category_name}>{category.category_name}</SelectItem>
                    ))}
                  </SelectContent>
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
                {product.product_images && product?.product_images?.length > 0
                  ? (
                    tempImagesUrl.length >= 1 && tempImagesUrl.map((imageUrl: any, index: any) => (
                      <div key={index}
                      >
                        <img
                          src={imageUrl as string}
                          alt="Imagen del producto"
                          className="w-32 h-32 object-cover rounded-xl"
                        />
                        <button
                          className="bg-red-500 text-white p-1 rounded-full relative bottom-32 left-24"
                          type="button"
                          onClick={() => removeImage(index)}
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ))
                  )
                  : (
                    <div>
                      <p className="text-sm placeholder-gray-500">
                        Aquí se mostrarán las imagenes que selecciones...
                      </p>
                    </div>
                  )}
              </div>
            </div>

            <FormField control={form.control} name="product_images" render={({ field }) => (
              <FormItem>
                <label className="flex flex-col items-center justify-center w-full h-32 border border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-300">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 ">
                    <CloudUpload size={40} />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 font-semibold">Click para subir una imagen </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <FormControl>
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      {...field}
                      onChange={handleImage}
                      value=""
                      id="product_file"
                    />
                  </FormControl>
                </label>
                <FormMessage />
              </FormItem>
            )} />

          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="space-y-4 border p-2 border-black rounded-xl w-full">
              <FormField control={form.control} name="product_tags" render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Etiqueta"
                        value={product.tag}
                        onChange={(e) => setProduct((prev) => ({ ...prev, tag: e.target.value }))}
                      />
                      <Button
                        type="button"
                        className="bg-black"
                        onClick={() => {
                          if (product?.tag?.trim() === "") return;

                          const newTags = [...field.value, product.tag] as string[]; // Agrega la nueva etiqueta
                          form.setValue("product_tags", newTags, { shouldValidate: true, shouldDirty: true }); // Actualiza el formulario
                          setProduct((prev) => ({ ...prev, product_tags: newTags, tag: "" })); // Limpia el input
                        }}
                      >
                        Añadir tag
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Lista de tags */}
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {product.product_tags.map((tag, index) => (
                  <Badge
                    key={index}
                    className="bg-gray-700 w-fit relative z-20"
                  >
                    {tag}

                    <button
                      type="button"
                      className="bg-red-500 absolute -top-2 -right-2 z-50 w-fit p-1 rounded-full"
                      onClick={() => deleteItem(index, "product_tags")}
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
                          name="notes"
                          type="text"
                          placeholder="Escribe una nota"
                          value={product.note}
                          onChange={(e) =>
                            setProduct((prev) => ({
                              ...prev,
                              note: e.target.value,
                            }))
                          }
                        />

                        <Button
                          type="button"
                          className="bg-black"
                          onClick={() => {
                            if (product?.note?.trim() === "") return;
                            let newNotes = [...field.value, product.note] as string[];
                            form.setValue("product_notes", newNotes, { shouldValidate: true, shouldDirty: true });
                            setProduct((prev) => ({
                              ...prev,
                              product_notes: newNotes,
                              note: "",
                            }));
                          }}
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
                {product?.product_notes?.map((note, index) => (
                  <Badge
                    key={index}
                    className="bg-gray-700 w-fit relative z-20"
                  >
                    {note}

                    <button
                      type="button"
                      className="bg-red-500 absolute -top-2 -right-2 z-50 w-fit p-1 rounded-full"
                      onClick={() => deleteItem(index, "product_notes")}
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
          >Añadir producto</Button>
        </form>
      </Form>
    </section >
  );
};

export default AddProduct;
