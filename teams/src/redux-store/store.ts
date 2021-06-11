import { configureStore, DeepPartial } from '@reduxjs/toolkit';
import { rootReducer, RootState } from './index'

export default function configureAppStore(preloadedState?: DeepPartial<RootState>) {
    return configureStore({
        reducer: rootReducer,
        preloadedState
    });
}

export type Store = ReturnType<typeof configureAppStore>;