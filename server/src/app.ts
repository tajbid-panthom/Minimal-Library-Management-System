import express, { Application } from "express";
import { bookRoute } from "./app/controllers/book.controller";
import { borrowRoute } from "./app/controllers/borrow.controller";

const app: Application = express();
app.use(express.json());

app.use("/api/books", bookRoute);
app.use("/api/borrow", borrowRoute);

export default app;
