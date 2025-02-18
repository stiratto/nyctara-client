import discountsApi from "@/api/discounts/discounts.api";
import { Discount } from "@/interfaces/Discount.interface";
import { applyDiscount, clearCurrentDiscountUsing, clearDiscountError } from "@/store/discounts/DiscountsSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { clearCart } from "@/store/cart/CartProductsSlice";

const ApplyDiscount = () => {
    const [discount, setDiscount] = useState<string>("");
    const cartProducts = useSelector((state: RootState) => state.cart.products);
    const discountError = useSelector((state: RootState) => state.discounts.error)
    const dispatch = useDispatch<AppDispatch>();
    const userIsUsingDiscount = useSelector((state: RootState) => state.discounts.current_discount_being_used)

    const { mutate: getDiscount, data: discountOnDb } = useMutation<Discount>({
        mutationFn: () => discountsApi.GetDiscountByName(discount),
        onSuccess: (data: Discount) => {
            dispatch(applyDiscount(data))
        },
        onError: (error: any) => {
            console.log(error)
            toast.error("Error al verificar el descuento.");
        },
    });

    const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDiscount(e.target.value);
    };

    const handleApplyDiscount = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!discount.trim()) {
            return toast.error("Ingresa un codigo de descuento valido.")
        }
        getDiscount()

    };

    useEffect(() => {
        if (discountError && discountError !== "") {
            toast.error(discountError)
            dispatch(clearDiscountError())
        }
    }, [discountError])

    return (
        <div className="flex flex-col items-start">
            <form
                onSubmit={handleApplyDiscount}
                className="flex flex-col gap-2"
            >
                {userIsUsingDiscount && <p className="text-gray-500 text-sm">Ya estas usando un descuento</p>}
                <div className="flex flex-wrap items-center gap-4">
                    <Input
                        type="text"
                        placeholder="Codigo"
                        name="codigo"
                        className="w-28 border bg-white"
                        onChange={handleValue}
                        disabled={cartProducts?.length === 0 || userIsUsingDiscount ? true : false}
                        value={userIsUsingDiscount ? userIsUsingDiscount?.discount_name : ""}
                    />

                    <Button
                        type="submit"
                        className="bg-black hover:bg-black/80 p-2 rounded-lg"
                        disabled={cartProducts?.length === 0 || userIsUsingDiscount ? true : false}
                    >
                        Aplicar descuento
                    </Button>

                </div>



            </form>
        </div>
    );
};

export default ApplyDiscount;
