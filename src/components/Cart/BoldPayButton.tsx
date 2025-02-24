import { useEffect } from "react";

const BoldPaymentButton = ({ amount }: { amount?: number }) => {
   useEffect(() => {
      const script = document.createElement("script");
      script.src = "https://checkout.bold.co/library/boldPaymentButton.js";
      script.async = true;
      document.head.appendChild(script);

      return () => {
         document.head.removeChild(script);
      };
   }, []);

   return (
      <div>
         <script
            data-bold-button="light-M"
            data-currency="COP"
            data-render-mode="embedded"
            data-amount={amount && amount > 0 ? amount : 0}
            data-api-key="tSnlmT97eezOH5D9udVi_ji8_XTGNQ7NzAAsw77eeDM"
         ></script>
      </div>

   );
};

export default BoldPaymentButton;

