import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

// Pages
import Astatus from "./pages/AppStatus.jsx";
import Bookmark from "./pages/Bookmark.jsx";
import Company from "./pages/Company.jsx";
import CompanyEdit from "./pages/companyEdit.jsx";
import CompanyListing from "./pages/companyListing.jsx";
import CreateCompany from "./pages/createCompany.jsx";
import Home from "./pages/Home.jsx";
import Listing from "./pages/Listing.jsx";
import ListingEdit from "./pages/listingEdit.jsx";
import Login from "./pages/Login.jsx";
import Main from "./pages/main.jsx";
import Member from "./pages/member.jsx";
import Message from "./pages/message.jsx";
import Register from "./pages/Register.jsx";
import Setting from "./pages/UserProfile.jsx";

// Components
import ProtectedRouteWrapper from "./components/ProtectedRouteWrapper.jsx";
import { UserProvider } from "./components/UserContext.jsx";

// Routes
const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/bookmark", element: <Bookmark /> },
  {
    path: "/company",
    element: (
      <UserProvider>
        <Company />
      </UserProvider>
    ),
  },
  {
    path: "/companyEdit/:id",
    element: (
      <UserProvider>
        <CompanyEdit />
      </UserProvider>
    ),
  },
  {
    path: "/companyListing/:companyID",
    element: (
      <UserProvider>
        <CompanyListing />
      </UserProvider>
    ),
  },
  {
    path: "/createCompany",
    element: (
      <UserProvider>
        <CreateCompany />
      </UserProvider>
    ),
  },
  {
    path: "/listing/:companyID",
    element: (
      <UserProvider>
        <Listing />
      </UserProvider>
    ),
  },
  {
    path: "/listingE",
    element: (
      <UserProvider>
        <ListingEdit />
      </UserProvider>
    ),
  },
  { path: "/login", element: <Login /> },
  { path: "/main", element: <Main /> },
  {
    path: "/member",
    element: (
      <UserProvider>
        <Member />
      </UserProvider>
    ),
  },
  {
    path: "/message",
    element: (
      <UserProvider>
        <ProtectedRouteWrapper>
          <Message />
        </ProtectedRouteWrapper>
      </UserProvider>
    ),
  },
  { path: "/register", element: <Register /> },
  { path: "/setting", element: <Setting /> },
  {
    path: "/status",
    element: (
      <UserProvider>
        <Astatus />
      </UserProvider>
    ),
  },
]);

// Render
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
