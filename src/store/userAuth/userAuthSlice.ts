import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  authenticated: boolean;
  token: string | null;
}

// Este es el initialState, osea, el estado inicial (se haya logeado o no) será false
const initialState: UserState = {
  authenticated: false,
  token: null,
};

const userAuthSlice = createSlice({
  // Este es el nombre del slice
  name: "authenticated",
  // InitialState es el estado inicial que se tendrá, se haya logeado o no.
  initialState,
  // Este es el objeto que contiene las acciones que se pueden ejecutar a la hora de hacer un dispatch()
  reducers: {
    // Estas son las acciones que se pueden ejecutar
    logIn: (state, action: PayloadAction<{ token: string }>) => {
      state.authenticated = true;
      state.token = action.payload.token;
    },
    logOut: (state) => {
      state.authenticated = false;
      state.token = null;
    },
  },
});

export const { logIn, logOut } = userAuthSlice.actions;

export default userAuthSlice.reducer;
