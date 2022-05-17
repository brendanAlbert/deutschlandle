import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const base_url = import.meta.env.VITE_BASE_URL;

export const stateApi = createApi({
    reducerPath: 'stateApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${base_url}/api/`}),
    endpoints: (builder) => ({
        getTodaysState: builder.query<any, string>({
            query: () => `state`,
        }),
    }),
})

export const { useGetTodaysStateQuery } = stateApi