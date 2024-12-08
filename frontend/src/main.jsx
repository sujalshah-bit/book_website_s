import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./components/auth/Signup.jsx";
import Login from "./components/auth/Login.jsx";
import LandingPage from "./components/landing_section/LandingPage.jsx";
import BookDetail from "./components/BookDetail/BookDetail.jsx";
import BookFilters from "./components/FilterBook/FilterBookView.jsx";
import Admin from "./components/admin/admin.jsx";
import "./styles/index.css";
import "./styles/app.css";
import Wishlist from "./components/wishlist/Wishlist.jsx";
import FeedbackForm from "./components/Feedback.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin/signup",
    element: <Signup text={"Admin"} />,
  },
  {
    path: "/user/signup",
    element: <Signup text={"User"} />,
  },
  {
    path: "/book/:id",
    element: <BookDetail />,
  },
  {
    path: "/books",
    element: <BookFilters />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/wishlist",
    element: <Wishlist />,
  },
  {
    path: "/feedback",
    element: <FeedbackForm />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
