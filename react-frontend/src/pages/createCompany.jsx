import React from "react";
import Lnavbar from "../components/L_navbar";
import Footer from "../components/footer";
import Pic from "../assets/Login.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faYoutube,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

function createCompany() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Lnavbar />
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-md mt-12">
        <h2 className="text-xl font-bold text-orange-500  mb-6">
          Create New Company
        </h2>

        {/* Put form on this pls when to do a real submit */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT: Form Section */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                placeholder="Enter company name"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <select className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>IT</option>
                {/* Add more options as needed */}
              </select>
            </div>

            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="Location"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1">
                About
              </label>
              <input
                type="text"
                placeholder="About"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1">
                Overview
              </label>
              <textarea
                rows="3"
                placeholder="Your title, profession or small biography"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          {/* RIGHT: Image Upload */}
          <div className="flex flex-col items-center text-center bg-gray-100 px-4 py-4 md:p-4 rounded-md space-y-2">
            <img
              src={Pic}
              alt="Company Logo"
              className="w-6/12 h-6/12 object-cover rounded-md mt-16 mb-12"
            />
            <input type="file" className="hidden" id="upload" />
            <label
              htmlFor="upload"
              className="px-3 py-1 text-white bg-slate-600 hover:bg-gray-800  rounded-md transition"
            >
              Upload Image
            </label>
            <button className="px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-800 transition">
              Use This Image
            </button>
          </div>
        </div>

        <h2 className="text-xl font-bold text-orange-500 mt-6 mb-3">
          Company social profile
        </h2>

        <div className="mb-3">
          <label className=" text-sm font-medium text-gray-700 mb-1">
            Company website
          </label>
          <div className="flex items-center border rounded-md overflow-hidden w-full focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
            <div className="px-4">
              <FontAwesomeIcon
                icon={faGlobe}
                className="text-orange-500 text-lg"
              />
            </div>

            <div className="h-6 w-px bg-gray-200 mr-2" />
            <input
              type="text"
              placeholder="Website"
              className="w-full px-4 py-2 border placeholder:text-gray-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              LinkedIn
            </label>

            <div className="flex items-center border rounded-md overflow-hidden w-full max-w-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
              <div className="px-4">
                <FontAwesomeIcon
                  icon={faLinkedinIn}
                  className="text-orange-500 text-lg"
                />
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-200 mr-2" />

              <input
                type="text"
                placeholder="LinkedIn url"
                className="flex-1 py-2 pr-4 text-gray-500 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Facebook
            </label>

            <div className="flex items-center border rounded-md overflow-hidden w-full max-w-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
              <div className="px-4">
                <FontAwesomeIcon
                  icon={faFacebookF}
                  className="text-orange-500 text-lg"
                />
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-200 mr-2" />

              <input
                type="text"
                placeholder="Facebook url"
                className="flex-1 py-2 pr-4 text-gray-500 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Instragram
            </label>

            <div className="flex items-center border rounded-md overflow-hidden w-full max-w-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
              <div className="px-4">
                <FontAwesomeIcon
                  icon={faInstagram}
                  className="text-orange-500 text-lg"
                />
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-200 mr-2" />

              <input
                type="text"
                placeholder="Instagram url"
                className="flex-1 py-2 pr-4 text-gray-500 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Youtube
            </label>

            <div className="flex items-center border rounded-md overflow-hidden w-full max-w-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
              <div className="px-4">
                <FontAwesomeIcon
                  icon={faYoutube}
                  className="text-orange-500 text-lg"
                />
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-200 mr-2" />

              <input
                type="text"
                placeholder="Youtube url"
                className="flex-1 py-2 pr-4 text-gray-500 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Tiktok
            </label>

            <div className="flex items-center border rounded-md overflow-hidden w-full max-w-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
              <div className="px-4">
                <FontAwesomeIcon
                  icon={faTiktok}
                  className="text-orange-500 text-lg"
                />
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-200 mr-2" />

              <input
                type="text"
                placeholder="Tiktok url"
                className="flex-1 py-2 pr-4 text-gray-500 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-800 mr-4">
            <a href="/Company" className="text-white">
              Save Change
            </a>
          </button>
          <button className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-800 ">
            <a href="/Company" className="text-white">
              Cancel
            </a>
          </button>
        </div>
        {/* End the form this line */}
      </div>
      <Footer />
    </div>
  );
}

export default createCompany;
