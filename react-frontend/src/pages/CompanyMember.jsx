import React, { useEffect, useState } from "react";
import Lnavbar from "../components/L_navbar";
import Footer from "../components/footer";
import Sidebar from "../components/sidebar";
import { useCompanyContext } from "../components/CompanyContext.jsx";

function CompanyMember() {
  const { companyID, companyInfo, companyLogoURL, userCompanyData, loading } =
    useCompanyContext();
  const [memberList, setMemberList] = useState([]);

  useEffect(() => {
    if (!companyID) return;
    getCompanyMember().then(setMemberList);
  }, [companyID]);
  async function getCompanyMember() {
    try {
      const response = await fetch(
        `http://localhost:5000/get_company_member?companyID=${companyID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();

        const members = data.map((member, index) => ({
          name: member.name,
          role: member.role,
          permission: member.permission,
          image_url: member.userPicURL,
        }));
        return members;
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
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Lnavbar />

      {/* Main content area (Sidebar + Member list) */}
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              Current Member ({memberList.length})
            </h1>
            <button className="bg-orange-500 text-white px-5 py-2 rounded hover:bg-orange-600">
              Add new member
            </button>
          </div>

          <div className="bg-white rounded shadow overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-3 px-6 py-4 bg-gray-50 font-semibold text-gray-600 text-sm">
              <div>Name</div>
              <div>Position</div>
              <div className="text-right">Action</div>
            </div>

            {/* Members */}
            {memberList.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-3 items-center px-6 py-4 border-t hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image_url}
                    alt="Profile"
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <div className="font-medium text-gray-800">{item.name}</div>
                </div>
                <div className="text-gray-800 font-medium">{item.position}</div>
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
              View All ({memberList.length})
            </button>
          </div>
        </div>
      </div>

      {/* Footer sticks to bottom */}
      <Footer />
    </div>
  );
}

export default CompanyMember;
