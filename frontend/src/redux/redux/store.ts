import userReducer from './features/users/userSlice'
import { authApiSlice } from './features/users/authApiSlice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        user: userReducer,
        [authApiSlice.reducerPath]: authApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware)=> {
        return getDefaultMiddleware().concat(authApiSlice.middleware)
    }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
