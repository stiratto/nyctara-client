import { CartFormData } from "@/interfaces/Cart.Interface";
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

export const createWhatsAppMessage = (data: CartFormData) => {
    const cartProducts = store.getState().cart.products;
    const subtotal = getCartTotal();
    const productMessage = cartProducts
        .map((product) => {
            return `*${product.product_name}: ${product.product_quantity} `;
        })
        .join("\n");

    const totalMessage = `\n\nSubtotal: $${subtotal}\n\nTotal a pagar: $${subtotal}\n\nElegí el método de pago: ${data.paymentMethod}
                }\n\nMis datos para recibir el pedido son:\n${data.name}\n${data.number}\n${data.address}\n${data.city}\n¡Muchas gracias!`;

    const fullMessage = `Hola!! Buenos días/tardes/noches.\nMi pedido es el siguiente:\n\n${productMessage}${totalMessage}`;
    return encodeURIComponent(fullMessage);
};
