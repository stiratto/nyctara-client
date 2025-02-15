import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Other/Input";

export const SearchBar = () => {
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState("");
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();


   const handleSearch = () => {
    setShow(true);
    inputRef?.current?.focus();
    const searchValue = query.trim();

    if (searchValue.length < 1) setShow(!show);
    if (searchValue.length > 1 && show === false) {
      return setShow(true);
    }
    if (searchValue.length > 1) {
      navigate(`/busqueda?query=${query}`);
      setShow(false);
    }
  };

  useEffect(() => {
    inputRef?.current?.addEventListener("keydown", (e: any) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    });
  }, []);

  return (
    <div className="relative w-full z-10" ref={divRef}>
      <div className="flex items-center justify-center w-full gap-4">
        <button
          type="button"
          className="cursor-pointer relative z-900"
          onClick={handleSearch}
          id="button"
        >
          <Search size={18} />
        </button>
      </div>
      {show
        ? (
          <div className="fixed inset-0 z-800">
            <div className="relative">
              <div
                className="absolute w-screen h-screen left-0 top-0 inset-0 bg-black/70 "
                onClick={() => setShow(!show)}
              >
              </div>

              <form
                className="bg-white rounded-xl p-8 flex flex-col justify-between my-16 z-1100 absolute top-0 right-4 mx-2 md:mx-24"
                onSubmit={handleSearch}
              >
                {show && (
                  <Input
                    name="search"
                    type="text"
                    placeholder="Busca un producto"
                    className="p-2 z-900 placeholder:text-xs md:placeholder:text-sm"
                    onChange={(e) => setQuery(e.target.value)}
                  />
                )}
              </form>
            </div>
          </div>
        )
        : (
          ""
        )}
    </div>
  );
};
