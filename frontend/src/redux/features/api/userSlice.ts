import { baseApi } from "../../../services/createApi";

export const userApiSlice = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getUser: build.query({
            query: () => '/api/user',
            providesTags: ["getUser"],
        }),
        logout: build.mutation({
            query: (body) => ({
                url: '/api/user/logout',
                method: 'POST',
                body
            }),
            invalidatesTags: ["getUser"]
        }),
    }),
});

export const { useGetUserQuery, useLogoutMutation } = userApiSlice;