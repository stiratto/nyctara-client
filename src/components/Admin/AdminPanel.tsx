import { adminSections } from "@/utils/consts/admin-sections";
import { NavLink as Link } from "react-router-dom";
import { TypographyH1 } from "../Typography/h1";
import { TypographyP } from "../Typography/p";

const AdminPanel = () => {

  return (
    <main className="flex flex-col gap-4 items-center justify-around py-24 w-full h-screen container">
      <div className="w-full space-y-4">
        {adminSections.map((section) => (
          <Link
            to={section.link}
            key={section.title}
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
