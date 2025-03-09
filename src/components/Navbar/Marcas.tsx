"use client";
import categoriesApi from "@/api/categories/categories.api";
import { Category } from "@/interfaces/Category.Interface.ts";
import { RootState } from "@/store/store.ts";
import { logOut } from "@/store/userAuth/userAuthSlice.ts";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { LoaderCircle, LogOut, Search } from "lucide-react";
import { ShieldHalf } from "lucide-react";
import * as React from "react";
import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/utils.ts";
import { Input } from "../ui/input";

export function Marcas() {
  const userData = useSelector((state: RootState) => state.user.authenticated);
  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(logOut());
  };

  const [searchTerm, setSearchTerm] = useState("");

  let {
    isLoading,
    isError,
    data: categories,
  }: any = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.GetAllCategories(),
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
  };

  const filteredCategories = useMemo(() => categories?.length > 0 && categories?.filter((category: Category) =>
    category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  ), [searchTerm, categories])

  const [show, setShow] = useState(false);

  const reveal = () => {
    setShow(!show);
    document.querySelector("body")?.classList.toggle("no-scroll");
  };

  return (
    <div className="static! ">
      <button
        className={clsx("hamburguer cursor-pointer", show ? "active" : "z-10")}
        onClick={reveal}
      >
      </button>
      <div className={cn("transition-opacity", show ? "opacity-100 " : "opacity-0 pointer-events-none")}>
        {/* dark background */}
        <div className={cn("absolute inset-0 bg-black/70 w-full h-screen")} onClick={reveal}></div>
        <div className={cn(
          "bg-white rounded-xl p-8 h-fit flex flex-col justify-between  z-1000 absolute top-0 left-4 mx-2 sm:mx-16 sm:w-96 w-auto mt-14",
        )}>
          <ul className="flex flex-col gap-4 my-8">
            <div className="flex gap-2 items-center relative">
              <Input
                placeholder="Buscar categoria"
                type="text"
                value={searchTerm}
                className=""
                onChange={handleInputChange}
              />
              <Search size={17} className="relative right-8" />
            </div>
            <h1 className="font-bold text-4xl ">Marcas</h1>

            <div className="flex flex-col gap-4 max-h-64 px-4 overflow-y-scroll">
              {isLoading && <LoaderCircle className="animate-spin" />}
              {!isLoading && isError && <p className="text-red-500 font-bold">Ocurrio un error</p>}
              {!isLoading
                && !isError
                && filteredCategories
                && filteredCategories?.map((category: Category) => (

                  <NavLink
                    key={category.id}
                    to={`/categoria/${category.id}`}
                    className="border-b border-black"
                  >
                    {category.category_name}
                  </NavLink>
                ))}
            </div>
          </ul>
          {userData
            ? (
              <div className="flex gap-4 text-sm border-t pt-8">
                <button onClick={handleLogOut} >
                  <LogOut />
                </button>
                <Link to="/admin/admin-panel" >
                  <ShieldHalf />
                </Link>
              </div>
            )
            : <></>}
        </div>
      </div>
    </div >
  );
}

