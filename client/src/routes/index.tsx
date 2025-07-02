import App from "@/App";
import AddBooks from "@/pages/AddBooks";
import AllBooks from "@/pages/AllBooks";
import BookSummary from "@/pages/BookSummary";
import { createBrowserRouter } from "react-router";
export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: AllBooks,
      },
      {
        path: "/add-books",
        Component: AddBooks,
      },
      {
        path: "/book-summary",
        Component: BookSummary,
      },
    ],
  },
]);
