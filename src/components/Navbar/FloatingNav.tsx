"use client";
import { cn } from "../../lib/utils";
import { Marcas } from "./Marcas";
import Cart from "@/components/Cart/Cart";
import { SearchBar } from "./SearchBar";
import { NavLink as Link } from "react-router-dom";
import { AvailableCoupon } from "./AvailableDiscount";

export const Navbar = () => {
  return (
    <header
    >
      <div className={cn(
        "w-full flex items-center justify-around z-50 fixed top-0 sm:px-[6em] bg-[#D3DAAE]",
      )}>

        <div className="flex items-center gap-8">
          <Marcas />
        </div>
        {/* Brands / Categories */}

        {/* Nyctara image */}
        <Link to={"/"}>
          <img
            src="https://nyctara-perfumery-static.s3.us-east-1.amazonaws.com/nyctara%2Bgrande.webp"
            alt=""
            className="w-16 h-16 object-cover"
          />
        </Link>

        <ul className="flex items-center justify-center gap-8">
          <li className="flex items-center gap-2 text-sm">
            <SearchBar />
          </li>
          <li className="flex items-center gap-2 text-sm hover:scale-110 duration-300 ">
            <Cart />
          </li>
        </ul>
      </div>

      <AvailableCoupon />
    </header>
  );
};
