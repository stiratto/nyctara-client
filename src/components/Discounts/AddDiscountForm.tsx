"use client"

import { CalendarIcon } from "lucide-react"
import { SubmitHandler, useForm } from "react-hook-form"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TAddDiscountSchema, AddDiscountSchema } from "@/schemas/AddDiscountSchema"
import { Input } from "../ui/input"
import discountsApi from "@/api/discounts/discounts.api"
import queryClient from "@/main"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { Discount } from "@/interfaces/Discount.interface"

export function AddDiscountForm() {
  const form = useForm<TAddDiscountSchema>({
    resolver: zodResolver(AddDiscountSchema),
  })


  const { mutate: createDiscount } = useMutation({
    mutationKey: ["create-discount", form.getValues("discount_name")],
    mutationFn: (data) => discountsApi.CreateDiscount(data),
    onMutate: async (data) => {
      // optimistic performance
      // optimistic performance
      await queryClient.cancelQueries(["discounts"] as any);

      // snapshot in case of an error
      let previousDiscounts = queryClient.getQueryData(["discounts"])

      // push the new discount to the old data for an optimistic
      // performance
      queryClient.setQueryData(["discounts"], (oldData: Discount[]) => [...oldData, data])

      // return previousDiscount for context variable in onError fn to
      // be accesible
      return { previousDiscounts }
    },
    onError: (error, _, context) => {
      toast.error(`Hubo un error al crear el descuento: ${error.message}`);
      queryClient.setQueryData(["discounts"], context?.previousDiscounts);
      throw new Error(`Hubo un error al crear el descuento: ${error}`);
    }
  });


  const onSubmit: SubmitHandler<TAddDiscountSchema> = (data: any, e: any) => {
    try {
      e.preventDefault()
      createDiscount(data)
    } catch (err: any) {
      console.log(err)
      throw new Error(err)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField control={form.control} name="discount_name" render={({ field }) => (
          <FormItem>
            <FormLabel>
              Nombre del descuento
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="discount_total" render={({ field }) => (
          <FormItem className="relative">
            <FormLabel>
              Total del descuento (%)
            </FormLabel>
            <FormControl>
              <div>
                <span className="text-gray-600 absolute top-8 left-2">%</span>
                <Input type="number" {...field} className="w-min px-6" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField
          control={form.control}
          name="valid_until"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Valido hasta:</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Escoge una fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date("2030-1-1") || date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                La fecha hasta la cual el descuento sera valido.
                Inicia cuando se crea el descuento y finaliza en la fecha dada.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Crear descuento</Button>
      </form>
    </Form>
  )
}
