import discountsApi from "@/api/discounts/discounts.api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Discount } from "@/interfaces/Discount.interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export const ExistingDiscounts = () => {
  const queryClient = useQueryClient()

  const {
    data: discounts,
    isLoading: gettingDiscounts,
    isError: gettingDiscountsError,
  } = useQuery<Discount[]>({
    queryKey: ["discounts"],
    queryFn: () => discountsApi.GetDiscounts(),
  });

  const { mutate: deleteDiscount } = useMutation({
    mutationFn: (id: string) => discountsApi.DeleteDiscount(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["discounts"] });

      const previousDiscounts = queryClient.getQueryData(["discounts"]);

      queryClient.setQueryData(
        ["discounts"],
        (oldData: any) => oldData?.filter((discount: Discount) => discount.id !== id),
      );
      return { previousDiscounts };
    },

    onSuccess: () => {
      toast.success("Descuento eliminado correctamente");
    },
    onError: ({ error, context }: any) => {
      queryClient.setQueryData(["discounts"], context.previousDiscounts);
      toast.error("Hubo un error al eliminar el descuento");
      throw new Error(`Ocurrio un error: ${error}`);
    },
  });

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm mx-auto justify-center overflow-y-scroll max-h-[18rem]">
      <h1>Descuentos que ya existen</h1>
      {gettingDiscounts && <LoaderCircle className="animate-spin" />}
      {!gettingDiscounts && gettingDiscountsError && (
        <p className="text-red-500">
          Ocurrio un error al obtener los descuentos
        </p>
      )}
      <Table>
        <TableHeader>
          <TableHead>Nombre</TableHead>
          <TableHead>Total</TableHead>
        </TableHeader>
        <TableBody>
          {!gettingDiscounts
            && !gettingDiscountsError
            && discounts
            && discounts?.map((discount) => (
              <TableRow
                key={discount.id}
                className="bg-transparent! text-black!"
              >
                <TableCell>{discount.discount_name}</TableCell>
                <TableCell>{discount.discount_total}</TableCell>
                <TableCell>
                  <Button
                    className="bg-red-500 hover:bg-red-200 p-3"
                    onClick={() => deleteDiscount(discount.id as string)}
                  >
                    <X size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

