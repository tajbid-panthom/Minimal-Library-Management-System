import { model, Schema } from "mongoose";
import {
  BookAvailableStaticMethod,
  IBoook,
} from "../interfaces/book.interface";

const bookSchema = new Schema<IBoook, BookAvailableStaticMethod>(
  {
    title: {
      type: String,
      require: true,
    },
    author: {
      type: String,
      require: true,
    },
    genre: {
      type: String,
      enum: [
        "FICTION",
        "NON_FICTION",
        "SCIENCE",
        "HISTORY",
        "BIOGRAPHY",
        "FANTASY",
      ],
      require: true,
    },
    isbn: {
      type: String,
      require: true,
      unique: true,
    },
    description: {
      type: String,
    },
    copies: {
      type: Number,
      require: true,
      min: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
bookSchema.static("bookAvailablity", function (copies: number) {
  if (copies < 1) {
    return false;
  }
  return true;
});
export const Book = model<IBoook, BookAvailableStaticMethod>(
  "Book",
  bookSchema
);
