import discountsApi from "@/api/discounts/discounts.api";
import { Discount } from "@/interfaces/Discount.interface";
import { changeProductPrice } from "@/store/cart/CartProductsSlice";
import { discountsUserAlreadyUsed } from "@/store/discounts/DiscountsSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const ApplyDiscount = () => {
  const [discount, setDiscount] = useState<string>("");
  const cartProducts = useSelector((state: RootState) => state.cart.products);
  const discounts_user_already_used = useSelector((state: RootState) => state.discounts.discounts_user_already_used);

  const dispatch = useDispatch<AppDispatch>();

  const { mutate: getDiscount } = useMutation<Discount>({
    mutationFn: () => discountsApi.GetDiscountByName(discount),
  });

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscount(e.target.value);
  };

  const loopThroughDiscounts = async () => {
    try {
      getDiscount(undefined, {
        onSuccess: (dbDiscount: Discount) => {
          if (dbDiscount?.discount_name === discount) {
            console.log(discounts_user_already_used);
            const userIsUsingDiscount = discounts_user_already_used.find((d) => d.id === dbDiscount.id) as Discount;

            if (!userIsUsingDiscount) {
              dispatch(discountsUserAlreadyUsed(dbDiscount));

              dispatch(
                changeProductPrice({
                  discount_total: dbDiscount.discount_total,
                  discount_name: dbDiscount.discount_name,
                  userIsUsingDiscount,
                }),
              );
              toast.success("Descuento aplicado!");
            } else {
              toast.error("El descuento ya fue aplicado!");
            }
          } else {
            toast.error("Parece que el descuento ya lo aplicaste o no existe!");
          }
        },
        onError: (error) => {
          console.log(error);
          toast.error("Error al verificar el descuento.");
        },
      });
    } catch (error) {
      console.error("Error fetching discount:", error);
      toast.error("Error al verificar el descuento.");
    }
  };

  const handleApplyDiscount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loopThroughDiscounts();
  };

  return (
    <div className="flex flex-col items-start">
      <form
        onSubmit={handleApplyDiscount}
        className="flex flex-wrap items-center space-x-4"
      >
        <Input
          type="text"
          placeholder="Codigo"
          name="codigo"
          className="w-28 border bg-white"
          onChange={handleValue}
          disabled={cartProducts.length === 0}
        />

        <Button
          type="submit"
          className="bg-black hover:bg-black/80 p-2 rounded-lg"
        >
          Aplicar descuento
        </Button>
      </form>
    </div>
  );
};

export default ApplyDiscount;
