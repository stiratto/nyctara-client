import CartProduct from "@/components/Cart/CartProduct";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Product } from "@/interfaces/Product.Interface";
import { ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ApplyDiscount from "./ApplyDiscount";
import { CartBuyForm } from "./CartBuyForm";
import ProductsNotFound from "../NotFound/ProductsNotFound";
import { useEffect, useState } from "react";
import { getCartTotal } from "@/utils/cartUtils";
import { AppDispatch, RootState } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import productsApi from "@/api/products/products.api";
import { updateCartProducts } from "@/store/cart/CartProductsSlice";
import BoldPaymentButton from "./BoldPayButton";

const Cart = () => {
  const cartProducts = useSelector((state: RootState) => state.cart.products);
  const dispatch = useDispatch<AppDispatch>()

  const [ids, setIds] = useState<string[]>()

  const setProductIds = () => {
    const ids = cartProducts?.map((product) => product.id)
    setIds(ids as string[])
  }

  const { refetch, data: products } = useQuery({
    queryKey: ["cartProducts", ids],
    queryFn: () => productsApi.GetCartProducts(ids as string[]),
  })

  useEffect(() => {
    if (products) {
      dispatch(updateCartProducts({ products: products }))
      setTotal(getCartTotal())
    }
  }, [products])

  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    setTotal(getCartTotal())
  }, [cartProducts])

  const handleOpen = () => {
    setProductIds()
    refetch()
  }

  return (
    <Sheet onOpenChange={handleOpen}>
      <SheetTrigger className="flex items-center gap-4 cursor-pointer">
        <ShoppingCart size={20} />
      </SheetTrigger>
      <SheetContent
        side={"right"}
        className="lg:rounded-tl-2xl bg-[#ecefdc] flex flex-col justify-center w-full lg:max-w-2xl mx-auto"
      >
        <SheetTitle className="text-5xl self-start">Tu carrito</SheetTitle>
        <SheetDescription></SheetDescription>
        <ApplyDiscount />
        {cartProducts?.length > 0

          ? (
            <ul className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
              {cartProducts?.map((product: Product) => <CartProduct key={product.id} {...product} />)}
            </ul>
          )
          : (
            <ProductsNotFound />
          )}
        <div className="flex flex-col">
          <p className="text-2xl">Total: ${total}</p>
          <span className="uppercase text-gray-800 text-xs">
            Más gastos de envio
          </span>
        </div>
        <BoldPaymentButton amount={total}/>
        <CartBuyForm />

      </SheetContent>
    </Sheet>
  );
};

export default Cart;
