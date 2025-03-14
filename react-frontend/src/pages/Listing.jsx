import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

function Listing() {
  return (
    <div>
      <Navbar />
      {/* Listing requirement*/}
      <div className="max-w-6xl mx-auto p-6">
        {/* Main Container */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Section*/}
          <div className="col-span-2">
            <nav className="text-gray-500 text-sm mb-4">
              <a href="#" className="hover:underline">
                Home
              </a>{" "}
              &gt;
              <a href="#" className="hover:underline">
                {" "}
                Listing
              </a>{" "}
              &gt;
              <a href="#" className="hover:underline">
                {" "}
                Frontend Software Developer..
              </a>
            </nav>

            <h1 className="text-3xl font-bold mb-2">
              Frontend Software Developer - Junior Web Development Position -
              React/JavaScript
            </h1>
            <p className="text-gray-600 mb-4">
              We are seeking a motivated Junior Frontend Developer to build
              responsive, user-friendly web applications using React and
              JavaScript.
            </p>

            {/* Company Info */}
            <div className="flex items-center gap-2 mb-6">
              <img
                src="your-company-logo-url"
                alt="Company Logo"
                className="w-10 h-10 rounded-full"
              />
              <span className="font-semibold text-gray-700">
                MyCompany Limited Co.
              </span>
            </div>

            <div className="relative mb-6">
              <img
                src="your-image-url"
                alt="Listing image"
                className="w-full rounded-lg"
              />
            </div>

            <h2 className="text-xl font-bold mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              We are looking for a motivated Junior Frontend Developer with a
              passion for creating engaging and user-friendly web
              applications...
            </p>

            <h2 className="text-xl font-bold mb-3">Requirement:</h2>
            <ul className="text-gray-600 space-y-2">
              <li className="flex items-center">
                <span className="text-orange-500 mr-2">✔</span> Lorem ipsum
                dolor sit amet consectetur adipisicing elit. Praesentium,
                dignissimos?
              </li>
              <li className="flex items-center">
                <span className="text-orange-500 mr-2">✔</span> Lorem ipsum
                dolor sit amet consectetur adipisicing elit. Tempore, vero?
              </li>
              <li className="flex items-center">
                <span className="text-orange-500 mr-2">✔</span> Lorem ipsum
                dolor, sit amet consectetur adipisicing elit. Nam, totam.
              </li>
            </ul>
          </div>

          {/* Right Sidebar */}
          <div className="bg-white p-5 rounded-lg shadow-md ">
            <p className="text-gray-500 text-sm mb-2 text-center text-orange-500 ">
              Posted 2 days ago
            </p>

            <div className="space-y-4">
              <div className="flex justify-between text-gray-700">
                <span>Duration:</span> <span>Full-Time</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Position Level:</span> <span>Intermediate</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Work experience:</span> <span>0 - 3 years</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Location:</span> <span>Bangkok</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button className="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600">
                Apply For Position
              </button>
              <button className="w-full border border-orange-500 text-orange-500 font-semibold py-2 rounded-lg hover:bg-orange-50">
                Have A Conversation
              </button>
              <button className="w-full text-gray-700 border border-gray-300 py-2 rounded-lg hover:bg-gray-100">
                Add To Bookmark
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Related Pos */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Related Position</h2>
            <h3 className="text-orange-500 font-semibold cursor-pointer">
              View All →
            </h3>
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img
                src="your-image-url"
                alt="Position"
                className="w-full h-40 object-cover rounded-md"
              />
              <span className="bg-[#FF6636] text-white text-xs font-bold px-2 py-1 rounded-md inline-block mt-2">
                IT & SOFTWARE
              </span>
              <h4 className="text-md font-semibold mt-2">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio,
                sequi!
              </h4>
              <p className="text-orange-500 font-bold mt-1">$57</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <img
                src="your-image-url"
                alt="Position"
                className="w-full h-40 object-cover rounded-md"
              />
              <span className="bg-[#FF6636] text-white text-xs font-bold px-2 py-1 rounded-md inline-block mt-2">
                IT & SOFTWARE
              </span>
              <h4 className="text-md font-semibold mt-2">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel,
                eius?
              </h4>
              <p className="text-orange-500 font-bold mt-1">$57</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <img
                src="your-image-url"
                alt="Position"
                className="w-full h-40 object-cover rounded-md"
              />
              <span className="bg-[#FF6636] text-white text-xs font-bold px-2 py-1 rounded-md inline-block mt-2">
                IT & SOFTWARE
              </span>
              <h4 className="text-md font-semibold mt-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Est,
                repellendus!
              </h4>
              <p className="text-orange-500 font-bold mt-1">$57</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <img
                src="your-image-url"
                alt="Position"
                className="w-full h-40 object-cover rounded-md"
              />
              <span className="bg-[#FF6636] text-white text-xs font-bold px-2 py-1 rounded-md inline-block mt-2">
                IT & SOFTWARE
              </span>
              <h4 className="text-md font-semibold mt-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Explicabo, consequuntur!
              </h4>
              <p className="text-orange-500 font-bold mt-1">$57</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <img
                src="your-image-url"
                alt="Position"
                className="w-full h-40 object-cover rounded-md"
              />
              <span className="bg-[#FF6636] text-white text-xs font-bold px-2 py-1 rounded-md inline-block mt-2">
                IT & SOFTWARE
              </span>
              <h4 className="text-md font-semibold mt-2">
                Lorem ipsum dolor sit amet.
              </h4>
              <p className="text-orange-500 font-bold mt-1">$57</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Listing;
