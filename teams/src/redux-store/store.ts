import { configureStore, DeepPartial } from "@reduxjs/toolkit";
import { rootReducer, RootState } from "./index";

// configure store wraps redux createStore api

export default function configureAppStore(preloadedState?: DeepPartial<any>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export type Store = ReturnType<typeof configureAppStore>;
