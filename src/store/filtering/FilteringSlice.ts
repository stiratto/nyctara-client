import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// la store de filtrado puede guardar 2 valores, el objeto que
// contiene los filtrados y los query parameters creados a partir del
// objeto que contiene los filtrados
//
// filtrados disponibles
type ByType = "price" | "availability" | "notes"
// parametros que se les asigna a los filtrados
type ParamType = number[] | string[] | string | null


export type FiltersStateType = {
   price: string,
   availability?: "true" | "false" | "",
   notes?: string[],
}

type FilteringState = {
   filters: FiltersStateType;
   params: string
};

const initialState: FilteringState = {
   filters: {} as FiltersStateType,
   params: ""
};

export const filteringSlice = createSlice({
   name: "filtering",
   initialState,
   reducers: {
      // when a new filter gets added, the params is built
      addNewFiltering: (state, action: PayloadAction<{ by: ByType, param: ParamType }>) => {
         // extract the fields from the payload
         const by = action.payload.by
         const param = action.payload.param

         state.filters = { ...state.filters, [by]: param }

         const urlParams = new URLSearchParams()

         for (let [k, v] of Object.entries(state.filters)) {
            if (v !== "" && v.length !== 0) {
               urlParams.append(k, Array.isArray(v) ? v.join(",") : v ?? "")
            }
         }

         state.params = urlParams.toString()
      },
      clearFiltering: (state) => {
         state.filters = { price: '', notes: [], availability: '' }
         state.params = ""
      }
   },

});

export const { addNewFiltering, clearFiltering } = filteringSlice.actions;

export default filteringSlice.reducer;

