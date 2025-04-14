import React from "react";
import Lnavbar from "../components/L_navbar";
import Footer from "../components/footer";
import Pic1 from "../assets/Location.png";
import Pic2 from "../assets/Login.png";
import Pic3 from "../assets/Tech.png";

function Company() {
  const companies = [
    {
      id: 1,
      name: "MyCompany Limited Co.",
      role: "Administrator",
      image_url: "/images/Location.png",
    },
    {
      id: 1,
      name: "ABC Company",
      role: "Member",
      image_url: "/images/Login.png",
    },
    {
      id: 1,
      name: "XYZ Holdings",
      role: "Member",
      image_url: "/images/Tech.png",
    },
    {
      id: 1,
      name: "AAA",
      role: "Member",
      image_url: "/images/Tech.png",
    },
    {
      id: 1,
      name: "BBB Z",
      role: "Member",
      image_url: "/images/Login.png",
    },
  ];
  return (
    <div className="min-h-screen bg-gray-100">
      <Lnavbar />
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            My Company ({companies.length})
          </h2>
          <button className="bg-orange-600 px-4 py-2 rounded hover:bg-orange-600">
            <a href="/cCompany" className="text-white">
              Create Company
            </a>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-white text-left text-gray-600 border-b">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className="border-b">
                  <td className="px-6 py-4 flex items-center space-x-4">
                    <img
                      src={company.image_url}
                      alt={company.name}
                      className="font-semibold h-12 w-12 object-contain"
                    />
                    <span>{company.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-green-600">
                      {company.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button className="bg-orange-600 text-white px-4 py-1 rounded hover:bg-orange-700">
                      <a href="/companyM">View</a>
                    </button>
                    <button
                      className={`px-4 py-1 rounded ${
                        company.role === "Administrator"
                          ? "bg-orange-600 text-white hover:bg-orange-700"
                          : "bg-[#F9AD95] text-white cursor-not-allowed"
                      }`}
                      disabled={company.role !== "Administrator"}
                    >
                      <a href={`/companyE/${company.id}`}>Edit</a>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6">
          <button className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">
            View All ({companies.length})
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Company;
