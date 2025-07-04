import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IBook } from "@/types";
import { useState } from "react";
import {
  useDeleteBookMutation,
  useUpdateBookMutation,
} from "@/redux/api/bookApi";
import { BorrowBookForm } from "./BorrowBookForm";
import { useBorrowBookMutation } from "@/redux/api/borrowApi";
import { useNavigate } from "react-router";
import { EditBookModal } from "./EditBookModal";
import { toast } from "sonner";

interface BookListProps {
  books: IBook[];
}

export default function BookList({ books }: BookListProps) {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [borrowBook] = useBorrowBookMutation();
  const [deleteBook] = useDeleteBookMutation();
  const [updateBook] = useUpdateBookMutation();

  const handleBorrow = async ({
    quantity,
    dueDate,
  }: {
    quantity: number;
    dueDate: string;
  }) => {
    if (!selectedBook) return;
    try {
      await borrowBook({
        book: selectedBook._id,
        quantity,
        dueDate,
      }).unwrap();

      const updatedCopies = selectedBook.copies - quantity;

      await updateBook({
        _id: selectedBook._id,
        copies: updatedCopies,
        available: updatedCopies > 0,
      });

      toast.success(
        `✅ You borrowed ${quantity} copy(ies) of "${selectedBook.title}"`
      );

      setSelectedBook(null);
      navigate("/borrow-summary");
    } catch (error) {
      console.error("Borrow failed:", error);
      toast.error("❌ Borrow failed. Please try again.");
    }
  };

  const handleDelete = async (book: IBook) => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      try {
        await deleteBook(book._id).unwrap();
        toast.success(`🗑️ "${book.title}" has been deleted.`);
      } catch (error) {
        console.error("Delete failed:", error);
        toast.error("❌ Delete failed. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">📚 Book List</h1>

      {/* 📱🟪 Mobile + Tablet (card layout) */}
      <div className="space-y-4 lg:hidden">
        {books.length > 0 ? (
          books.map((book) => (
            <div
              key={book._id}
              className="w-full border rounded-xl p-4 sm:p-6 shadow-sm space-y-2 bg-white"
            >
              <h2 className="text-lg font-semibold">{book.title}</h2>
              <p className="text-sm text-gray-600">Author: {book.author}</p>
              <p className="text-sm text-gray-600">Genre: {book.genre}</p>
              <p className="text-sm text-gray-600">ISBN: {book.isbn}</p>
              <p className="text-sm text-gray-600">Copies: {book.copies}</p>
              <p className="text-sm">
                <Badge variant={book.available ? "default" : "destructive"}>
                  {book.available ? "Available" : "Unavailable"}
                </Badge>
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {book.available && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedBook(book);
                      setShowBorrowForm(true);
                    }}
                  >
                    Borrow
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedBook(book);
                    setShowEditModal(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(book)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            No books available.
          </p>
        )}
      </div>

      {/* 💻 Desktop (table layout) */}
      <div className="hidden lg:block overflow-x-auto">
        <Table className="min-w-full">
          <TableCaption>A list of all books in the library.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Copies</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length > 0 ? (
              books.map((book) => (
                <TableRow key={book._id}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.genre}</TableCell>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>{book.copies}</TableCell>
                  <TableCell>
                    <Badge variant={book.available ? "default" : "destructive"}>
                      {book.available ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col sm:flex-row justify-end gap-1 sm:gap-2">
                      {book.available && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setSelectedBook(book);
                            setShowBorrowForm(true);
                          }}
                        >
                          Borrow
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBook(book);
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(book)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-6"
                >
                  No books available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      <EditBookModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedBook(null);
        }}
        book={selectedBook}
      />
      <BorrowBookForm
        open={showBorrowForm}
        onClose={() => {
          setShowBorrowForm(false);
          setSelectedBook(null);
        }}
        onSubmit={handleBorrow}
        book={selectedBook}
      />
    </div>
  );
}
