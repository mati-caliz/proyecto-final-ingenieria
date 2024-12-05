import ApiConstants from '../../apiConstants/ApiConstants';
import apiConstants from '../../apiConstants/ApiConstants';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {RootState} from '../../store';

export const subscriptionApiSlice = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiConstants.baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.accessToken
      console.log('baseQuery reading token: ', token)
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder)=> ({
    createSubscription: builder.mutation({
      query: () => {
        return {
          url: ApiConstants.subscriptionUrls.createSubscription,
          method: 'POST',
        }
      }
    }),
  })
})

export const {
  useCreateSubscriptionMutation,
} = subscriptionApiSlice;
