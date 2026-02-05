import { baseApi } from "../../../services/createApi";

export const authApiSlice = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        signup: builder.mutation({
            query: (body) => ({
                url: '/api/auth/signup',
                method: 'POST',
                body,
            }),
        }),
        login: builder.mutation({
            query: (body) => ({
                url: '/api/auth/login',
                method: 'POST',
                body
            }),
        })
    })
});

export const { useSignupMutation, useLoginMutation } = authApiSlice;