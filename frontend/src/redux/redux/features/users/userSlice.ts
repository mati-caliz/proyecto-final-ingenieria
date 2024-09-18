import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../store";
import { LoggedUser } from './ResponsesTypes';

interface UserState {
    accessToken: string | null;
    email: string | null;
}

const initialState: UserState = {
    accessToken: null,
    email: null,
}

export const UsersSlice = createSlice({
    name: 'users',
    initialState: initialState,
    reducers: {
        setUser: (state, action: PayloadAction<LoggedUser>) => {

            console.log('UsersSlice received state: ', state)
            console.log('and action: ', action)

            localStorage.setItem('accessToken', action.payload.accessToken);
            state.email = action.payload.user.email;
        }
    }
})

export const selectUser = (state: RootState) => state.user;

export const { setUser } = UsersSlice.actions;

export default UsersSlice.reducer;
