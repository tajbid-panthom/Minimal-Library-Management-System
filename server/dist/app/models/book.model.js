"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
    versionKey: false,
});
bookSchema.static("bookAvailablity", function (copies) {
    if (copies < 1) {
        return false;
    }
    return true;
});
exports.Book = (0, mongoose_1.model)("Book", bookSchema);
