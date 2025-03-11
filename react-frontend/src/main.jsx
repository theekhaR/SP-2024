import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Message from "./pages/message.jsx";
import Listing from "./pages/Listing.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Message />
  </StrictMode>
);
