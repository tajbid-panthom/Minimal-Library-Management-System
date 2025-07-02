import { Request, Response, Router } from "express";
import { Book } from "../models/book.model";
import { z } from "zod";

export const bookRoute = Router();

const bookSchemaValidation = z.object({
  title: z.string(),
  author: z.string(),
  genre: z.enum([
    "FICTION",
    "NON_FICTION",
    "SCIENCE",
    "HISTORY",
    "BIOGRAPHY",
    "FANTASY",
  ]),
  isbn: z.string(),
  description: z.string().optional(),
  copies: z.number().min(0),
  available: z.boolean().default(true),
});
// 1.book created route
bookRoute.post("/", async (req: Request, res: Response) => {
  try {
    const body = await bookSchemaValidation.parseAsync(req.body);
    const data = await Book.create(body);
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data,
    });
  } catch (error) {
    res.status(400).json({
      message: "Book created Failed",
      success: false,
      error,
    });
  }
});
// 2. get all books route
bookRoute.get("/", async (req: Request, res: Response) => {
  try {
    const { filter, sortBy: rawSortBy, sort: rawSort, limit } = req.query;

    const sortBy = (rawSortBy as string) || "createdAt";
    const sort = rawSort === "desc" ? -1 : 1;

    const data = await Book.find({ genre: filter })
      .sort({ [sortBy]: sort })
      .limit(parseInt(limit as string) || 10);
    if (!data) {
      throw new Error("Book not found");
    }
    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data,
    });
  } catch (error) {
    res.status(400).json({
      message: "Books retrieved Failed",
      success: false,
      error: {
        message: (error as Error).message,
      },
    });
  }
});
// 3. get single book route
bookRoute.get("/:bookId", async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const data = await Book.findById(bookId);
    if (!data) {
      throw new Error("Book not found");
    }
    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data,
    });
  } catch (error) {
    res.status(400).json({
      message: "Book retrieved failed",
      success: false,
      error: {
        message: (error as Error).message,
      },
    });
  }
});
// 4. update book route
bookRoute.put("/:bookId", async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const body = req.body;
    const data = await Book.findByIdAndUpdate(bookId, body, { new: true });
    if (!data) {
      throw new Error("Book not found");
    }
    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data,
    });
  } catch (error) {
    res.status(400).json({
      message: "Book updated failed",
      success: false,
      error: {
        message: (error as Error).message,
      },
    });
  }
});
bookRoute.delete("/:bookId", async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;

    const data = await Book.findByIdAndDelete(bookId);
    if (!data) {
      throw new Error("Book not found");
    }
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      message: "Book deletion failed",
      success: false,
      error: {
        message: (error as Error).message,
      },
    });
  }
});
