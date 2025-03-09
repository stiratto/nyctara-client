import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import paymentsApi from "@/api/payment/payments.api";

const BoldPaymentButton = ({ amount }: { amount?: number }) => {
   const { mutate } = useMutation({
      mutationKey: ['bold-payment-link'],
      mutationFn: () => paymentsApi.CreatePaymentLink(amount),
      onSuccess: (data) => {
         const url = data.payload.url
         window.location.replace(url)
      }
   })

   return (
      <div>
         <Button onClick={() => mutate()} className="w-full bg-black hover:bg-black/50">Proceder con la compra</Button>
      </div>
   );
};

export default BoldPaymentButton;

