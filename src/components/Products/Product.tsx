import { ImageMagnifier } from "@/components/Other/ImageMagnifier";
import { Product as ProductProps } from "@/interfaces/Product.Interface";
import { RootState } from "@/store/store.ts";
import { addToCart } from "@/utils/utils.ts";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { NavLink as Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import productsApi from "../../api/products/products.api";
import ProductsNotFound from "../NotFound/ProductsNotFound.tsx";
import { TypographyH1 } from "../Typography/h1.tsx";
import { TypographyH2 } from "../Typography/h2.tsx";
import { TypographyH3 } from "../Typography/h3.tsx";
import { TypographyH4 } from "../Typography/h4.tsx";
import { TypographyP } from "../Typography/p.tsx";
import { Badge } from "../ui/badge.tsx";
import { Button } from "../ui/button.tsx";
import { DeleteProductDialog } from "./DeleteProductDialog.tsx";
import OtherProducts from "./OtherProducts.tsx";
import ProductBreadcrumb from "./ProductBreadcrumb";
import { LoaderCircle, ShoppingCart } from "lucide-react";

const Product = () => {
  const { id } = useParams();
  const [formattedPrice, setFormattedPrice] = useState("");

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.authenticated,
  );

  const [currentImage, setCurrentImage] = useState<string | undefined>();

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const {
    data: product,
    isLoading: productLoading,
    isError: productError,
  } = useQuery<ProductProps>({
    queryKey: ["main-product", id],
    queryFn: () => productsApi.GetProductById(id as string),
    enabled: !!id
  });

  useEffect(() => {
    const formattedPrice = product?.product_price?.toLocaleString("es-ES", {
      style: "currency",
      currency: "COP",
    })
      .replace("COP", "");

    setFormattedPrice(formattedPrice as any);
  }, [product?.product_price]);

  useEffect(() => {

    if (product && product.product_images && product.product_images.length > 0) {
      setCurrentImage(product.product_images[0] as string);
    } else {
      setCurrentImage(undefined);
    }
  }, [product]);

  const images = Array.isArray(product?.product_images)
    ? product.product_images.map((images: any) => ({
      src: images,
      alt: "Image",
    }))
    : product?.product_images
      ? [{ src: product.product_images, alt: "Image" }]
      : [];

  const handleAddToCart = (product: ProductProps) => {
    addToCart(product);
  };




  return (
    <div className="duration-600 flex  flex-col items-center justify-center pt-14 px-8 lg:px-24">
      {productLoading && !productError && (
        <div className="flex flex-col items-center justify-center py-14  xl:h-screen xl:container px-24">
          <LoaderCircle size={70} className="animate-spin duration-600" />
        </div>
      )}

      {!productLoading && productError && <ProductsNotFound cart />}

      {!productLoading && !productError && product && (
        <div className="flex flex-col xl:flex-row justify-center xl:gap-48 items-center w-full mt-14 xl:mt-0 ">
          <div className="flex flex-col gap-4">
            <ProductBreadcrumb
              name={product?.product_name}
              id={product?.product_category?.id}
              category={product?.product_category?.category_name}
            />

            <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-8">
              <div className="flex  md:flex-col items-center justify-center gap-4">
                {images?.map((image: { src: string }, index: number) => (
                  <img
                    key={uuidv4()}
                    alt="Imagen del producto"
                    src={image?.src}
                    className={`w-[90px] h-[90px] cursor-pointer object-cover p-2 ${index === currentIndex
                      ? "border-black border-2 "
                      : "border-transparent border-2"
                      }`}
                    onClick={() => (
                      setCurrentImage(image?.src), setCurrentIndex(index)
                    )}
                  />
                ))}
              </div>

              <ImageMagnifier src={currentImage as string} />
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-8 ">
            <h1 className="font-extrabold text-5xl break-all max-w-sm">{product?.product_name}</h1>
            <TypographyP className="font-bold text-xl">
              ${formattedPrice}
            </TypographyP>

            <TypographyH2>Descripcion</TypographyH2>
            <TypographyP className="break-words max-w-sm">
              {product?.product_description}
            </TypographyP>
            <div>
              <TypographyH3>Notas de fragancia</TypographyH3>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  py-2">
                {product?.product_notes?.map((note: string) => <li key={uuidv4()}>{note}</li>)}
              </ul>
            </div>
            <div>
              <TypographyH4>Detalles</TypographyH4>
              <div className="flex items-center gap-2 ">
                <span className="font-bold">Calidad:</span>
                <TypographyP className="font-normal">
                  {product?.product_quality}
                </TypographyP>
              </div>
              <div className="flex items-center gap-2 ">
                <span className="font-bold">Categoria:{" "}</span>
                <TypographyP className="font-normal">
                  {product?.product_category?.category_name}
                </TypographyP>
              </div>
            </div>

            <div>
              <ul className="flex flex-col gap-4 text-lg">
                <TypographyH3>Etiquetas</TypographyH3>
                <div className="flex gap-4 text-lg">
                  {product?.product_tags?.map((tag: string) => (
                    <Badge
                      className="bg-transparent uppercase text-black border-black border p-2 rounded-xl hover:!bg-transparent bg-gray-200"
                      key={uuidv4()}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </ul>
            </div>

            <div className="">
              <Button
                className="flex  gap-2 items-center"
                variant={"outline"}
                type="button"
                onClick={() => handleAddToCart(product as ProductProps)}
              >
                Añadir al carrito
                <ShoppingCart size={20} />
              </Button>
            </div>


            <div className="flex flex-col md:flex-row gap-8 items-center justify-around ">
              {isAuthenticated && <DeleteProductDialog id={product.id as string} />}
              {isAuthenticated && (
                <Link to={`/admin/editar-producto/${product?.id}`}>
                  <Button variant={"secondary"}>Editar producto</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
      <OtherProducts id={product?.id as string} />
    </div>
  );
};

export default Product;
