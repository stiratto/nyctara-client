import { Layers, ShoppingCart, Tags } from "lucide-react";

export const adminSections = [
  {
    title: "Productos",
    description: "Administra los productos",
    link: "/admin/productos",
    icon: <ShoppingCart size={30} />,
  },
  {
    title: "Categorias",
    description: "Administra las categorias",
    link: "/admin/categorias",
    icon: <Layers size={30} />,
  },
  {
    title: "Descuentos",
    description: "Administra los descuentos",
    link: "/admin/descuentos",
    icon: <Tags size={30} />,
  },
];
