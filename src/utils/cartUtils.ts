import { Discount } from "@/interfaces/Discount.interface";
import { Product } from "@/interfaces/Product.Interface";
import { TBuyFormSchema } from "@/schemas/BuyFormSchema";
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

export const getCustomerOrderProducts = () => {
    const cartProducts = store.getState().cart.products;


    const productsMessage = cartProducts.map((product) => {
        if (product && product.product_quantity) {
            `${product.product_name} ${product?.product_quantity}x - ${product.product_price * product?.product_quantity}$`
        }
    }
    ).join('\n')

    return productsMessage
}

export const createCustomerOrderMessage = (data: TBuyFormSchema) => {
    return `
🎉 Nuevo pedido!
               
${getCustomerOrderProducts()}
                  

Direccion: ${data.address}
Nombre del que recibe el pedido: ${data.receiver_name}
Nombre del que emite el pedido: ${data.customer_name}
Numero de celular: ${data.phone_number}

`
}

export const getCartTotal = () => {
    const cartProducts = store.getState().cart.products;
    return cartProducts?.reduce((total: number, product: Product) => {
        return (
            total + (product?.product_quantity as number) * product.product_price
        );
    }, 0);
};


