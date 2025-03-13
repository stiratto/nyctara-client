import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { useMutation } from "@tanstack/react-query";
import paymentsApi from "@/api/payment/payments.api";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { BuyFormSchema, TBuyFormSchema } from "@/schemas/BuyFormSchema"
import BoldPaymentButton from "./BoldPayButton"
import { TypographyH1 } from "../Typography/h1";
import { TypographyP } from "../Typography/p";

export const BuyForm = ({ total }: { total: number }) => {

   const { mutate } = useMutation({
      mutationKey: ['bold-payment-link'],
      mutationFn: () => paymentsApi.CreatePaymentLink(total),
      onSuccess: (data) => {
         const url = data.payload.url
         window.location.replace(url)
      }
   })

   const form = useForm<TBuyFormSchema>({
      resolver: zodResolver(BuyFormSchema),

    reValidateMode: "onChange",
   })


   const onSubmit = (e) => {
      e.preventDefault()
      mutate()
   }

   return (
      <Dialog>
         <DialogTrigger className="bg-black hover:cursor-pointer p-2 rounded-lg text-white">Finalizar compra</DialogTrigger>
         <DialogContent className="bg-[#ecefdc]">
            <TypographyH1>Espera!</TypographyH1>
            <TypographyP className="text-gray-600" > Necesitamos algunas cosas para continuar con el pago <br />
               No te molestaremos mas!  :)</TypographyP>
            <Form {...form}>
               <form className="flex flex-col gap-4" onClick={form.handleSubmit(onSubmit)}>
                  <FormField
                     control={form.control}
                     name="receiver_name"
                     render={({ field }) => (
                        <FormItem>

                           <FormControl>
                              <div>
                                 <Label htmlFor="receiver_name">Nombre del que recibe el pedido</Label>
                                 <Input
                                    id="receiver_name"
                                    type="text"
                                    {...field}
                                    placeholder="Nombre"
                                 />
                              </div>
                           </FormControl>

                           <FormMessage />
                        </FormItem>
                     )} />

                  <FormField
                     control={form.control}
                     name="customer_name"
                     render={({ field }) => (
                        <FormItem>

                           <FormControl>
                              <div>
                                 <Label htmlFor="customer_name">Nombre del que realiza el pedido (el que esta llenando este formulario)</Label>
                                 <Input
                                    id="customer_name"
                                    type="text"
                                    {...field}
                                    value={field?.value}
                                    placeholder="Nombre"
                                 />
                              </div>

                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )} />


                  <FormField
                     control={form.control}
                     name="address"
                     render={({ field }) => (
                        <FormItem>

                           <FormControl>
                              <div>
                                 <Label htmlFor="address">Direccion de domicilio</Label>
                                 <Input
                                    id="address"
                                    type="text"
                                    {...field}
                                    value={field?.value}
                                    placeholder="Nombre"
                                 />
                              </div>

                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )} />



                  <BoldPaymentButton amount={total} />

               </form>
            </Form>

         </DialogContent>
      </Dialog>
   )
}

