import CartProduct from "@/components/Cart/CartProduct";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Product } from "@/interfaces/Product.Interface";
import { RootState } from "@/store/store";
import { ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";
import ApplyDiscount from "./ApplyDiscount";
import { CartBuyForm } from "./CartBuyForm";
import ProductsNotFound from "../NotFound/ProductsNotFound";

const Cart = () => {
  const cartProducts = useSelector((state: RootState) => state.cart.products);

  window.addEventListener("storage", (e) => {
    if (e.key === "discounts_user_already_used" && e.newValue === null) {
      localStorage.setItem(
        "discounts_user_already_used",
        e.oldValue as unknown as string,
      );
    }
  });

  const getCartTotal = () => {
    return cartProducts.reduce((total, product) => {
      return (
        total
        + (product?.quantity as number) * product.price
      );
    }, 0);
  };

  return (
    <Sheet>
      <SheetTrigger className="flex items-center gap-4">
        <ShoppingCart size={20} />
      </SheetTrigger>
      <SheetContent
        side={"right"}
        className="lg:rounded-t-2xl bg-[#ecefdc] flex flex-col justify-center w-full lg:max-w-2xl mx-auto h-full"
      >
        <SheetTitle className="text-5xl self-start">Tu carrito</SheetTitle>
        <SheetDescription></SheetDescription>
        <ApplyDiscount />
        {cartProducts.length > 0
          ? (
            <ul className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
              {cartProducts.map((product: Product) => <CartProduct key={product.id} {...product} />)}
            </ul>
          )
          : (
            <ProductsNotFound cart={true} />
          )}
        <div className="flex flex-col">
          <p className="text-2xl">Total: ${getCartTotal()}</p>
          <span className="uppercase text-gray-800 text-xs">
            Más gastos de envio
          </span>
        </div>
        <CartBuyForm />
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
