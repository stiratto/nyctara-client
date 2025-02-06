import { CartFormData } from "@/interfaces/Cart.Interface";
import { CartFormDataSchema } from "@/schemas/CartFormSchema";
import { AppDispatch, RootState } from "@/store/store";
import { createWhatsAppMessage } from "@/utils/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { X } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { clearCurrentDiscountUsing } from "@/store/discounts/DiscountsSlice";
import { clearCart } from "@/store/cart/CartProductsSlice";

export const CartBuyForm = () => {
  const cartProducts = useSelector((state: RootState) => state.cart.products);

  const dispatch = useDispatch<AppDispatch>()

  const [showForm, setShowForm] = useState(false);

  const form = useForm<CartFormData>({
    resolver: yupResolver(CartFormDataSchema),
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<CartFormData> = (data) => {
    try {
      const message = createWhatsAppMessage(
        data,
        cartProducts,
      );
      window.open(
        `https://api.whatsapp.com/send?phone=573028317599&text=${message}`,
        "_blank",
      );
      setShowForm(false);


      dispatch(clearCurrentDiscountUsing())
      dispatch(clearCart())
    } catch (error) {
      throw new Error("Error al enviar el mensaje");
    }
  };

  return (
    <>
      <Button
        onClick={() => cartProducts.length > 0 && setShowForm(!showForm)}
        className="bg-black hover:bg-black/50"
      >
        Proceder con la compra
      </Button>

      {showForm && (
        <div className="mx-auto duration-700 w-full relative">
          <X
            size={15}
            onClick={() => setShowForm(!showForm)}
            className="bg-red-500 text-white absolute right-4 hover:cursor-pointer"
          />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="overflow-y-scroll h-64 px-2 space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numero de telefono</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metodo de pago</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un método de pago" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Transferencia">Transferencia</SelectItem>
                        <SelectItem value="Consignacion">Consignacion</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Direccion de tu domicilio</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="bg-black p-2 hover:bg-black/20"
              >
                Finalizar compra
              </Button>
            </form>
          </Form>
        </div>
      )}
    </>
  );
};
