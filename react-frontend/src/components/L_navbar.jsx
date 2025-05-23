import React, { useEffect } from "react";
import { useState } from "react";
import { useUserContext } from "../components/UserContext.jsx";
import DefaultProfilePic from "../assets/DefaultProfilePic.jpg";

function L_navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { userProfilePicURL, loading } = useUserContext(); //imported UserProfilePic
  const [profilePic, setProfilePic] = useState(DefaultProfilePic); //local profilePic to deal with loading

  useEffect(() => {
    if (userProfilePicURL) {
      setProfilePic(userProfilePicURL);
      //is still set new pfp on every render
    }
  }, [userProfilePicURL]);

  return (
    <header className="flex shadow-md py-4 px-4 sm:px-10 bg-slate-800 font-[sans-serif] min-h-[70px] tracking-wide sticky top-0 z-50">
      <div className="flex items-center justify-evenly w-full">
        <a href="/">
          <h3 className="text-2xl text-[#cf5c2e] font-semibold">Logo</h3>
        </a>

        <div
          id="collapseMenu"
          className="ml-30 lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50"
        >
          <ul className=" hidden pr-2 lg:flex gap-x-5 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
            <li className="mb-6 hidden max-lg:block">
              <a href="/">
                <h3 className="text-2xl text-[#cf5c2e] font-semibold">Logo</h3>
              </a>
            </li>
            <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
              <a
                href="/"
                className="hover:text-[#FF6636] text-[#8C94A3] block font-semibold text-[15px] relative cursor-pointer before:bg-[#FF6636] before:absolute before:-bottom-1 before:block before:h-[2px] before:w-full before:origin-bottom-right before:scale-x-0 before:transition before:duration-300 before:ease-in-out hover:before:origin-bottom-left hover:before:scale-x-100"
              >
                Home
              </a>
            </li>
            <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
              <a
                href="/listing"
                className="hover:text-[#FF6636] text-[#8C94A3]  block font-semibold text-[15px] relative cursor-pointer before:bg-[#FF6636] before:absolute before:-bottom-1 before:block before:h-[2px] before:w-full before:origin-bottom-right before:scale-x-0 before:transition before:duration-300 before:ease-in-out hover:before:origin-bottom-left hover:before:scale-x-100"
              >
                Find Jobs
              </a>
            </li>
            <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
              <a
                href="/company"
                className="hover:text-[#FF6636] text-[#8C94A3] block font-semibold text-[15px] relative cursor-pointer before:bg-[#FF6636] before:absolute before:-bottom-1 before:block before:h-[2px] before:w-full before:origin-bottom-right before:scale-x-0 before:transition before:duration-300 before:ease-in-out hover:before:origin-bottom-left hover:before:scale-x-100"
              >
                Company Side
              </a>
            </li>
          </ul>
        </div>
        {/* Profile */}
        <div className="relative group">
          {/* Profile Button */}
          <button
            className="focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <img
              src={profilePic}
              alt="User"
              className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
            />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md">
              <ul className="py-2">
                <li>
                  <a
                    href="/setting"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    Profile setting
                  </a>
                </li>
                <li>
                  <a
                    href="/bookmark"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    Bookmarks
                  </a>
                </li>
                <li>
                  <a
                    href="/status"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    Apply Status
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default L_navbar;
