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
import { RootState } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Product } from "@/interfaces/Product.Interface";

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
      <DialogTrigger>
        <Button variant={"destructive"}>Eliminar producto</Button>
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
            onClick={() => deleteProduct(id)}
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
