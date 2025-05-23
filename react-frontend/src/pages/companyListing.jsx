import React, { useEffect, useState } from "react";
import Lnavbar from "../components/L_navbar";
import Footer from "../components/footer";
import Sidebar from "../components/sidebar";
import { useParams } from "react-router-dom";
import MissingImagePlaceHolder from "../assets/MissingImagePlaceholder.jpg";
import { useCompanyContext } from "../components/CompanyContext.jsx";
import { useUserContext } from "../components/UserContext.jsx";

function CompanyListing() {
  const { companyID, companyInfo, companyLogoURL, userCompanyData, loading } =
    useCompanyContext();
  const { userID } = useUserContext();
  const [listingList, setListingList] = useState([]);

  useEffect(() => {
    console.log(companyID);
    if (!companyID) return; // Avoid running if companyID is not ready
    getCompanyListings().then(setListingList);
  }, [companyID]);

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
            <div className="grid grid-cols-3 px-6 py-4 bg-gray-50 font-semibold text-gray-600 text-sm">
              <div className="col-span-2">Name</div>
              <div className="text-right">Action</div>
            </div>

            {listingList.map((listing, index) => (
              <div
                key={listing.listingID}
                className="grid grid-cols-3 items-center px-6 py-4 border-t hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4 col-span-2">
                  <img
                    src={listing.image_url || MissingImagePlaceHolder}
                    alt="Image"
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <div className="font-medium text-gray-800">
                      {listing.position}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 text-sm">
                    Manage
                  </button>
                  <button className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-800 text-sm">
                    Kick
                  </button>
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
