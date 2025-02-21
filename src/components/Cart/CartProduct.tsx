import { addQuantity, removeProductFromCart, removeQuantity } from "@/store/cart/CartProductsSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TypographyP } from "../Typography/p";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { IsAvailableBadge } from "../Products/IsAvailableBadge";
import { formatPrice } from "@/utils/utils";

const CartProduct = ({ isAvailable, product_name, product_price, id, product_quantity, product_description, product_notes, product_quality, product_images }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [priceDiscounted, setPriceDiscounted] = useState<number>(0)

  useEffect(() => {
    setPriceDiscounted((product_price / (1 - parseInt(current_discount_being_used?.discount_total as string) / 100)) - product_price)
  }, [])

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
    <div className="flex flex-col lg:flex-row items-center text-lg border-b border-b-black/20 pb-4 gap-4">
      <img
        loading="lazy"
        decoding="async"
        src={product_images?.[0]}
        alt={product_name}
        width={128}
        className="self-start md:self-center rounded-xl object-contain h-full"
      />

      <div className="flex flex-col md:flex-row justify-start items-start md:justify-between md:items-center w-full text-sm">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="font-bold text-2xl">{product_name}</h1>
            <IsAvailableBadge isAvailable={isAvailable} />

          </div>
          <div className="flex gap-2">
            <p className="font-semibold">Notas:</p>
            {product_notes?.map((note: string, index: number) => <Badge key={index} className="w-min bg-transparent border border-gray-500 text-black hover:bg-transparent">{note}</Badge>)}
          </div>
          <h1 className="font-semibold">
            Calidad: <span className="font-normal">{product_quality}</span>
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="font-bold text-lg">${formatPrice(product_price)}</h1>

            {current_discount_being_used && (
              <p className="line-through text-gray-500">${priceDiscounted}</p>
            )}
          </div>
          <div className="flex flex-col !justify-start !items-start gap-2 ">
            <div className="flex gap-4 items-center">
              <Button
                disabled={product_quantity === 1}
                onClick={() => removeProductQuantity(id)}
                className="px-3! bg-transparent border border-gray-600 text-black font-bold hover:bg-black/10"
              >
                <Minus size={13} />
              </Button>
              <h1 className="text-lg">{product_quantity}</h1>
              <Button
                className="px-3! bg-transparent border border-gray-600 text-black font-bold hover:bg-black/10"
                onClick={() => addProductQuantity(id)}
              >
                <Plus size={15} />
              </Button>
            </div>
            <Button
              onClick={() => deleteProduct(id)}
              className="flex items-center gap-3 px-3! text-white bg-red-500 p-1 hover:bg-red-300 font-medium"
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
