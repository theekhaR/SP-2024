import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./pages/Home";
import Login from "./pages/Login.jsx";
import Message from "./pages/message.jsx";
import Listing from "./pages/Listing.jsx";
import Main from "./pages/main.jsx";
import UploadFile from "./pages/uploadFileTest.jsx";
import Register from "./pages/Register.jsx"
import UserProfile from "./pages/UserProfile.jsx"

import {createBrowserRouter, RouterProvider} from "react-router-dom";

import ProtectedRouteWrapper from "./components/ProtectedRouteWrapper.jsx";

const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
    { path: "/message", element: <ProtectedRouteWrapper> <Message /> </ProtectedRouteWrapper> },
    { path: "/listing", element: <Listing /> },
    { path: "/upload", element: <UploadFile/>},
    { path: "/main", element: <Main />},
    { path: "/userprofile", element: <UserProfile/>}
])
createRoot(document.getElementById("root")).render(
  <StrictMode>
      <RouterProvider router={router}/>
  </StrictMode>
);
