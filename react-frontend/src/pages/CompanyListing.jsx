import React, {useEffect, useState} from "react";
import Lnavbar from "../components/L_navbar";
import Footer from "../components/footer";
import Sidebar from "../components/sidebar";
import {Link, useNavigate} from "react-router-dom";
import MissingImagePlaceHolder from "../assets/MissingImagePlaceholder.jpg";
import {useCompanyContext} from "../components/CompanyContext.jsx";
import {useUserContext} from "../components/UserContext.jsx";

function CompanyListing() {
  const {
    companyID,
    companyInfo,
    companyLogoURL,
    userCompanyData,
    loadingCompanyContext,
  } = useCompanyContext();
  const { userID } = useUserContext();
  const [listingList, setListingList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(companyID);
    if (!companyID) return; // Avoid running if companyID is not ready
    getCompanyListings().then(setListingList);
  }, [companyID]);

  function formatToThaiTime(gmtDateString) {
    const date = new Date(gmtDateString);

    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour12: false,
      timeZone: "Asia/Bangkok",
    };

    // Format the date in Thailand time zone
    return new Intl.DateTimeFormat("en-GB", options)
      .format(date)
      .replace(",", "");
  }

  async function getCompanyListings() {
    try {
      const response = await fetch(
        `http://localhost:5000/get_listings_of_company?companyID=${companyID}`,
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
          position: listing.position,
          createdOn: formatToThaiTime(listing.createdOn),
          affectiveUntil: formatToThaiTime(listing.affectiveUntil),
          image_url: null,
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

  return (
    <div className="bg-gray-100 min-h-screen">
      <Lnavbar />

      <div className="flex flex-row">
        <Sidebar />

        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              Listing ({listingList.length})
            </h1>
            <button className="bg-orange-500 text-white px-5 py-2 rounded hover:bg-orange-600">
              <a href="/createListing">Create Listing</a>
            </button>
          </div>

          <div className="bg-white rounded shadow overflow-hidden">
            {/* HEADER ROW */}
            <div className="grid grid-cols-[2fr_1fr_1fr_auto] px-6 py-4 bg-gray-50 font-semibold text-gray-600 text-sm">
              <div>Name</div>
              <div>CreatedOn</div>
              <div>AffectiveUntil</div>
              <div className="text-right">Action</div>
            </div>

            {/* LISTING ROWS */}
            {listingList.map((listing, index) => (
              <div
                key={listing.listingID}
                className="grid grid-cols-[2fr_1fr_1fr_auto] items-center px-6 py-4 border-t hover:bg-gray-50 text-sm"
              >
                {/* NAME COLUMN (image + position) */}
                <div className="flex items-center space-x-4">
                  <img
                    src={listing.image_url || MissingImagePlaceHolder}
                    alt="Image"
                    className="w-12 h-12 object-contain"
                  />
                  <div className="font-medium text-gray-800">
                    {listing.position}
                  </div>
                </div>

                {/* CREATED ON COLUMN */}
                <div className="text-gray-700">{listing.createdOn}</div>

                {/* AFFECTIVE UNTIL COLUMN */}
                <div className="text-gray-700">{listing.affectiveUntil}</div>

                {/* ACTION COLUMN */}
                <div className="flex justify-end space-x-2">
                  <Link
                      to={`/manageapplication/${listing.listingID}`}
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
                  >
                    Check Out Applicant
                  </Link>
                  <Link
                      to={`/listingedit/${listing.listingID}`}
                      className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 text-sm">
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <button className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600">
              View All ({listingList.length})
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CompanyListing;
