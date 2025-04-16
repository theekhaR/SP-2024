import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./pages/Home";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Bookmark from "./pages/Bookmark.jsx";
import Message from "./pages/message.jsx";
import Listing from "./pages/Listing.jsx";
import Main from "./pages/main.jsx";
import Setting from "./pages/UserProfile.jsx";
import Astatus from "./pages/AppStatus.jsx";
import Company from "./pages/Company.jsx";
import CreateCompany from "./pages/createCompany.jsx";
import CompanyManage from "./pages/companyManage.jsx";
import CompanyEdit from "./pages/companyEdit.jsx";
import ListingEdit from "./pages/listingEdit.jsx";
import Member from "./pages/member.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRouteWrapper from "./components/ProtectedRouteWrapper.jsx";
import { UserProvider } from "./components/UserContext.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  {
    path: "/message",
    element: (
      <UserProvider>
        {" "}
        <ProtectedRouteWrapper>
          {" "}
          <Message />{" "}
        </ProtectedRouteWrapper>{" "}
      </UserProvider>
    ),
  },
  { path: "/listing", element: <Listing /> },
  { path: "/main", element: <Main /> },
  { path: "/setting", element: <Setting /> },
  { path: "/bookmark", element: <Bookmark /> },
  { path: "/status", element: <Astatus /> },
  { path: "/company", element: <Company /> },
  { path: "/companyE/:id", element: <CompanyEdit /> },
  { path: "/cCompany", element: <CreateCompany /> },
  { path: "/CompanyM", element: <CompanyManage /> },
  { path: "/member", element: <Member /> },
  { path: "/listingE", element: <ListingEdit /> },
  {
    path: "/userprofile",
    element: (
      <UserProvider>
        <UserProfile />
      </UserProvider>
    ),
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
