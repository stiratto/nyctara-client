import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const BoldPaymentButton = () => {


   const cartProducts = useSelector((state: RootState) => state.cart.products)

   return (
      <Button 
         type="submit"
         className="w-full bg-black hover:bg-black/50" 
         disabled={cartProducts.length <= 0}
      >Proceder con la compra</Button>
   );
};

export default BoldPaymentButton;

