import { Request, Response, Router } from "express";
import { Borrow } from "../models/borrow.model";
import { z } from "zod";

export const borrowRoute = Router();

const borrowSchemaValidation = z.object({
  book: z.string(),
  quantity: z.number().min(1),
  dueDate: z.string().refine((date) => {
    const dueDate = new Date(date);
    return dueDate > new Date();
  }),
});
// 6. borrow a book
borrowRoute.post("/", async (req: Request, res: Response) => {
  try {
    const body = await borrowSchemaValidation.parseAsync(req.body);
    const data = await Borrow.create(body);

    res.status(200).json({
      success: true,
      message: "Book Borrowed Successfully",
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Borrow failed",
      error: error?.message || String(error),
    });
  }
});

//7. Borrowed Books Summary

borrowRoute.get("/", async (req: Request, res: Response) => {
  try {
    const data = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          let: { bookId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$bookId"] } } },
            { $project: { _id: 0, title: 1, isbn: 1 } },
          ],
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $project: {
          _id: 0,
          book: "$bookDetails",
          totalQuantity: 1,
        },
      },
    ]);

    // const data = await Borrow.aggregate([
    //   {
    //     $group: {
    //       _id: "$book",
    //       totalQuantity: { $sum: "$quantity" },
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "books",
    //       localField: "_id",
    //       foreignField: "_id",
    //       as: "bookDetails",
    //     },
    //   },
    //   { $unwind: "$bookDetails" },
    //   {
    //     $project: {
    //       _id: 0,
    //       book: {
    //         title: "$bookDetails.title",
    //         isbn: "$bookDetails.isbn",
    //       },
    //       totalQuantity: 1,
    //     },
    //   },
    // ]);
    res.status(200).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Borrowed books summary retrieved failed",
      error,
    });
  }
});
