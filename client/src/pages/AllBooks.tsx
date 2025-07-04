import BookList from "@/components/module/BookList";
import { useGetBooksQuery } from "@/redux/api/bookApi";
import { useState } from "react";

export default function AllBooks() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useGetBooksQuery({ page });

  if (isLoading) return <p className="text-gray-600">Loading books...</p>;
  if (isError)
    return (
      <p className="text-red-500">
        {"status" in error ? `Error ${error.status}` : "Something went wrong!"}
      </p>
    );

  const books = data?.data || [];
  const total = data?.meta?.total || 0;
  const totalPages = Math.ceil(total / 10);

  return (
    <div className="px-4 py-6 space-y-4">
      <BookList books={books} />
      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <button
          disabled={page === 1}
          className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span className="px-2 font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
