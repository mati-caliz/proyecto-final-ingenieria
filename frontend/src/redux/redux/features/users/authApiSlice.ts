import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import ApiConstants from "../../apiConstants/ApiConstants";
import {CreateUserRequest, LoginRequest} from "./RequestsTypes";
import {RootState} from "../../store";

export const authApiSlice = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: ApiConstants.baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).user.accessToken

            // If we have a token set in state, let's assume that we should be passing it.
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    endpoints: (builder)=> ({
        login: builder.mutation({
            query: (body: LoginRequest) => {
              console.log('Received login data: ', body)
                return {
                    url: ApiConstants.userUrls.login,
                    method: 'POST',
                    body,
                }
            }
        }),
        register: builder.mutation({
            query: (body: CreateUserRequest) => {
                return {
                    url: ApiConstants.userUrls.root,
                    method: 'POST',
                    body,
                }
            }
        }),
    })
})

export const { useLoginMutation } = authApiSlice;
