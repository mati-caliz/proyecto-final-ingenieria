import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { LoggedUser } from './ResponsesTypes';

interface UserState {
  accessToken: string | null;
  email: string | null;
  isSubscribed: boolean | null;
}

const initialState: UserState = {
  accessToken: localStorage.getItem('accessToken') || null,
  email: localStorage.getItem('email') || null,
  isSubscribed: ('true' === localStorage.getItem('isSubscribed')) || null,
}

export const UsersSlice = createSlice({
  name: 'users',
  initialState: initialState,
  reducers: {
    setUser: (state, action: PayloadAction<LoggedUser>) => {
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('email', action.payload.user.email);
      localStorage.setItem('isSubscribed', String(action.payload.user.isSubscribed));
      console.log('LOGIN REDUCER READING ACTION: ', action)
      state.email = action.payload.user.email;
      state.accessToken = action.payload.accessToken;
      state.isSubscribed = action.payload.user.isSubscribed;
    },
    clearUser: (state) => {
      localStorage.removeItem('accessToken');
      state.email = null;
      state.accessToken = null;
      state.isSubscribed = null;
    }
  }
})

export const selectUser = (state: RootState) => state.user;

export const { setUser, clearUser } = UsersSlice.actions;

export default UsersSlice.reducer;
