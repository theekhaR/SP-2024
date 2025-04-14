import React from "react";
import { useParams } from "react-router-dom";
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
import { faGlobe, faIndustry } from "@fortawesome/free-solid-svg-icons";

function companyEdit() {
  const { id } = useParams();
  const companies = [
    {
      CompanyID: 1,
      CompanyName: "MyCompany Limited Co.",
      IndustryID: "IT",
      CompanyLocation: "Songkhla",
      CompanyAbout:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, id.",
      CompanyOverview:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat quisquam numquam natus soluta assumenda culpa blanditiis repellendus consequuntur, ipsum ratione.",
      CompanyNameLogoURL: "/images/Location.png",
      CompanyNameSite: "https://re1999.bluepoch.com/",
    },
  ];
  const company = companies.find(
    (company) => company.CompanyID === parseInt(id)
  );

  if (!company) {
    return (company) => company.CompanyID === 1;
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <Lnavbar />
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-md mt-12">
        <h2 className="text-xl font-bold text-orange-500  mb-6">
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
                defaultValue={company.CompanyName}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <select
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={company.IndustryID}
              >
                <option value="IT">IT</option>
                <option value="Administrator">Administrator</option>
                {/* Add more options if needed */}
              </select>
            </div>

            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                defaultValue={company.CompanyLocation}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1">
                About
              </label>
              <input
                type="text"
                defaultValue={company.CompanyAbout}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1">
                Overview
              </label>
              <textarea
                rows="3"
                defaultValue={company.CompanyOverview}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          {/* RIGHT: Image Upload */}
          <div className="flex flex-col items-center text-center bg-gray-100 px-4 py-4 md:p-4 rounded-md space-y-2">
            <img
              src={company.CompanyNameLogoURL}
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
              defaultValue={company.CompanyNameSite}
              className="w-full px-4 py-2 border placeholder:text-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Social Media Inputs - Kept as-is for now */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "LinkedIn",
              icon: faLinkedinIn,
              placeholder: "LinkedIn url",
            },
            {
              label: "Facebook",
              icon: faFacebookF,
              placeholder: "Facebook url",
            },
            {
              label: "Instagram",
              icon: faInstagram,
              placeholder: "Instagram url",
            },
            { label: "Youtube", icon: faYoutube, placeholder: "Youtube url" },
            { label: "Tiktok", icon: faTiktok, placeholder: "Tiktok url" },
          ].map((item, i) => (
            <div key={i}>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                {item.label}
              </label>
              <div className="flex items-center border rounded-md overflow-hidden w-full max-w-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
                <div className="px-4">
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="text-orange-500 text-lg"
                  />
                </div>
                <div className="h-6 w-px bg-gray-200 mr-2" />
                <input
                  type="text"
                  placeholder={item.placeholder}
                  className="flex-1 py-2 pr-4 text-gray-500 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-800 mr-4">
            <a href="/Company" className="text-white">
              Save Change
            </a>
          </button>
          <button className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-800">
            <a href="/Company" className="text-white">
              Cancel
            </a>
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default companyEdit;
