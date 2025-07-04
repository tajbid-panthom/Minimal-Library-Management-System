import type { IBook } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const apiUrl = import.meta.env.VITE_API_URL;
interface IBorrowSummaryItem {
  book: {
    title: string;
    isbn: string;
  };
  totalQuantity: number;
}

interface IBorrowSummaryResponse {
  success: boolean;
  message: string;
  data: IBorrowSummaryItem[];
}

export const borrowApi = createApi({
  reducerPath: "borrowApi",
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  tagTypes: ["borrows"],
  endpoints: (builder) => ({
    getBorrowSummary: builder.query<IBorrowSummaryResponse, void>({
      query: () => "borrow",
      providesTags: ["borrows"],
    }),
    borrowBook: builder.mutation<
      IBook,
      { book: string; quantity: number; dueDate: string }
    >({
      query: (body) => ({
        url: `borrow/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["borrows"],
    }),
  }),
});

export const { useGetBorrowSummaryQuery, useBorrowBookMutation } = borrowApi;
