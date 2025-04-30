import React, {useEffect} from "react";
import Lnavbar from "../components/L_navbar";
import Sidebar from "../components/sidebar";
import Footer from "../components/footer";
import MissingImagePlaceHolder from "../assets/MissingImagePlaceholder.jpg"

import {useCompanyContext} from "../components/CompanyContext.jsx";


function CompanyProfile() {

  const { companyID, companyInfo, companyLogoURL, userCompanyData, loadingCompanyContext } = useCompanyContext();

  useEffect(() => {
    console.log(loadingCompanyContext)
    console.log(companyInfo)
  }, [loadingCompanyContext, companyInfo]);

    if (loadingCompanyContext) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500">Loading company info...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Lnavbar />

      <div className="flex flex-1 flex-row">
        <Sidebar />

        <div className="flex-1 p-8">
          {/* Banner */}
          {/*<div className="relative w-full h-64 mb-10 rounded-lg overflow-hidden shadow">*/}
          {/*  <img src={BannerImg} alt="Company Banner" className="w-full h-full object-cover" />*/}
          {/*</div>*/}

          {/* Company Info Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col space-y-6">
            {/* Top: Logo + Info + Button */}
            <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-6">
              {/* Logo + Text Info */}
              <div className="flex gap-6">
                <img src={companyLogoURL || MissingImagePlaceHolder} alt="Company Logo" className="w-24 h-24 object-contain" />
                <div className="text-gray-700 text-sm space-y-1">
                  <h2 className="text-xl font-bold text-blue-800">{companyInfo.companyName}</h2>

                  {companyInfo.companyLocation && (<p><strong>Company Location:</strong> {companyInfo.companyLocation}</p>)}

                  {companyInfo.companySize && (<p><strong>Company Size:</strong> {companyInfo.companySize}</p>)}

                  {companyInfo.companyEmail && (<p><strong>Email:</strong> {companyInfo.companyEmail}</p>)}

                  {companyInfo.companyPhone && (<p><strong>Phone:</strong> {companyInfo.companyPhone}</p>)}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-x-8 text-sm text-gray-700">
                <div>
                  {companyInfo.industryName && (<p><strong>Industry:</strong> {companyInfo.industryName}</p>)}
                  {companyInfo.companyWebsite && (
                      <a>
                        <strong>Website: </strong>
                        <a href={companyInfo.companyWebsite.startsWith('http') ? companyInfo.companyWebsite : `https://${companyInfo.companyWebsite}`}
                           className="text-blue-600 underline">
                          {companyInfo.companyWebsite}
                        </a>
                      </a>
                  )}
                </div>
                {/*<div>*/}
                {/*  <p>*/}
                {/*    <a href="http://www.google.com" className="text-blue-600 underline">*/}
                {/*      www.google.com*/}
                {/*    </a>*/}
                {/*  </p>*/}
                {/*</div>*/}
              </div>
            </div>

            <hr />

            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/*<div className="flex space-x-12 text-center">*/}
              {/*  <div>*/}
              {/*    <div className="text-2xl font-bold text-gray-900">8</div>*/}
              {/*    <div className="text-sm text-gray-500">Opening Position</div>*/}
              {/*  </div>*/}
              {/*  <div>*/}
              {/*    <div className="text-2xl font-bold text-gray-900">23,408</div>*/}
              {/*    <div className="text-sm text-gray-500">Followers</div>*/}
              {/*  </div>*/}
              {/*</div>*/}



              {/*  ------------------ BUTTON ------------------------- */}
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md"
              >
                <a href="/companyprofileedit">
                  Edit
                </a>
              </button>
            </div>
          </div>

          {/* change to follow : 
          เปลี่ยนเป็นสีเขียว
                 <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md">
                Edit
              </button>
            </div>
          </div>

        {/* -------------------------------------------------------- */}

          {/* About Us Section */}
          <div className="bg-white rounded-lg shadow-lg mt-10 p-20 space-y-20">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">About Us</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {companyInfo.companyAbout}
              </p>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Details</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {companyInfo.companyOverview}
              </p>
            </div>

            {/*/!* Affiliated Companies *!/*/}
            {/*<div>*/}
            {/*  <h3 className="text-lg font-bold text-gray-800 mb-10">Affiliated Companies</h3>*/}
            {/*  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">*/}
            {/*    <div className="flex items-center gap-3">*/}
            {/*      <img src={CompanyLogo} className="w-10 h-10 object-contain" alt="Google" />*/}
            {/*      <div>*/}
            {/*        <p className="font-medium">Google, Social Marketing Tools</p>*/}
            {/*        <p className="text-xs text-gray-500">82,364 followers</p>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*    <div className="flex items-center gap-3">*/}
            {/*      <img src={AdometryLogo} className="w-10 h-10 object-contain" alt="Adometry" />*/}
            {/*      <div>*/}
            {/*        <p className="font-medium">Adometry by Google</p>*/}
            {/*        <p className="text-xs text-gray-500">4,760 followers</p>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*    <div className="flex items-center gap-3">*/}
            {/*      <img src={NestLogo} className="w-10 h-10 object-contain" alt="Nest" />*/}
            {/*      <div>*/}
            {/*        <p className="font-medium">Nest</p>*/}
            {/*        <p className="text-xs text-gray-500">24,692 followers</p>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*    <div className="flex items-center gap-3">*/}
            {/*      <img src={YoutubeLogo} className="w-10 h-10 object-contain" alt="YouTube" />*/}
            {/*      <div>*/}
            {/*        <p className="font-medium">YouTube</p>*/}
            {/*        <p className="text-xs text-gray-500">232,607 followers</p>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*    <div className="flex items-center gap-3">*/}
            {/*      <img src={XLogo} className="w-10 h-10 object-contain" alt="X" />*/}
            {/*      <div>*/}
            {/*        <p className="font-medium">X, the moonshot factory</p>*/}
            {/*        <p className="text-xs text-gray-500">4,829 followers</p>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}

            {/*/!* Supported Organizations *!/*/}
            {/*<div>*/}
            {/*  <h3 className="text-lg font-bold text-gray-800 mb-4">Organizations our employees support</h3>*/}
            {/*  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">*/}
            {/*    <div className="flex items-center gap-3">*/}
            {/*      <img src={UnicefLogo} className="w-10 h-10 object-contain" alt="UNICEF" />*/}
            {/*      <div>*/}
            {/*        <p className="font-medium">UNICEF</p>*/}
            {/*        <p className="text-xs text-gray-500">365,719 followers</p>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*    <div className="flex items-center gap-3">*/}
            {/*      <img src={AmnestyLogo} className="w-10 h-10 object-contain" alt="Amnesty" />*/}
            {/*      <div>*/}
            {/*        <p className="font-medium">Amnesty International</p>*/}
            {/*        <p className="text-xs text-gray-500">107,262 followers</p>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*    <div className="flex items-center gap-3">*/}
            {/*      <img src={WWFLogo} className="w-10 h-10 object-contain" alt="WWF" />*/}
            {/*      <div>*/}
            {/*        <p className="font-medium">WWF</p>*/}
            {/*        <p className="text-xs text-gray-500">90,453 followers</p>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*    <div className="flex items-center gap-3">*/}
            {/*      <img src={USAredLogo} className="w-10 h-10 object-contain" alt="Red Cross" />*/}
            {/*      <div>*/}
            {/*        <p className="font-medium">American Red Cross</p>*/}
            {/*        <p className="text-xs text-gray-500">131,276 followers</p>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CompanyProfile;
