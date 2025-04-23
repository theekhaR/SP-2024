import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

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
import CreateListing from "./pages/createListing.jsx";
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
      { path: "/companyedit", element: <CompanyEdit /> },
      { path: "/companyListing", element: <CompanyListing /> },
      { path: "/createCompany", element: <CreateCompany /> },
      { path: "/listing", element: <Listing /> },
      { path: "/createListing", element: <CreateListing /> },
      { path: "/listingE", element: <ListingEdit /> },
      { path: "/main", element: <Main /> },
      { path: "/member", element: <Member /> },
      {
        path: "/message",
        element: (
          <ProtectedRouteWrapper>
            <Message />
          </ProtectedRouteWrapper>
        ),
      },
      { path: "/setting", element: <Setting /> },
      { path: "/status", element: <Astatus /> },
    ],
  },
]);

// Render
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
