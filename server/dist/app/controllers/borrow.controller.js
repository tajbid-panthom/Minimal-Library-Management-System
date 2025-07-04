"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowRoute = void 0;
const express_1 = require("express");
const borrow_model_1 = require("../models/borrow.model");
const zod_1 = require("zod");
exports.borrowRoute = (0, express_1.Router)();
const borrowSchemaValidation = zod_1.z.object({
    book: zod_1.z.string(),
    quantity: zod_1.z.number().min(1),
    dueDate: zod_1.z.string().refine((date) => {
        const dueDate = new Date(date);
        return dueDate > new Date();
    }),
});
// 6. borrow a book
exports.borrowRoute.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield borrowSchemaValidation.parseAsync(req.body);
        const data = yield borrow_model_1.Borrow.create(body);
        res.status(200).json({
            success: true,
            message: "Book Borrowed Successfully",
            data,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Borrow failed",
            error: (error === null || error === void 0 ? void 0 : error.message) || String(error),
        });
    }
}));
//7. Borrowed Books Summary
exports.borrowRoute.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield borrow_model_1.Borrow.aggregate([
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
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Borrowed books summary retrieved failed",
            error,
        });
    }
}));
