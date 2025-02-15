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
import { Textarea } from "@/components/ui/textarea";
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
import { ChangeEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getImagesPreview } from "@/utils/utils";

const AddProduct = () => {
  const [tempImagesUrl, setTempImagesUrl] = useState<string[]>([]);
  const [tag, setTag] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const form = useForm<TAddProductSchema>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: {
      product_tags: [],
      product_notes: [],
      product_images: [],
    },
  });

  const productImages = form.getValues("product_images");

  const removeImage = (index: number) => {
    try {
      const prevImages = form.getValues("product_images");
      const updatedImages = prevImages.filter((_, i) => i !== index);
      form.setValue("product_images", updatedImages, { shouldValidate: true });
      const filteredImagesUrl = tempImagesUrl.filter((_, i) => i !== index);
      setTempImagesUrl(filteredImagesUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const handleValue = (e: any) => {
    if (e.target.name === "tag") {
      setTag(e.target.value);
      return;
    } else if (e.target.name === "note") {
      setNote(e.target.value);
      return;
    }

    form.setValue(e.target.name, e.target.value, { shouldValidate: true });
  };

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const prevImages = form.getValues("product_images");
      const files = [...prevImages, e?.target?.files?.[0]] as any;
      form.setValue("product_images", files, { shouldValidate: true });
    } catch (err) {
      console.log(err);
    }
  };

  const handleImagesPreview = () => {
    const objectUrls = getImagesPreview(productImages);
    setTempImagesUrl(objectUrls);
  };

  const deleteItem = (
    index: number,
    state: "product_notes" | "product_tags"
  ) => {
    const newState = form.getValues(state).filter((_, i) => i !== index);
    form.setValue(state, newState, { shouldValidate: true, shouldDirty: true });
  };

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.GetAllCategories(),
    retry: 3,
  });

  const { mutate: createProduct } = useMutation({
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

  useEffect(() => {
    handleImagesPreview();
  }, [productImages]);

  return (
    <section className="flex flex-col   items-center justify-center py-24 px-4">
      <h1 className="text-3xl font-bold mb-8">Agregar producto</h1>
      <Form {...form}>
        <form
          className="flex flex-col justify-center w-full max-w-4xl gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="product_name"
            render={({ field }) => (
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
            )}
          />

          <FormField
            control={form.control}
            name="product_description"
            render={({ field }) => (
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
            )}
          />

          <FormField
            control={form.control}
            name="product_price"
            render={({ field }) => (
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
            )}
          />

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
                      <SelectItem
                        key={category.id}
                        value={category.category_name}
                      >
                        {category.category_name}
                      </SelectItem>
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
                {form.getValues("product_images") &&
                  form.getValues("product_images").length > 0 ? (
                  tempImagesUrl.length >= 1 &&
                  tempImagesUrl.map((imageUrl: any, index: any) => (
                    <div key={index}>
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
                ) : (
                  <div>
                    <p className="text-sm placeholder-gray-500">
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
                        onChange={handleImage}
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
                          value={tag}
                          name="tag"
                          onChange={handleValue}
                        />
                        <Button
                          type="button"
                          className="bg-black"
                          onClick={() => {
                            if (tag?.trim() === "") return;
                            const newTags = [...field.value, tag] as string[]; // Agrega la nueva etiqueta
                            form.setValue("product_tags", newTags, {
                              shouldValidate: true,
                            }); // Actualiza el formulario
                            setTag("");
                          }}
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
                {form.getValues("product_tags").map((tag, index) => (
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
                          name="note"
                          type="text"
                          value={note}
                          placeholder="Escribe una nota"
                          onChange={handleValue}
                        />

                        <Button
                          type="button"
                          className="bg-black"
                          onClick={() => {
                            if (note?.trim() === "") return;
                            let newNotes = [...field.value, note] as string[];
                            form.setValue("product_notes", newNotes, {
                              shouldValidate: true,
                            });
                            setNote("");
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
                {form.getValues("product_notes")?.map((note, index) => (
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
          >
            Añadir producto
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default AddProduct;
