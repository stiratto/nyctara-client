import { adminSections } from "@/lib/consts/admin-sections";
import { NavLink as Link } from "react-router-dom";
import { TypographyH1 } from "../Typography/h1";
import { TypographyP } from "../Typography/p";
import { useQuery } from "@tanstack/react-query";
import productsApi from "@/api/products/products.api";
import { useEffect } from "react";

const AdminPanel = () => {
  const { data } = useQuery({ queryKey: ["registered-users"], queryFn: () => productsApi.GetAllProducts() })

  useEffect(() => {
    console.log(data)
  }, [])

  return (
    <main className="flex flex-col gap-4 items-center justify-around py-24 w-full h-screen container">
      <div className="w-full space-y-4">
        {adminSections.map((section) => (
          <Link
            to={section.link}
            className="flex border border-gray-400 hover:shadow-xl transition-all hover:cursor-pointer rounded-lg p-8"
          >
            <div className="flex flex-col sm:flex-row gap-8 items-center">
              <span className="p-4 bg-black text-white rounded-full">
                {section.icon}
              </span>
              <div className="space-y-2">
                <TypographyH1>{section.title}</TypographyH1>
                <TypographyP className="text-gray-500">
                  {section.description}
                </TypographyP>
              </div>
            </div>
          </Link>
        ))}
      </div>


    </main>
  );
};

export default AdminPanel;
