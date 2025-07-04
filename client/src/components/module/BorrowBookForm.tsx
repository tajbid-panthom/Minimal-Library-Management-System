import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { IBook } from "@/types";

interface BorrowBookFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { quantity: number; dueDate: string }) => void;
  book: IBook | null;
}

export function BorrowBookForm({
  open,
  onClose,
  onSubmit,
  book,
}: BorrowBookFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = () => {
    if (!book || quantity <= 0 || !dueDate) return;
    if (quantity > book.copies) {
      alert("Quantity exceeds available copies.");
      return;
    }
    onSubmit({ quantity, dueDate });
    setQuantity(1);
    setDueDate("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>Borrow Book</DialogHeader>
        <p className="text-sm mb-2">
          Borrowing: <strong>{book?.title}</strong>
        </p>
        <Input
          type="number"
          min={1}
          max={book?.copies}
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <Input
          type="date"
          placeholder="Due Date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Confirm Borrow</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
