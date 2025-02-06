import productsApi from "@/api/products/products.api";
import { addQuantity, removeProductFromCart, removeQuantity } from "@/store/cart/CartProductsSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TypographyP } from "../Typography/p";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const CartProduct = ({ name, price, id, quantity, description, notes, product_quality }: any) => {
  const dispatch = useDispatch<AppDispatch>();

  const { data: url } = useQuery({
    queryKey: ["product-cart-image", id],
    queryFn: () => productsApi.GetProductImage(id),
  });

  const deleteProduct = (id: string) => {
    dispatch(removeProductFromCart({ id }));
  };

  const addProductQuantity = (id: string) => {
    dispatch(addQuantity({ id, quantity: 1 }));
  };

  const current_discount_being_used = useSelector((state: RootState) => state.discounts.current_discount_being_used);

  const removeProductQuantity = useCallback(
    (id: string) => {
      dispatch(removeQuantity({ id, quantity: 1 }));
    },
    [dispatch],
  );

  return (
    <div className="flex flex-col md:flex-row items-center text-lg border-b border-b-black/20 pb-4 gap-4">
      <div className="flex items-center gap-5 ">
        <img
          loading="lazy"
          decoding="async"
          src={url?.[0]}
          alt={name}
          width={128}
          height={128} // Indica el tamaño máximo que debe mostrarse
          className="rounded-xl object-contain"
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center w-full text-sm">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="font-bold text-2xl">{name}</h1>
            <TypographyP className="max-w-xs text-ellipsis overflow-hidden">{description}</TypographyP>
          </div>
          <div className="flex gap-2">
            <p className="font-semibold">Notas:</p>
            {notes.map((note: string, index: number) => <Badge key={index} className="w-min">{note}</Badge>)}
          </div>
          <h1 className="font-semibold">
            Calidad: <span className="font-normal">{product_quality}</span>
          </h1>
        </div>

        <div className="flex flex-col text-end gap-4">
          <div>
            <h1 className="font-bold text-lg">${price}</h1>
            {current_discount_being_used && (
              <p className="line-through text-gray-500">${current_discount_being_used.discount_total}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-4 items-center">
              <Button
                disabled={quantity === 1}
                onClick={() => removeProductQuantity(id)}
                className="!px-3 bg-transparent border border-gray-600 text-black font-bold hover:bg-black/10"
              >
                <Minus size={13} />
              </Button>
              <h1 className="text-lg">{quantity}</h1>
              <Button
                className="!px-3 bg-transparent border border-gray-600 text-black font-bold hover:bg-black/10"
                onClick={() => addProductQuantity(id)}
              >
                <Plus size={15} />
              </Button>
            </div>
            <Button
              onClick={() => deleteProduct(id)}
              className="flex items-center gap-3 !px-3 text-white bg-red-500 p-1 hover:bg-red-300 font-medium"
            >
              <Trash2 size={15} />
              <p>Remover</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
