import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api.js";
import { configSlice } from "./config-slice.js";

export const buildEngine = () => configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      [configSlice.name]: configSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

export type Engine = ReturnType<typeof buildEngine>;
export type State = ReturnType<Engine["getState"]>;