import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NavLink as Link } from "react-router-dom";

const ProductBreadcrumb = ({ category, name, id }: any) => {
  return (
    <Breadcrumb>
      <BreadcrumbList className="flex flex-row items-center">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={`/`}>Inicio</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink>Marcas</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {category !== "PP" && (
          <BreadcrumbItem >
            <BreadcrumbLink asChild>
              <Link to={`/categoria/${id}`} className="underline">{category}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}

        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default ProductBreadcrumb;
