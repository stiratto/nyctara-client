import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

interface NavItem {
  icon: JSX.Element;
  name: string;
  link: string;
}

interface NavItemsProps {
  navItems: NavItem[];
}

export const NavItems: React.FC<NavItemsProps> = ({ navItems }) => {
  return (
    <div className="flex items-center justify-center">
      {navItems.map((navItem, idx) => (
        <Link
          key={idx}
          to={navItem.link}
          className={cn(
            " dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500 nav-item hover:scale-125 duration-300  select-none",
          )}
        >
          <span>{navItem.icon}</span>
          <span className="sm:block text-sm  text-black">{navItem.name}</span>
        </Link>
      ))}
    </div>
  );
};
