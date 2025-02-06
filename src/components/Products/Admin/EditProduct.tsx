import productsApi from "@/api/products/products.api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormMessage, FormControl, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Product, ProductQuality } from "@/interfaces/Product.Interface";
import { EditProductSchema, TEditProductSchema } from "@/schemas/EditProductShema";
import { RootState } from "@/store/store.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CloudUpload, LoaderCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import categoriesApi from "@/api/categories/categories.api";
import { CategoryInterface } from "@/interfaces/Category.Interface";
import { Badge } from "@/components/ui/badge";

const EditProduct = () => {
  const id = useParams().id;

  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.token) as string;

  const [tempProductState, setTempProductState] = useState<Product>({
    product_name: "",
    product_price: 0,
    product_tags: [],
    tag: "",
    product_notes: [],
    note: "",
    product_quality: "",
    product_images: [],
    product_category: {
      id: "",
      category_name: ""
    }
  })

  const handleValue = (e: any) => {
    form.setValue(e.target.name, e.target.value, { shouldValidate: true })
    setTempProductState({
      ...tempProductState,
      [e.target.name]: e.target.value,
    });
  };


  const { isLoading, isError, data } = useQuery({
    queryKey: ["productToEdit", id],
    queryFn: async () => {
      const response = await productsApi.GetProductById(id as string)
      setTempProductState(response)
      return response
    }

  });

  const { mutate: deleteImageFromProduct } = useMutation({
    mutationFn: ({ id, image }: { id: string; image: string }) => {
      return productsApi.DeleteProductImage(id, image, token);
    },
    onError: (error) => {
      console.error("Error al eliminar la imagen:", error);
    },
  });



  const { isLoading: categoriesIsLoading, isError: categoriesIsError, data: categories } = useQuery({
    queryKey: ["categories", id],
    queryFn: () => categoriesApi.GetAllCategories()

  });

  const form = useForm<TEditProductSchema>({
    resolver: zodResolver(EditProductSchema),
    reValidateMode: "onChange",
    defaultValues: {
      product_images: []
    }
  });


  useEffect(() => {
    if (data) {
      form.reset({
        product_name: tempProductState.product_name,
        product_price: tempProductState.product_price,
        product_description: tempProductState.product_description,
        product_quality: tempProductState.product_quality,
        product_images: tempProductState.product_images,
        product_tags: tempProductState.product_tags,
        product_notes: tempProductState.product_notes,
      })
    }
  }, [data, form])

  const getImagesPreview = () => {
    const imageUrls = tempProductState?.product_images?.map((image, _) => {
      if (typeof image === "string") {
        return image;
      } else {
        const url = URL.createObjectURL(image);
        return url;
      }
    });

    setTempProductState((prevState) => ({
      ...prevState,
      product_images: imageUrls,
    }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = Array.from(e.target.files ?? []);
      setTempProductState((prev) => ({
        ...prev,
        product_images: [...(prev.product_images as File[]), ...files],
      }));

      form.setValue('product_images', [...(tempProductState.product_images as File[]), ...files], { shouldDirty: true, shouldValidate: true });
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    if (tempProductState.product_images && tempProductState?.product_images?.length > 0) {
      getImagesPreview();
    }
  }, [tempProductState.product_images]);



  const onSubmit: SubmitHandler<TEditProductSchema> = async (data, e) => {
    e?.preventDefault();
    console.log(tempProductState)
    try {
      const formData = new FormData();
      formData.append("product_name", tempProductState?.product_name as string);
      formData.append("product_price", tempProductState?.product_price?.toString() as string);
      formData.append("product_description", tempProductState.product_description as string);
      formData.append("product_quality", tempProductState.product_quality as string);

      formData.append("product_category", JSON.stringify(tempProductState.product_category));

      tempProductState?.product_tags?.forEach((tag) => {
        formData.append("product_tags[]", tag);
      });

      tempProductState?.product_notes?.forEach((note) => {
        formData.append("product_notes[]", note);
      });

      tempProductState?.product_images?.forEach((image: string | File) => {
        if (typeof image === "string") {
          formData.append("existingImages[]", image);
        } else if (image instanceof File) {
          formData.append("newImages[]", image);
        }
      });


      navigate(`/producto/${id}`);
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
      {isLoading ? <LoaderCircle /> : ""}

      <Form {...form}>
        <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField control={form.control} name="product_name" render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  onChange={handleValue}
                  value={tempProductState.product_name}
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
                  value={tempProductState.product_price}
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
                defaultValue={tempProductState?.product_quality}
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
                  value={tempProductState.product_description}
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
                <Select onValueChange={field.onChange} defaultValue={tempProductState.product_category.category_name}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.category_name}>{category.category_name}</SelectItem>
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
              {tempProductState?.product_images && tempProductState?.product_images?.length > 0
                && tempProductState.product_images.map((url, index) => (
                  <div key={index}>
                    <img
                      src={url}
                      alt="Imagen del producto"
                      className="w-32 h-32 rounded-xl"
                    />
                    <button
                      className=" rounded-full py-1 px-2 relative bottom-[123px] left-[89px] bg-red-500 text-white"
                      type="button"
                      onClick={() => deleteImage(index, id)}
                    >
                      <X size={15} />
                    </button>
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
                    onChange={(e) => setTempProductState(prev => ({ ...prev, tag: e?.target?.value }))}
                    placeholder="Etiquetas del producto"
                  />

                  <Button
                    type="button"
                    className="bg-black"
                    onClick={() => {

                      if (tempProductState?.tag?.trim() === "") return;

                      const newTags = [...tempProductState.product_tags, tempProductState.tag]
                      form.setValue('product_tags', newTags as string[])
                      setTempProductState((prev) => ({
                        ...prev,
                        product_tags: newTags,
                        tag: ""
                      }))
                    }}
                  >
                    Añadir tag
                  </Button>

                </div>

              </FormControl>
            </FormItem>
          )} />


          <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.isArray(tempProductState?.product_tags) && tempProductState?.product_tags.map((tag, index) => (
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
                    value={tempProductState.note}
                    onChange={handleValue}
                  />

                  <Button
                    className="bg-black"
                    type="button"
                    onClick={() => {
                      if (tempProductState?.note?.trim() === "") return

                      const newNotes = [...tempProductState.product_notes, tempProductState.note] as string[]

                      setTempProductState((prev) => ({
                        ...prev,
                        product_notes: newNotes,
                        note: ""
                      }))
                    }}
                  >
                    Añadir nota
                  </Button>

                </div>
              </FormControl>
            </FormItem>
          )} />
          <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.isArray(tempProductState?.product_notes)
              && tempProductState?.product_notes.map((note, index) => (
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

    </div >
  );
};

export default EditProduct;
