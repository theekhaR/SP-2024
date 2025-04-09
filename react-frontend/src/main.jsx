import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Message from "./pages/message.jsx";
import Listing from "./pages/Listing.jsx";
import Main from "./pages/main.jsx";
import Setting from "./pages/Setting.jsx";
import Astatus from "./pages/AppStatus.jsx";
import Bookmark from "./pages/Bookmark.jsx";
import Company from "./pages/Company.jsx";
import C_Company from "./pages/createCompany.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "/message", element: <Message /> },
  { path: "/listing", element: <Listing /> },
  { path: "/main", element: <Main /> },
  { path: "/setting", element: <Setting /> },
  { path: "/bookmark", element: <Bookmark /> },
  { path: "/status", element: <Astatus /> },
  { path: "/Company", element: <Company /> },
  { path: "/createCompany", element: <C_Company /> },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
