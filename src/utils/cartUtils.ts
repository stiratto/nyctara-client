import { Discount } from "@/interfaces/Discount.interface";
import { Product } from "@/interfaces/Product.Interface";
import { addProductToCart } from "@/store/cart/CartProductsSlice";
import { store } from "@/store/store";
import { toast } from "sonner";

export const addToCart = async (
    product: Product,
    discountUserUsing: Discount,
) => {
    try {
        store.dispatch(
            addProductToCart({
                product: {
                    ...product,
                },
                discountUserUsing: { ...discountUserUsing },
            }),
        );
        toast.success("El producto se anadio al carrito!");
    } catch (error) {
        toast.error("No se pudo agregar al carrito :(");
        console.log(error)
        throw new Error("Error al agregar al carrito");
    }
};

export const getCartTotal = () => {
    const cartProducts = store.getState().cart.products;
    return cartProducts?.reduce((total: number, product: Product) => {
        return (
            total + (product?.product_quantity as number) * product.product_price
        );
    }, 0);
};


