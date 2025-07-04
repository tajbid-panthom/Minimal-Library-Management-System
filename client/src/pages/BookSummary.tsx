import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetBorrowSummaryQuery } from "@/redux/api/borrowApi";

export default function BorrowSummary() {
  const { data, error, isLoading } = useGetBorrowSummaryQuery();

  if (isLoading) return <p>Loading borrow summary...</p>;
  if (error)
    return <p className="text-red-600">Failed to load borrow summary.</p>;

  if (!data || !data.success) {
    return <p>No borrow summary available.</p>;
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center sm:text-left">
        Borrow Summary
      </h2>

      {/* 👉 Mobile Cards */}
      <div className="sm:hidden space-y-4">
        {data.data.map(({ book, totalQuantity }, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 shadow-sm bg-white space-y-1"
          >
            <p>
              <span className="font-medium text-gray-600">Title:</span>{" "}
              {book.title}
            </p>
            <p>
              <span className="font-medium text-gray-600">ISBN:</span>{" "}
              {book.isbn}
            </p>
            <p>
              <span className="font-medium text-gray-600">Total Borrowed:</span>{" "}
              {totalQuantity}
            </p>
          </div>
        ))}
      </div>

      {/* 👉 Desktop Table */}
      <div className="hidden sm:block overflow-x-auto border border-gray-200 rounded-lg">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Book Title</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Total Quantity Borrowed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map(({ book, totalQuantity }, index) => (
              <TableRow key={index}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>{totalQuantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
