import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import productsApi from "@/api/products/products.api";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import queryClient from "@/main";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { addNewFiltering } from "@/store/filtering/FilteringSlice";

export const FilterByPrice = () => {
  const { id } = useParams();
  const [minMax, setMinMax] = useState({
    min: "",
    max: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const { filters, params } = useSelector(
    (state: RootState) => state.filtering
  );

  const handleFiltering = (price: any) => {
    if (minMax.min.length !== 0 && minMax.max.length !== 0) {
      dispatch(
        addNewFiltering({ by: "price", param: `${minMax.min},${minMax.max}` })
      );
      refetch();
      setMinMax({ min: "", max: "" });
      return;
    }

    dispatch(addNewFiltering({ by: "price", param: price }));
    queryClient.invalidateQueries({ queryKey: ["filtered-products"] }); // Fuerza una nueva consulta
  };

  const { refetch } = useQuery({
    queryKey: ["filtered-products", filters.price],
    queryFn: async () => {
      const response = await productsApi.FilterProducts(params, id as string);
      queryClient.setQueryData(["category-products", id], response);
      return response;
    },
    enabled: !!filters.price,
  });

  return (
    <div>
      <div className="text-sm space-y-4 flex flex-col bg-[#ecefdc] text-black">
        <RadioGroup
          onValueChange={(e) => {
            handleFiltering(e);
          }}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="20000,50000" />
            <span>De $20.000 a $50.000</span>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="50000,100000" />
            <span>De $50.000 a $100.000</span>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="100000,500000" />
            <span>De $100.000 a $500.000</span>
          </div>
        </RadioGroup>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Minimo"
            onChange={(e) => {
              setMinMax((prev) => ({ ...prev, min: e.target.value }));
            }}
          />
          <Input
            placeholder="Maximo"
            onChange={(e) => {
              setMinMax((prev) => ({ ...prev, max: e.target.value }));
            }}
          />
        </div>
        <Button
          className="w-min rounded-full mx-auto bg-black hover:bg-black/50"
          disabled={minMax.min.length < 1 && minMax.max.length < 1}
          onClick={handleFiltering}
        >
          Aplicar
        </Button>
      </div>
    </div>
  );
};
