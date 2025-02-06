enum PaymentMethodEnum {
  TRANSFERENCIA = "Transferencia",
  CONSIGNACION = "Consignacion",
}

export interface CartFormData {
  name: string;
  number: string;
  address: string;
  city: string;
  paymentMethod?: PaymentMethodEnum;
}

export default PaymentMethodEnum;
