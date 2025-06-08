import { getAxiosErrorResponse } from "@/utils/utils"
import apiClient from ".."

const CreatePaymentLink = async (amount: any) => {
   try {
      const body = {
         amount
      }
      const response = await apiClient.post('/payments/newOrder', body)
      return response.data
   } catch (err: any) {
      const errorMessage = getAxiosErrorResponse(err)
      return errorMessage
   }

}

const GetPaymentStatus = async (paymentLink: string) => {
   try {
      const response = await apiClient.post(`/payments/get-payment-status/${paymentLink}`)
      return response.data
   } catch (err: any) {
      const errorMessage = getAxiosErrorResponse(err)
      return errorMessage
   }
}

export default { CreatePaymentLink, GetPaymentStatus }
