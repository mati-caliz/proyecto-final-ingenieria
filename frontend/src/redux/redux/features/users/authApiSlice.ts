// authApiSlice.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import ApiConstants from "../../apiConstants/ApiConstants";
import { CreateUserRequest, LoginRequest } from "./RequestsTypes";
import { RootState } from "../../store";

// Define los tipos de las solicitudes y respuestas
interface GoogleLoginRequest {
    token: string;
}

interface User {
    email: string;
    name: string;
    profile_picture?: string;
}

interface LoginResponse {
    access: string; // Token de acceso
    refresh: string; // Token de refresco
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
        // Endpoint para login tradicional con usuario y contraseña
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (body: LoginRequest) => {
                console.log('Received login data: ', body);
                return {
                    url: ApiConstants.userUrls.login,
                    method: 'POST',
                    body,
                };
            },
        }),
        // Endpoint para registrar un nuevo usuario
        register: builder.mutation<void, CreateUserRequest>({
            query: (body: CreateUserRequest) => {
                return {
                    url: ApiConstants.userUrls.root,
                    method: 'POST',
                    body,
                };
            },
        }),
        // Endpoint para login con Google
        googleLogin: builder.mutation<LoginResponse, GoogleLoginRequest>({
            query: (body: GoogleLoginRequest) => {
                return {
                    url: ApiConstants.userUrls.login,
                    method: 'POST',
                    body,
                };
            },
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useGoogleLoginMutation } = authApiSlice;
