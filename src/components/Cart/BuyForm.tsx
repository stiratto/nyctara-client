import { SubmitHandler, useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { useMutation } from "@tanstack/react-query";
import paymentsApi from "@/api/payment/payments.api";
import { Form } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BuyFormSchema, TBuyFormSchema } from "@/schemas/BuyFormSchema";
import BoldPaymentButton from "./BoldPayButton";
import { TypographyH1 } from "../Typography/h1";
import { TypographyP } from "../Typography/p";
import mailingApi from "@/api/mailing/mailing.api";
import { Mail } from "@/interfaces/Mailing.Interface";
import { toast } from "sonner";
import { createCustomerOrderMessage } from "@/utils/cartUtils";
import { FormFieldWrapper } from "../Other/FormFieldWrapper";

export const BuyForm = ({ total }: { total: number }) => {
  const { mutate } = useMutation({
    mutationKey: ["bold-payment-link"],
    mutationFn: () => paymentsApi.CreatePaymentLink(total),
    onMutate: () => {
      toast.loading(
        "Estamos haciendo unas cosas, te redireccionaremos pronto..."
      );
    },
    onSuccess: (data) => {
      const url = data.payload.url;
      window.location.replace(url);
    },
  });

  const { mutate: sendMail } = useMutation({
    mutationKey: ["send-mail"],
    mutationFn: (mail: Mail) => mailingApi.SendMail(mail),
  });

  const form = useForm<TBuyFormSchema>({
    resolver: zodResolver(BuyFormSchema),
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<TBuyFormSchema> = async (data, e) => {
    e?.preventDefault();

    try {
      const mail = {
        message: createCustomerOrderMessage(data),
      };

      await sendMail(mail);
      await mutate();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error inesperado";
      toast.error(`Hubo un error: ${errorMessage}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="bg-black hover:cursor-pointer p-2 rounded-lg text-white">
        Finalizar compra
      </DialogTrigger>
      <DialogContent className="bg-[#ecefdc]">
        <TypographyH1>Espera!</TypographyH1>
        <TypographyP className="text-gray-600">
          Necesitamos algunas cosas para continuar con el pago <br />
          No te molestaremos mas! :)
        </TypographyP>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormFieldWrapper
              name="receiver_name"
              label="Nombre del que recibe el pedido"
              placeholder="Nombre"
              form={form}
            />
            <FormFieldWrapper
              name="customer_name"
              label="Nombre del que realiza el pedido (el que esta llenando este formulario)"
              placeholder="Nombre"
              form={form}
            />
            <FormFieldWrapper
              name="address"
              label="Direccion de domicilio"
              placeholder="Dirección"
              form={form}
            />
            <FormFieldWrapper
              name="phone_number"
              label="Numero de telefono"
              placeholder="+57 123 456 7891"
              form={form}
            />
            <BoldPaymentButton amount={total} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
