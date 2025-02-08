import productsApi from "@/api/products/products.api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormMessage, FormControl, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ProductQuality } from "@/interfaces/Product.Interface";
import { EditProductSchema, TEditProductSchema } from "@/schemas/EditProductShema";
import { RootState } from "@/store/store.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CloudUpload, LoaderCircle, X } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import categoriesApi from "@/api/categories/categories.api";
import { Badge } from "@/components/ui/badge";

const EditProduct = () => {
  const id = useParams().id;

  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.token) as string;

  const form = useForm<TEditProductSchema>({
    resolver: zodResolver(EditProductSchema),
    reValidateMode: "onChange",
    defaultValues: {
      product_images: [],
      tag: "",
      note: ""
    }
  });

  let [
    tag,
    note,
    product_tags,
    product_notes,
    product_name,
    product_price,
    product_quality,
    product_images,
    product_category,
  ] = form.watch([
    "tag",
    "note",
    "product_tags",
    "product_notes",
    "product_name",
    "product_price",
    "product_quality",
    "product_images",
    "product_category",
  ]);

  const [urls, setUrls] = useState<string[]>()


  const handleValue = (e: any) => {
    form.setValue(e.target.name, e.target.value, { shouldValidate: true })
  };


  const deleteImage = (index, id) => {
    // eliminar imagenes de product_images y updatear
    // unas imagenes pueden ser string y otras pueden ser de tipo File
    // (las que el usuario acaba de seleccionar)
    // las que son string son las que ya existen
    const imageToDelete = product_images.find((_, i) => i === index) as string
    if (typeof imageToDelete === "string") {
      // extraer el nombre del archivo del url
      const regex = /\/([^/]+\.webp)/
      const match = imageToDelete.match(regex)
      const filename = match[1]
      mutation.mutate({ id, image: filename })
    }
    const newImages = product_images.filter((_, i) => i !== index)
    form.setValue('product_images', newImages)
  }


  const { isLoading: isGettingProducts, data: product } = useQuery({
    queryKey: ["productToEdit", id],
    queryFn: () => productsApi.GetProductById(id as string)
  });

  const deleteImageFromProduct = ({ id, image }: { id: string, image: string }) => {
    return productsApi.DeleteProductImage(id, image, token)
  }

  const mutation = useMutation({
    mutationFn: deleteImageFromProduct
  });

  const { isLoading: categoriesIsLoading, isError: categoriesIsError, data: categories } = useQuery({
    queryKey: ["categories", id],
    queryFn: () => categoriesApi.GetAllCategories()

  });

  const { mutate: editProduct } = useMutation({
    mutationFn: (data: FormData) => productsApi.EditProduct(product?.id as string, data),
    onSuccess: () => {
      toast.success("Producto editado con exito, redireccionando...", { duration: 5000 })
      setTimeout(() => {
        navigate(`/producto/${id}`);
        window.location.reload()
      }, 5000)
    }
  })

  const getImagesPreview = () => {
    const images = form.getValues("product_images")
    const imageUrls = (images as any)?.map((image, _) => {
      if (typeof image === "string") {
        return image;
      } else {
        const url = URL.createObjectURL(image);
        return url;
      }
    });

    setUrls(imageUrls)
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = Array.from(e.target.files ?? []);
      form.setValue('product_images', [...(product_images as File[]), ...files], { shouldDirty: true, shouldValidate: true });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (product) {
      form.reset({
        product_name: product?.product_name,
        product_price: product?.product_price,
        product_description: product?.product_description,
        product_quality: product?.product_quality as any,
        product_images: product?.product_images,
        product_category: product?.product_category?.category_name,
        product_tags: product?.product_tags,
        product_notes: product?.product_notes,
        tag: "",
        note: "",
      })
    }

  }, [product, form])



  useEffect(() => {
    if (Array.isArray(product_images) && product_images?.length > 0) {
      getImagesPreview();
    }
  }, [form.getValues('product_images')]);



  const onSubmit: SubmitHandler<TEditProductSchema> = async (data, e) => {
    e?.preventDefault();
    try {
      const formData = new FormData();
      formData.append("product_name", data?.product_name as string);
      formData.append("product_price", data?.product_price?.toString() as string);
      formData.append("product_description", data.product_description as string);
      formData.append("product_quality", data.product_quality as string);
      const category = {
        category_name: data.product_category
      }

      formData.append("product_category", JSON.stringify(category));

      data?.product_tags?.forEach((tag) => {
        formData.append("product_tags[]", tag);
      });

      data?.product_notes?.forEach((note) => {
        formData.append("product_notes[]", note);
      });

      data?.product_images?.forEach((image: string | File) => {
        if (typeof image === "string") {
          formData.append("existingImages[]", image);
        } else if (image instanceof File) {
          formData.append("newImages[]", image);
        }
      });


      editProduct(formData)

    } catch (err: any) {
      console.log(err);
      if (err instanceof Error) {
        console.log(err);
        toast.error("No se pudo actualizar el producto", {
          duration: 3000,
          description: err.message,
          dismissible: true,
        });
      }
    }
  };



  return (
    <div
      className={`flex flex-col items-center justify-center w-full max-w-xl mx-auto  py-[6em]`}
    >
      {isGettingProducts && <LoaderCircle className="h-screen animate-spin" size={40} />}


      {!isGettingProducts && (
        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField control={form.control} name="product_name" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    onChange={handleValue}
                    value={field?.value}
                    className=""
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
                    onChange={handleValue}
                    value={field?.value}
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
                  value={field?.value}

                >
                  {Object.values(ProductQuality).map((item: any) => (
                    <FormItem key={item} className="flex items-center gap-2">
                      <FormControl>
                        <RadioGroupItem value={item} />
                      </FormControl>
                      <FormLabel>{item}</FormLabel>
                      <FormMessage />
                    </FormItem>
                  ))}
                </RadioGroup>
              )}
            />


            <FormField control={form.control} name="product_description" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    className="bg-transparent"
                    onChange={handleValue}
                    value={field?.value}
                    placeholder="Descripcion"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />


            <FormField
              control={form.control}
              name="product_category"
              render={({ field }) => (
                <FormItem>
                  <Select value={field?.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category: any) => (
                        <SelectItem key={category.id} value={category.category_name}>
                          {category.category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label htmlFor="image" className="text-xl font-bold">
                Imagenes del producto
              </label>
              <div className="flex flex-wrap  gap-4 py-2">
                {urls && urls.map((url, index) => (
                  <div key={index}>
                    <img
                      src={url as string}
                      alt="Imagen del producto"
                      className="w-32 h-32 rounded-xl"
                    />
                    {product_images.length > 1 && (
                      <button
                        className=" rounded-full py-1 px-2 relative bottom-[123px] left-[89px] bg-red-500 text-white"
                        type="button"
                        onClick={() => deleteImage(index, id)}
                      >
                        <X size={15} />
                      </button>
                    )}

                  </div>
                ))}
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
                    />
                  </FormControl>
                </label>
                <FormMessage />
              </FormItem>
            )} />


            <FormField control={form.control} name="product_tags" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      className=""
                      onChange={handleValue}
                      name="tag"
                      placeholder="Etiquetas del producto"
                    />

                    <Button
                      type="button"
                      className="bg-black"
                      onClick={() => {
                        let tagStr = tag as string
                        if (tagStr?.trim() === "") return
                        const newTags = [...(product_tags as string[]), tagStr] as string[]
                        form.setValue('product_tags', newTags)
                        form.setValue('tag', "")
                      }}
                    >
                      Añadir tag
                    </Button>

                  </div>

                </FormControl>
              </FormItem>
            )} />


            <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.isArray(product_tags) && product_tags.map((tag, index) => (
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




            <FormField control={form.control} name="product_notes" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      name="note"
                      type="text"
                      placeholder="Notas del producto"
                      onChange={handleValue}
                      value={note as string}
                    />

                    <Button
                      className="bg-black"
                      type="button"
                      onClick={() => {
                        let noteStr = note as string
                        if (noteStr?.trim() === "") return
                        const newNotes = [...(product_notes as string[]), noteStr] as string[]
                        form.setValue('product_notes', newNotes)
                        form.setValue('note', "")
                      }}
                    >
                      Añadir nota
                    </Button>

                  </div>
                </FormControl>
              </FormItem>
            )} />
            <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.isArray(product_notes)
                && product_notes.map((note, index) => (
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
            <button
              type="submit"
              className="self-start border border-black p-2 w-full max-w-sm rounded-xl bg-black text-white"
            >
              Editar producto
            </button>
          </form>

        </Form >

      )
      }

    </div >
  );
};

export default memo(EditProduct);
