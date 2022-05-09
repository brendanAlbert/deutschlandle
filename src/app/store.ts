import { configureStore} from "@reduxjs/toolkit";
import appReducer from '../features/app/appSlice';
import { loadState } from "./browserStorage";

export const store = configureStore({
    reducer: {
        app: appReducer,
    },
    // preloadedState: loadState()
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
