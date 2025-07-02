import { model, Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";
import { Book } from "./book.model";

const borrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

borrowSchema.pre("save", async function (next) {
  const borrow = this as any;

  const book = await Book.findById(borrow.book);

  if (!book) {
    return next(new Error("Book not found"));
  }

  if (!book.available || book.copies < borrow.quantity) {
    return next(new Error("Book not available or not enough copies"));
  }

  book.copies -= borrow.quantity;
  book.available = Book.bookAvailablity(book.copies);

  await book.save();

  next();
});
export const Borrow = model<IBorrow>("Borrow", borrowSchema);
