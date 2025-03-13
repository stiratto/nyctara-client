import { SubmitHandler, useForm } from "react-hook-form"
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
import mailingApi from "@/api/mailing/mailing.api";
import { Mail } from "@/interfaces/Mailing.Interface";
import { toast } from "sonner";
import { createCustomerOrderMessage } from "@/utils/cartUtils";

export const BuyForm = ({ total }: { total: number }) => {

   const { mutate } = useMutation({
      mutationKey: ['bold-payment-link'],
      mutationFn: () => paymentsApi.CreatePaymentLink(total),
      onMutate: () => {
         toast.loading("Estamos haciendo unas cosas, te redireccionaremos pronto...")
      },
      onSuccess: (data) => {
         const url = data.payload.url
         window.location.replace(url)
      }
   })

   const { mutate: sendMail } = useMutation({
      mutationKey: ['send-mail'],
      mutationFn: (mail: Mail) => mailingApi.SendMail(mail),

   })

   const form = useForm<TBuyFormSchema>({
      resolver: zodResolver(BuyFormSchema),
      reValidateMode: "onChange",
   })


   const onSubmit: SubmitHandler<TBuyFormSchema> = (data, e) => {
      // cuando se envie el formulario, tenemos que hacer lo
      // siguiente:
      // - enviar el formulario al correo
      // - redireccionar al usuario al link de bold
      e?.preventDefault()

      try {
         const mail = {
            message: createCustomerOrderMessage(data)
         }

         sendMail(mail)
         mutate()
      } catch (err: any) {
         toast.error(`Hubo un error inesperado :(, ${err}`)
      }

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

                  <FormField
                     control={form.control}
                     name="phone_number"
                     render={({ field }) => (
                        <FormItem>

                           <FormControl>
                              <div>
                                 <Label htmlFor="phone_number">Numero de telefono</Label>
                                 <Input
                                    id="phone_number"
                                    type="text"
                                    {...field}
                                    value={field?.value}
                                    placeholder="+57 123 456 7891"
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

