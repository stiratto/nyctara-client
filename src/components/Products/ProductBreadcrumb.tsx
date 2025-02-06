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
          <BreadcrumbLink>
            <Link to={`/`}>Inicio</Link>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink>Marcas</BreadcrumbLink>
          <BreadcrumbSeparator />
        </BreadcrumbItem>
        {category !== "PP" && (
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to={`/categoria/${id}`}>{category}</Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
        )}

        <BreadcrumbItem>
          <BreadcrumbPage>{name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default ProductBreadcrumb;
