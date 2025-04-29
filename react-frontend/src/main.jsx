import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import "./index.css";

// Pages
import ApplicationStatus from "./pages/ApplicationStatus.jsx";
import Bookmark from "./pages/Bookmark.jsx";
import Company from "./pages/Company.jsx";
import CompanyProfile from "./pages/CompanyProfile.jsx";
import CompanyProfileEdit from "./pages/CompanyProfileEdit.jsx";
import CompanyListing from "./pages/CompanyListing.jsx";
import CreateCompany from "./pages/CreateCompany.jsx";
import Home from "./pages/Home.jsx";
import Listing from "./pages/Listing.jsx";
import CreateListing from "./pages/CreateListing.jsx";
import ListingEdit from "./pages/ListingEdit.jsx";
import Login from "./pages/Login.jsx";
import CompanyMember from "./pages/CompanyMember.jsx";
import Message from "./pages/Message.jsx";
import Register from "./pages/Register.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import ManageApplication from "./pages/ManageApplication.jsx";

// Components
import ProtectedRouteWrapper from "./components/ProtectedRouteWrapper.jsx";
import { UserProvider } from "./components/UserContext.jsx";
import { CompanyProvider } from "./components/CompanyContext.jsx";

// Wrapping component defined inline
function ContextWrapper() {
  return (
    <UserProvider>
      <CompanyProvider>
        <Outlet />
      </CompanyProvider>
    </UserProvider>
  );
}

// Routes
const router = createBrowserRouter([
  // Public routes (no context)
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  // Context-wrapped routes
  {
    element: <ContextWrapper />,
    children: [
      { path: "/bookmark", element: <Bookmark /> },
      { path: "/company", element: <Company /> },
      { path: "/companyprofile", element: <CompanyProfile /> },
      { path: "/companyprofileedit", element: <CompanyProfileEdit /> },
      { path: "/companyListing", element: <CompanyListing /> },
      { path: "/createCompany", element: <CreateCompany /> },
      { path: "/createlisting", element: <CreateListing /> },
      { path: "/listing", element: <Listing /> },
      { path: "/listingedit/:listingID", element: <ListingEdit /> },
      { path: "/companymember", element: <CompanyMember /> },
      {
        path: "/message",
        element: (
          <ProtectedRouteWrapper>
            <Message />
          </ProtectedRouteWrapper>
        ),
      },
      { path: "/userprofile", element: <UserProfile /> },
      { path: "/applicationstatus", element: <ApplicationStatus /> },
      { path: "/manageapplication/:listingID", element: <ManageApplication /> },
    ],
  },
]);

// Render
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
