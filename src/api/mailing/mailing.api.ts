import { Mail } from "@/interfaces/Mailing.Interface.ts";
import apiClient from "../index.ts";
import { getAxiosErrorResponse } from "@/utils/utils.ts";

const SendMail = async (mail: Mail) => {
   try {
      const response = await apiClient.post(`/mailing/send-mail`, mail)
      return response.data
   } catch (err: any) {
      const error = getAxiosErrorResponse(err)
      throw new Error(error)
   }
}

export default { SendMail }
