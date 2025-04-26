import React from "react";
import { useState, useEffect } from "react";
import Footer from "../components/footer";
import L_navbar from "../components/L_navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../supabaseClient";

function Listing() {
  // List varaible

  const [allJobs, setAllJobs] = useState([]); //all fetch job
  const [jobs, setJobs] = useState([]); //result from search
  const [selectedJob, setSelectedJob] = useState(null);

  // Search variable
  const [searchText, setSearchText] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchWorkCondition, setSearchWorkCondition] = useState("");
  const [searchExperience, setSearchExperience] = useState("");
  const [searchWorkType, setSearchWorkType] = useState("");

  async function getListings() {
    // Fetch listing
    try {
      const response = await fetch(
        `http://localhost:5000//get_default_listings`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();

        const listings = data.map((listing, index) => ({
          listingID: listing.listingID,
          company: listing.company,
          image_url: listing.pic,
          position: listing.position,
          location: listing.location,
          salary: listing.salary,
          description: listing.roleDescription,
          qualification: listing.qualification,
          detail: listing.detail,
          workType: listing.workType,
          workCondition: listing.workCondition,
          experience: listing.experience,
        }));
        return listings;
      }

      // Unexpected error
      const data = await response.json();
      alert(data.error);
      return [];
    } catch (error) {
      console.error("Error checking user:", error);
      return [];
    }
  }

  useEffect(() => {
    async function fetchJobs() {
      const listings = await getListings();
      setAllJobs(listings); // Save ALL
      setJobs(listings); // Initially show all
      if (listings.length > 0) {
        setSelectedJob(listings[0]);
      }
    }
    fetchJobs();
  }, []);

  // Test simple search logic => filter or joblist that fetch
  function handleSearch() {
    // Filter search
    if (
      searchText.trim() === "" &&
      searchLocation === "" &&
      searchWorkCondition === "" &&
      searchExperience === ""
    ) {
      // If no input -> show all
      setJobs(allJobs);
      return;
    }

    const filteredJobs = allJobs.filter((job) => {
      const matchesText =
        job.position.toLowerCase().includes(searchText.toLowerCase()) ||
        job.company.toLowerCase().includes(searchText.toLowerCase());

      const matchesLocation =
        searchLocation === "" || job.location === searchLocation;

      const matchesWorkType =
        searchWorkType === "" || job.workType === searchWorkType;

      const matchesWorkCondition =
        searchWorkCondition === "" || job.workCondition === searchWorkCondition;

      const matchesExperience =
        searchExperience === "" || job.experience === searchExperience;

      return (
        matchesText &&
        matchesLocation &&
        matchesWorkType &&
        matchesWorkCondition &&
        matchesExperience
      );
    });

    setJobs(filteredJobs);
    // Full-text-search postgre Didn't test yet

    // async function handleSearch() {

    //   const { data, error } = await supabase
    //     .from('listings')
    //     .select('*')
    //     .textSearch('search_vector', searchText, {
    //       type: 'websearch',
    //     })
    //     .eq('location', searchLocation || null)
    //     .eq('workCondition', searchWorkCondition || null)
    //     .eq('experience', searchExperience || null);

    //   if (error) {
    //     console.error('Error fetching listings:', error);
    //     return;
    //   }

    //   setJobs(data);
    // }
  }

  return (
    <div className="bg-gray-100 flex flex-col">
      <L_navbar />
      {/* Search */}
      <div className="p-8 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4 items-center justify-center">
        {/* Row 1 */}

        {/* Search Text */}
        <input
          type="text"
          placeholder="Position or Company name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="p-2 w-full rounded-md border border-gray-300"
        />

        {/* Location */}
        <select
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="p-2 w-full rounded-md border border-gray-300"
        >
          <option value="">All Locations</option>
          <option value="Bangkok">Bangkok</option>
          <option value="Chiang Mai">Chiang Mai</option>
          <option value="Remote">Remote</option>
        </select>

        {/* Work Type */}
        <select
          value={searchWorkType}
          onChange={(e) => setSearchWorkType(e.target.value)}
          className="p-2 w-full rounded-md border border-gray-300"
        >
          <option value="">All Work Types</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

        {/* Work Condition */}
        <select
          value={searchWorkCondition}
          onChange={(e) => setSearchWorkCondition(e.target.value)}
          className="p-2 w-full rounded-md border border-gray-300"
        >
          <option value="">All Work Conditions</option>
          <option value="Onsite">Onsite</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        {/* Row 2 */}

        {/* Experience */}
        <select
          value={searchExperience}
          onChange={(e) => setSearchExperience(e.target.value)}
          className="p-2 w-full rounded-md border border-gray-300"
        >
          <option value="">All Experience Levels</option>
          <option value="Not Required">Not Required</option>
          <option value="1 - 2 years">1 - 2 years</option>
          <option value="2 - 5 years">2 - 5 years</option>
          <option value="5 - 10 years">5 - 10 years</option>
          <option value="10 years or above">10 years or above</option>
        </select>

        {/* Button:  */}
        <div className="md:col-span-3 flex justify-center mt-4">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md text-lg"
            onClick={handleSearch}
          >
            Find Job
          </button>
        </div>
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
                key={job.listingID}
                className="p-3 border mb-2 cursor-pointer hover:bg-gray-100 flex items-center space-x-4"
                onClick={() => setSelectedJob(job)}
              >
                {/* Job Image */}
                <img
                  src={job.image_url}
                  alt={job.position}
                  className="w-16 h-16 object-cover rounded-md"
                />

                {/* Job Details */}
                <div>
                  <h3 className="font-medium">{job.position}</h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
                  <p className="text-sm text-gray-600">{job.location}</p>
                  <p className="text-sm text-gray-600">{job.salary}</p>
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
                {selectedJob.position}
              </h2>

              <p className="font-bold">{selectedJob.company}</p>
              <div className="flex gap-8 text-gray-600 text-base">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faDollarSign} />
                  <p className="text-gray-600 text-base">
                    {selectedJob.salary}
                  </p>
                  <FontAwesomeIcon icon={faLocationDot} />
                  <p>{selectedJob.location}</p>
                </div>
              </div>

              <p className="mt-6">{selectedJob.description}</p>

              <h2 className="text-xl font-bold mt-3 mb-3">Qualification:</h2>
              <ul className="text-gray-600 space-y-2">
                {/* {selectedJob.qualification.map((req, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-orange-500 mr-2">✔</span> {req}
                  </li>
                ))} */}
              </ul>
              <h2 className="mt-5 text-xl font-bold mb-3">Other detail:</h2>
              <p className="mt-3">{selectedJob.detail}</p>
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
                  <strong>Work type:</strong> {selectedJob.workType}
                </p>
                <p>
                  <strong>Salary:</strong> {selectedJob.salary}
                </p>
                <p>
                  <strong>Work condition:</strong> {selectedJob.workCondition}
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
