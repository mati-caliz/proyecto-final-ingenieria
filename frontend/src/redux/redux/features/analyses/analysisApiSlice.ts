import ApiConstants from '../../apiConstants/ApiConstants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import apiConstants from '../../apiConstants/ApiConstants';
import { RootState } from '../../store';
import { TextAnalysisRequest } from './RequestsTypes';

export const analysisApiSlice = createApi({
  reducerPath: 'transactionApi',
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
    getPreviousAnalyses: builder.mutation({
      query: () => {
        return {
          url: ApiConstants.analysisUrls.getPreviousAnalyses,
          method: 'GET',
        }
      }
    }),
    textAnalysis: builder.mutation({
      query: (body: TextAnalysisRequest) => {
        console.log('Body received: ', body)
        return {
          url: ApiConstants.analysisUrls.text,
          method: 'POST',
          body
        }
      }
    }),
  })
})

export const { useGetPreviousAnalysesMutation, useTextAnalysisMutation } = analysisApiSlice;
