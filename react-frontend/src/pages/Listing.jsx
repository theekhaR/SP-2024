import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

function Listing() {
  const [job, setJob] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/job") // Fetch from Flask API
      .then((response) => response.json())
      .then((data) => setJob(data))
      .catch((error) => console.error("Error fetching job data:", error));
  }, []);

  if (!job) {
    return <p className="text-center text-gray-500">Loading job details...</p>;
  }

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
                {job.title.substring(0, 30)}
              </a>
            </nav>

            {/* Job Title & Description */}
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <p className="text-gray-600 mb-4">{job.description}</p>

            {/* Company Info */}
            <div className="flex items-center gap-2 mb-6">
              <img
                src={job.company_logo}
                alt="Company Logo"
                className="w-10 h-10 rounded-full"
              />
              <span className="font-semibold text-gray-700">{job.company}</span>
            </div>

            {/* Listing Image */}
            <div className="relative mb-6">
              <img
                src={job.listing_image}
                alt="Listing"
                className="w-full rounded-lg"
              />
            </div>

            {/* Description & Requirements */}
            <h2 className="text-xl font-bold mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {job.description}
            </p>

            <h2 className="text-xl font-bold mb-3">Requirement:</h2>
            <ul className="text-gray-600 space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-orange-500 mr-2">✔</span> {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Sidebar */}
          <div className="bg-white p-5 rounded-lg shadow-md mt-6">
            <p className="text-gray-500 text-sm mb-2 text-center text-orange-500">
              {job.posted_days_ago}
            </p>

            <div className="space-y-4">
              <div className="flex justify-between text-gray-700">
                <span>Duration:</span> <span>{job.duration}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Position Level:</span> <span>{job.position_level}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Work experience:</span> <span>{job.work_experience}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Location:</span> <span>{job.location}</span>
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
