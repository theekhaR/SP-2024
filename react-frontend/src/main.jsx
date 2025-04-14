import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./pages/Home";
import Login from "./pages/Login.jsx";
import Message from "./pages/message.jsx";
import Listing from "./pages/Listing.jsx";
import Main from "./pages/main.jsx";
import Register from "./pages/Register.jsx"
import UserProfile from "./pages/UserProfile.jsx"
import Company from "./pages/Company.jsx";

import {createBrowserRouter, RouterProvider} from "react-router-dom";

import ProtectedRouteWrapper from "./components/ProtectedRouteWrapper.jsx"
import { UserProvider } from "./components/UserContext.jsx";

const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
    { path: "/message", element: <UserProvider> <ProtectedRouteWrapper> <Message /> </ProtectedRouteWrapper> </UserProvider> },
    { path: "/company", element: <UserProvider> <Company /> </UserProvider> },
    { path: "/listing", element: <Listing /> },
    { path: "/main", element: <Main />},
    { path: "/userprofile", element: <UserProvider><UserProfile/></UserProvider>}
])
createRoot(document.getElementById("root")).render(
  <StrictMode>
      <RouterProvider router={router}/>
  </StrictMode>
);
