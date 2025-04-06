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
import UploadFile from "./pages/uploadFileTest.jsx";
import LoginSupa from "./pages/LoginSupa.jsx";
import RegisterSupa from "./pages/RegisterSupa.jsx"

import {createBrowserRouter, RouterProvider} from "react-router-dom";

const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/register", element: <Register /> },
    { path: "/registersupa", element: <RegisterSupa /> },
    { path: "/login", element: <Login /> },
    { path: "/message", element: <Message /> },
    { path: "/listing", element: <Listing /> },
    { path: "/upload", element: <UploadFile/>},
    { path: "/main", element: <Main />},
    { path: "/loginsupa", element: <LoginSupa/>}
])
createRoot(document.getElementById("root")).render(
  <StrictMode>
      <RouterProvider router={router}/>
  </StrictMode>
);

// import { createClient } from '@supabase/supabase-js'
//
// // Create a single supabase client for interacting with your database
// const supabase = createClient(
//     import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
