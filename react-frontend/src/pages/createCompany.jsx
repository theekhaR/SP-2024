import React from "react";
import Lnavbar from "../components/L_navbar";
import Footer from "../components/footer";
import Pic from "../assets/Login.png";

function createCompany() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Lnavbar />
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-md mt-12">
        <h2 className="text-xl font-bold text-orange-500 mb-6">
          Create New Company
        </h2>

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
              className="px-3 py-1 text-white bg-gray-700 hover:bg-gray-800  rounded-md transition"
            >
              Upload Image
            </label>
            <button className="px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition">
              Use This Image
            </button>
          </div>
        </div>

        <h2 className="text-xl font-bold text-orange-500 mt-6 mb-6">
          Company social profile
        </h2>

        <div>
          <a>Tommorrow</a>
        </div>
        <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-600">
          <a href="/Company" className="text-white">
            Save Change
          </a>
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default createCompany;
