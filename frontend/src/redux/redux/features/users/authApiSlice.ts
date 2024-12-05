// authApiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import ApiConstants from "../../apiConstants/ApiConstants";
import { CreateUserRequest, LoginRequest } from "./RequestsTypes";
import { RootState } from "../../store";

interface GoogleLoginRequest {
    token: string;
}

interface User {
    isSubscribed: any;
    email: string;
    name: string;
    profile_picture?: string;
}

interface LoginResponse {
    access: string;
    refresh: string;
    user: User;
}

export const authApiSlice = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: ApiConstants.baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).user.accessToken;

            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (body: LoginRequest) => ({
                url: `${ApiConstants.userUrls.login}`,
                method: 'POST',
                body,
            }),
        }),
        register: builder.mutation<void, CreateUserRequest>({
            query: (body: CreateUserRequest) => ({
                url: `${ApiConstants.userUrls.root}`,
                method: 'POST',
                body,
            }),
        }),
        googleLogin: builder.mutation<LoginResponse, GoogleLoginRequest>({
            query: (body: GoogleLoginRequest) => ({
                url: `${ApiConstants.userUrls.login}`,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useGoogleLoginMutation } = authApiSlice;
