import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { IBook, IBookResponse } from "@/types";

const apiUrl = import.meta.env.VITE_API_URL;
export const bookApi = createApi({
  reducerPath: "bookApi",
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  tagTypes: ["books"], // Define tagTypes here
  endpoints: (builder) => ({
    // In bookApi.ts
    getBooks: builder.query<IBookResponse, { page?: number }>({
      query: ({ page = 1 }) => {
        const limit = 10;
        const skip = (page - 1) * limit;
        return `books?sortBy=createdAt&sort=desc&limit=${limit}&skip=${skip}`;
      },
      providesTags: ["books"],
    }),

    createBook: builder.mutation<IBook, Partial<IBook>>({
      query: (newBook) => ({
        url: "books",
        method: "POST",
        body: newBook,
      }),
      invalidatesTags: ["books"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: createdBook } = await queryFulfilled;
          dispatch(
            bookApi.util.updateQueryData("getBooks", { page: 1 }, (draft) => {
              draft.data.unshift(createdBook);
            })
          );
        } catch (error) {
          console.error(error);
        }
      },
    }),

    updateBook: builder.mutation<IBook, Partial<IBook>>({
      query: (book) => ({
        url: `books/${book._id}`,
        method: "PUT",
        body: book,
      }),
      invalidatesTags: ["books"],
    }),

    deleteBook: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `books/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["books"],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = bookApi;
