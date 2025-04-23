import React from "react";
import { useState, useEffect } from "react";
import LocationPic from "../assets/Location.png";
import Navbar from "../components/navbar";
import Lnavbar from "../components/L_navbar";
import Footer from "../components/footer";

function Listing() {
  const jobs = [
    {
      ListingID: 1,
      title: "Software Engineer Intern (Mobile)",
      company: "KBTG",
      description:
        "We are seeking a motivated Junior Frontend Developer to build responsive, user-friendly web applications using React and JavaScript....Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum, optio!",
      image_url: "/images/Tech.png",
      WorkCondition: "Hybrid - 2 days in office",
      position: "Junior Developer",
      Type: "Internship",
      Salary: "2XXXX - 3XXXX฿",
      experience: "None required",
      location: "Bangkok, Thailand",
      requirements: [
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, dignissimos?",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, vero?",
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam, totam.",
      ],
      Benifit: [
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, dignissimos?",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, vero?",
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam, totam.",
      ],
    },
    {
      ListingID: 2,
      title: "Web Developer Intern",
      company: "Western Digital",
      description: "A web development internship opportunity.",
      image_url: "/images/Tech.png",
      WorkCondition: "Work from home",
      position: "Senior Developer",
      Type: "Full-Time",
      Salary: "3XXXX - 5XXXX฿",
      experience: "2 years",
      location: "Prachin Buri, Thailand",
      requirements: [
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, dignissimos?",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, vero?",
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam, totam.",
      ],
      Benifit: [
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, dignissimos?",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, vero?",
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam, totam.",
      ],
    },
    {
      ListingID: 3,
      title: "Software Engineer Intern (Mobile)",
      company: "KBTG",
      description:
        "We are seeking a motivated Junior Frontend Developer to build responsive, user-friendly web applications using React and JavaScript....Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum, optio!",
      image_url: "/images/Tech.png",
      WorkCondition: "Hybrid - 2 days in office",
      position: "Junior Developer",
      Type: "Internship",
      Salary: "2XXXX - 3XXXX฿",
      experience: "None required",
      location: "Bangkok, Thailand",
      requirements: [
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, dignissimos?",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, vero?",
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam, totam.",
      ],
      Benifit: [
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, dignissimos?",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, vero?",
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam, totam.",
      ],
    },
    {
      ListingID: 4,
      title: "Web Developer Intern",
      company: "Western Digital",
      description: "A web development internship opportunity.",
      image_url: "/images/Tech.png",
      WorkCondition: "Work from home",
      position: "Senior Developer",
      Type: "Full-Time",
      Salary: "3XXXX - 5XXXX฿",
      experience: "2 years",
      location: "Prachin Buri, Thailand",
      requirements: [
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, dignissimos?",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, vero?",
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam, totam.",
      ],
      Benifit: [
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, dignissimos?",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, vero?",
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam, totam.",
      ],
    },
    {
      ListingID: 5,
      title: "Software Engineer Intern (Mobile)",
      company: "KBTG",
      description:
        "We are seeking a motivated Junior Frontend Developer to build responsive, user-friendly web applications using React and JavaScript....Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum, optio!",
      image_url: "/images/Tech.png",
      WorkCondition: "Hybrid - 2 days in office",
      position: "Junior Developer",
      Type: "Internship",
      Salary: "2XXXX - 3XXXX฿",
      experience: "None required",
      location: "Bangkok, Thailand",
      requirements: [
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, dignissimos?",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, vero?",
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam, totam.",
      ],
      Benifit: [
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, dignissimos?",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, vero?",
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam, totam.",
      ],
    },
    {
      ListingID: 6,
      title: "Web Developer Intern",
      company: "Western Digital",
      description: "A web development internship opportunity.",
      image_url: "/images/Tech.png",
      WorkCondition: "Work from home",
      position: "Senior Developer",
      Type: "Full-Time",
      Salary: "3XXXX - 5XXXX฿",
      experience: "2 years",
      location: "Prachin Buri, Thailand",
      requirements: [
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, dignissimos?",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, vero?",
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam, totam.",
      ],
      Benifit: [
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, dignissimos?",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, vero?",
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam, totam.",
      ],
    },
  ];
  const [selectedJob, setSelectedJob] = useState(jobs[0]);

  return (
    <div className="bg-gray-100 flex flex-col">
      <Navbar />
      {/* Search */}
      <div className="p-8 rounded-lg flex flex-wrap gap-2 items-center justify-center">
        <input
          type="text"
          placeholder="Position or Companies name"
          className="p-2 w-60 rounded-md border border-gray-300"
        />
        <select className="p-2 w-60 rounded-md border border-gray-300">
          <option>Jobs field </option>
        </select>
        <select className="p-2 w-60 rounded-md border border-gray-300">
          <option>Location </option>
        </select>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-md">
          Find job
        </button>
      </div>
      {/* Filter */}
      <div className="flex h-screen">
        {/* Left - Job List */}
        <div className="w-1/5  overflow-y-auto border border-gray-300 bg-white shadow-md rounded-lg overflow-y-scroll scrollbar-hide ">
          <div className="bg-slate-800 p-3">
            <h2 className="text-lg font-semibold mb-4 text-center text-orange-500">
              Job suggestion
            </h2>
          </div>
          <div className="p-4">
            {jobs.map((job) => (
              <div
                key={job.ListingID}
                className="p-3 border mb-2 cursor-pointer hover:bg-gray-100 flex items-center space-x-4"
                onClick={() => setSelectedJob(job)}
              >
                {/* Job Image */}
                <img
                  src={job.image_url}
                  alt={job.title}
                  className="w-16 h-16 object-cover rounded-md"
                />

                {/* Job Details */}
                <div>
                  <h3 className="font-medium">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
                  <p className="text-sm text-gray-600">{job.location}</p>
                  <p className="text-sm text-gray-600">{job.Salary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle - Job Details */}
        <div className="w-3/5 p-4 bg-white border border-gray-300 shadow-md rounded-lg overflow-y-scroll scrollbar-hide">
          {selectedJob && (
            <div>
              <h2 className="text-xl font-bold text-orange-500">
                {selectedJob.title}
              </h2>
              <div className="flex gap-8 text-gray-600 text-base">
                <p>{selectedJob.company}</p>
                <div className="flex items-center gap-1">
                  <img
                    src={LocationPic}
                    alt="Illustration"
                    className="w-5 h-5"
                  />
                  <p>{selectedJob.location}</p>
                </div>
              </div>
              <p className="text-gray-600 text-base">{selectedJob.Salary}</p>

              <p className="mt-6">{selectedJob.description}</p>
              <div className="flex justify-center mt-4">
                <img
                  src={selectedJob.image_url}
                  alt="Illustration"
                  className="w-xl h-xl object-contain "
                />
              </div>

              <h2 className="text-xl font-bold mb-3">Requirement:</h2>
              <ul className="text-gray-600 space-y-2">
                {selectedJob.requirements.map((req, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-orange-500 mr-2">✔</span> {req}
                  </li>
                ))}
              </ul>
              <h2 className="mt-5 text-xl font-bold mb-3">Benefit:</h2>
              <ul className="text-gray-600 space-y-2">
                {selectedJob.Benifit.map((ben, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-orange-500 mr-2">✔</span> {ben}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right - Apply Section */}
        <div className="w-1/5 bg-white border border-gray-300 shadow-md rounded-lg">
          <div className="bg-slate-800 p-4">
            <h3 className="text-lg font-semibold text-center text-orange-500">
              Job Details
            </h3>
          </div>
          {selectedJob && (
            <div className="max-w-xs mx-auto pr-4 pl-4">
              <div className="mt-4 space-y-2">
                <p>
                  <strong>Position:</strong> {selectedJob.position}
                </p>
                <p>
                  <strong>Type:</strong> {selectedJob.Type}
                </p>
                <p>
                  <strong>Salary:</strong> {selectedJob.Salary}
                </p>
                <p>
                  <strong>Work condition:</strong> {selectedJob.WorkCondition}
                </p>
                <p>
                  <strong>Experience:</strong> {selectedJob.experience}
                </p>
                <p>
                  <strong>Location:</strong> {selectedJob.location}
                </p>
              </div>
              <div className="mt-6 space-y-3">
                <button className="w-full bg-orange-500 text-white py-2 rounded-lg">
                  Apply For Position
                </button>
                <button className="w-full border border-orange-500 text-orange-500 py-2 rounded-lg">
                  Have A Conversation
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg">
                  Add To Bookmark
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Listing;
