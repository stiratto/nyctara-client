import CartProduct from "@/components/Cart/CartProduct";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Product } from "@/interfaces/Product.Interface";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ApplyDiscount from "./ApplyDiscount";
import ProductsNotFound from "../NotFound/ProductsNotFound";
import { useMemo } from "react";
import { getCartTotal } from "@/utils/cartUtils";
import { AppDispatch, RootState } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import productsApi from "@/api/products/products.api";
import { updateCartProducts } from "@/store/cart/CartProductsSlice";
import { BuyForm } from "./BuyForm";
import { toast } from "sonner";

const Cart = () => {
  const cartProducts = useSelector((state: RootState) => state.cart.products);
  const dispatch = useDispatch<AppDispatch>();

  // Derive IDs directly from cartProducts, ensuring non-null values
  const productIds = useMemo(() => 
    cartProducts?.reduce<string[]>((acc, product) => {
      if (product.id) acc.push(product.id);
      return acc;
    }, []) || [], 
    [cartProducts]
  );

  // Calculate total using useMemo to prevent unnecessary recalculations
  const total = useMemo(() => getCartTotal(), [cartProducts]);

  const { 
    refetch, 
    isLoading,
    isError 
  } = useQuery({
    queryKey: ["cartProducts", productIds] as const,
    queryFn: async () => {
      try {
        const products = await productsApi.GetCartProducts(productIds);
        dispatch(updateCartProducts({ products }));
        return products;
      } catch (error) {
        toast.error('Error al cargar los productos');
        throw error;
      }
    },
    enabled: productIds.length > 0,
    retry: 1
  });

  const handleOpen = () => {
    if (productIds.length > 0) {
      refetch();
    }
  };

  return (
    <Sheet onOpenChange={handleOpen}>
      <SheetTrigger className="flex items-center gap-4 cursor-pointer">
        <ShoppingCart size={20} />
        {cartProducts?.length > 0 && (
          <span className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {cartProducts.length}
          </span>
        )}
      </SheetTrigger>
      <SheetContent
        side={"right"}
        className="lg:rounded-tl-2xl bg-[#ecefdc] flex flex-col justify-center w-full lg:max-w-2xl mx-auto"
      >
        <SheetTitle className="text-5xl self-start">Tu carrito</SheetTitle>
        <SheetDescription></SheetDescription>
        <ApplyDiscount />
        
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : isError ? (
          <div className="text-red-500 text-center p-4">
            Error al cargar los productos. Por favor, intenta de nuevo.
          </div>
        ) : cartProducts?.length > 0 ? (
          <ul className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
            {cartProducts?.map((product: Product) => (
              <CartProduct key={product.id} {...product} />
            ))}
          </ul>
        ) : (
          <ProductsNotFound />
        )}

        <div className="flex flex-col mt-4">
          <p className="text-2xl font-semibold">Total: ${total}</p>
          <span className="uppercase text-gray-800 text-xs">
            Más gastos de envio
          </span>
        </div>

        {cartProducts?.length > 0 && <BuyForm total={total} />}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
