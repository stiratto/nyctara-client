import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Category } from "@/interfaces/Category.Interface";
import { cn } from "@/lib/utils";
import { ExternalLink, Frown, Loader } from "lucide-react";
import { NavLink as Link } from "react-router-dom";

export const CategoryTable = ({ isLoading, isError, filteredResults }: { isLoading: boolean, isError: boolean, filteredResults: Category[] }) => {
  return (
    <Table className={cn("block h-[24rem] border border-gray-500  min-w-lg rounded-sm", filteredResults.length > 8 && "overflow-y-scroll")}>
      <TableHeader className="sticky top-0 bg-[#ecefdc] shadow-sm w-full min-w-lg">
        <TableRow className="">
          <TableHead className="w-[200px]">Categoria</TableHead>
          <TableHead>Fecha de creación</TableHead>
          <TableHead className="w-[100px]">Última vez actualizada</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className={cn("", (isLoading || isError || filteredResults.length === 0) && "flex flex-col justify-center items-center h-[20rem] ")}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader size={40} className="animate-spin" />
          </div>
        ) : isError ? (
          <div className="text-red-500 flex items-center gap-2">
            <Frown />
            <p className="text-red-500">Ocurrió un error inesperado.</p>
          </div>
        ) : filteredResults.length > 0 ? (
          filteredResults.map(category => (
            <TableRow className=" !border-gray-500" key={category.id}>
              <TableCell className="gap-2 w-[200px] min-w-[200px]">
                <Link to={`/admin/editar-categoria/${category.id}`} className="p-4 flex gap-2 text-blue-500 underline">
                  {category.category_name}
                  <ExternalLink size={20} />
                </Link>
              </TableCell>
              <TableCell>{new Date(category.createdAt as string).toLocaleDateString()}</TableCell>
              <TableCell className="min-w-[100px]">{new Date(category.updatedAt as string).toLocaleDateString()}</TableCell>
            </TableRow>
          ))
        ) : (
          <div className="">

            <p className="text-gray-500">No hay categorías con ese nombre.</p>
          </div>
        )}
      </TableBody>
    </Table >
  );
};

