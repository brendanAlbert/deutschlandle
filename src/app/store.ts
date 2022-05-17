import { configureStore} from "@reduxjs/toolkit";
import appReducer from '../features/app/appSlice';
// import { loadState } from "./browserStorage";
import { stateApi } from '../services/stateFetch';

export const store = configureStore({
    reducer: {
        app: appReducer,
        [stateApi.reducerPath]: stateApi.reducer,
    },
    // preloadedState: loadState()
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(stateApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
