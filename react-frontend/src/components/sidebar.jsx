import React, {useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {useCompanyContext} from "./CompanyContext.jsx";
import MissingImagePlaceHolder from "../assets/MissingImagePlaceholder.jpg";

function sidebar() {

    const { companyID, companyInfo, companyLogoURL, userCompanyData, loading } = useCompanyContext(); //imported UserProfilePic

  return (
    <div className="w-64 tracking-wide shadow-md bg-black text-[#8C94A3] font-semibold text-[15px] flex flex-col py-6 px-4 space-y-6 sticky top-1">
      <button className="text-white hover:text-[#FF6636] w-fit">
        <a href="/company">
          <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </a>
      </button>

      <div className="flex flex-col items-center space-y-2">
        <img
          src={companyLogoURL || MissingImagePlaceHolder}
          alt="Company Logo"
          className="w-20 h-20 rounded-full object-cover border-2 border-white"
        />
          <div className="text-white text-base">
              {companyInfo?.companyName || "Company name loading..."}
          </div>

        <button className="bg-orange-600 text-white hover:bg-orange-700 text-sm px-3 py-1 rounded">
          View profile
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-2">
        <a
          href="/companylisting"
          className="flex items-center px-3 py-2 hover:text-[#FF6636]"
        >
          Listing
        </a>
        <a
          href="/companymember"
          className="flex items-center px-3 py-2 hover:text-[#FF6636]"
        >
          Company member
        </a>
      </nav>
    </div>
  );
}

export default sidebar;
