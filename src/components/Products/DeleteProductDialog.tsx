import productsApi from "@/api/products/products.api";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import queryClient from "@/main";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";

export const DeleteProductDialog = ({ id }: { id: string }) => {
  const navigate = useNavigate();

  const { mutate: deleteProduct } = useMutation({
    mutationFn: () => productsApi.DeleteProduct(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["category-products"] });
    },
    onSuccess: () => {
      toast.success("Producto eliminado");
      navigate("/");
    },
    onError: (err, context) => {
      toast.error("No se pudo eliminar el producto");
      throw err;
    },
  });
  return (
    <Dialog>
      <DialogTrigger className="bg-red-600 text-white rounded text-sm font-semibold p-3 w-max hover:bg-red-800">
        Eliminar producto
      </DialogTrigger>
      <DialogContent className="bg-[#ecefdc]">
        <DialogHeader>
          <DialogTitle>
            Estás seguro que quieres eliminar este producto?
          </DialogTitle>
          <DialogDescription>
            Esta accion no es irreversible. Va a eliminar permanentemente el producto.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <Button
            variant={"destructive"}
            onClick={() => deleteProduct(id as string)}
          >
            Si
          </Button>
          <DialogClose>
            <Button variant={"outline"}>No</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
