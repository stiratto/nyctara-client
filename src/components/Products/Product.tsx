import { ImageMagnifier } from "@/components/Other/ImageMagnifier";
import { Product as ProductProps } from "@/interfaces/Product.Interface";
import { RootState } from "@/store/store.ts";
import { addToCart } from "@/utils/cartUtils.ts";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { NavLink as Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import productsApi from "../../api/products/products.api";
import ProductsNotFound from "../NotFound/ProductsNotFound.tsx";
import { TypographyH3 } from "../Typography/h3.tsx";
import { TypographyP } from "../Typography/p.tsx";
import { Badge } from "../ui/badge.tsx";
import { Button } from "../ui/button.tsx";
import { DeleteProductDialog } from "./DeleteProductDialog.tsx";
import OtherProducts from "./OtherProducts.tsx";
import ProductBreadcrumb from "./ProductBreadcrumb";
import { LoaderCircle, ShoppingCart } from "lucide-react";
import { Discount } from "@/interfaces/Discount.interface.ts";
import clsx from "clsx";
import { cn } from "@/lib/utils.ts";

const Product = () => {
  const { id } = useParams();
  const [formattedPrice, setFormattedPrice] = useState("");

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.authenticated,
  );

  const [currentImage, setCurrentImage] = useState<string | undefined>();

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const discountUserUsing = useSelector((state: RootState) => state.discounts.current_discount_being_used) as Discount

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

    const formattedPrice = new Intl.NumberFormat("es-ES").format(product?.product_price as number)
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
    addToCart(product, discountUserUsing);
  };


  return (
    <div className={cn("duration-600 flex  flex-col items-center justify-center pt-28 px-8 lg:px-24", productError && "h-screen")}>
      {productLoading && !productError && (
        <div className="flex flex-col items-center justify-center py-14  xl:h-screen xl:container px-24">
          <LoaderCircle size={70} className="animate-spin duration-600" />
        </div>
      )}

      {!productLoading && productError && <ProductsNotFound />}

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
                    className={clsx(`w-[90px] h-[90px] cursor-pointer border-2 border-transparent object-cover rounded-full hover:border-gray-500`,
                      // check if current image is the one selected
                      index === currentIndex && "border-black!"
                    )}
                    onClick={() => (
                      setCurrentImage(image?.src), setCurrentIndex(index)
                    )}
                  />
                ))}
              </div>

              <ImageMagnifier src={currentImage as string} />
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-8">
            <h1 className="font-extrabold text-5xl break-all max-w-sm">{product?.product_name}</h1>
            <p className="text-sm text-gray-500 "> {product?.product_tags.map((tag) => (
              <Badge className="bg-transparent hover:bg-transparent text-gray-500 border-gray-400">{tag}</Badge>
            ))}</p>
            <div className="flex items-center justify-between">
              <TypographyP className="font-bold text-2xl">
                ${formattedPrice}
              </TypographyP>

              <Badge className="font-normal">
                {product?.product_quality}
              </Badge>

            </div>
            <TypographyP className="break-words max-w-sm text-gray-700">
              {product?.product_description}
            </TypographyP>
            <Badge className="bg-transparent text-black border-gray-700 w-min hover:bg-transparent">
              {product?.product_category?.category_name}
            </Badge>
            <div>
              <h2 className="font-bold">Notas de fragancia</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  py-2">
                {product?.product_notes?.map((note: string) => <li key={uuidv4()}>{note}</li>)}
              </ul>
            </div>

            <Button
              className="flex gap-2 items-center w-min bg-black text-white"
              variant={"outline"}
              type="button"
              onClick={() => handleAddToCart(product as ProductProps)}
            >
              Añadir al carrito
              <ShoppingCart size={20} />
            </Button>


            <div className="flex flex-col md:flex-row gap-8 items-center ">
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
      {!productLoading && !productError && product && (

        <OtherProducts id={product?.id as string} />
      )}
    </div>
  );
};

export default Product;
