import PaymentMethodEnum from "@/interfaces/Cart.Interface";
import * as yup from "yup";

export const CartFormDataSchema = yup.object().shape({
  name: yup.string().required("El nombre del producto es requerido"),
  number: yup
    .string()
    .matches(/3[0-9]{9}/gm, "El número de teléfono no es válido")
    .required("El precio del producto es requerido"),
  paymentMethod: yup.mixed<PaymentMethodEnum>().oneOf(Object.values(PaymentMethodEnum)),
  address: yup.string().required("La dirección del producto es requerida"),
  city: yup.string().required("La ciudad del producto es requerida"),
});
