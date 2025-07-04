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
exports.bookRoute = void 0;
const express_1 = require("express");
const book_model_1 = require("../models/book.model");
const zod_1 = require("zod");
exports.bookRoute = (0, express_1.Router)();
const bookSchemaValidation = zod_1.z.object({
    title: zod_1.z.string(),
    author: zod_1.z.string(),
    genre: zod_1.z.enum([
        "FICTION",
        "NON_FICTION",
        "SCIENCE",
        "HISTORY",
        "BIOGRAPHY",
        "FANTASY",
    ]),
    isbn: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    copies: zod_1.z.preprocess((val) => Number(val), zod_1.z.number().min(0)),
    available: zod_1.z.boolean().default(true),
});
// 1.book created route
exports.bookRoute.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield bookSchemaValidation.parseAsync(req.body);
        const data = yield book_model_1.Book.create(body);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Book created Failed",
            success: false,
            error,
        });
    }
}));
// 2. get all books route
exports.bookRoute.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy: rawSortBy, sort: rawSort, limit: rawLimit, skip: rawSkip, } = req.query;
        const sortBy = rawSortBy || "createdAt";
        const sort = rawSort === "desc" ? -1 : 1;
        const limit = parseInt(rawLimit) || 10;
        const skip = parseInt(rawSkip) || 0;
        const query = {};
        if (filter) {
            query.genre = filter;
        }
        const [data, total] = yield Promise.all([
            book_model_1.Book.find(query)
                .sort({ [sortBy]: sort })
                .skip(skip)
                .limit(limit),
            book_model_1.Book.countDocuments(query),
        ]);
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data,
            meta: {
                total,
                page: Math.floor(skip / limit) + 1,
                limit,
            },
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Books retrieval failed",
            error: {
                message: error.message,
            },
        });
    }
}));
// 3. get single book route
exports.bookRoute.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        const data = yield book_model_1.Book.findById(bookId);
        if (!data) {
            throw new Error("Book not found");
        }
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Book retrieved failed",
            success: false,
            error: {
                message: error.message,
            },
        });
    }
}));
// 4. update book route
exports.bookRoute.put("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        const body = req.body;
        const data = yield book_model_1.Book.findByIdAndUpdate(bookId, body, { new: true });
        if (!data) {
            throw new Error("Book not found");
        }
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Book updated failed",
            success: false,
            error: {
                message: error.message,
            },
        });
    }
}));
exports.bookRoute.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        const data = yield book_model_1.Book.findByIdAndDelete(bookId);
        if (!data) {
            throw new Error("Book not found");
        }
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Book deletion failed",
            success: false,
            error: {
                message: error.message,
            },
        });
    }
}));
