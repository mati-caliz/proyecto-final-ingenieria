import userReducer from './features/users/userSlice'
import { authApiSlice } from './features/users/authApiSlice';
import { configureStore } from '@reduxjs/toolkit';
import { analysisApiSlice } from './features/analyses/analysisApiSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        [authApiSlice.reducerPath]: authApiSlice.reducer,
        [analysisApiSlice.reducerPath]: analysisApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware)=> {
        return getDefaultMiddleware()
          .concat(authApiSlice.middleware)
          .concat(analysisApiSlice.middleware)
    }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
