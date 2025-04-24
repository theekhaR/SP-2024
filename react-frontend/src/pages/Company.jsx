import React, { useEffect, useState } from "react";
import Lnavbar from "../components/L_navbar";
import Footer from "../components/footer";
import Pic1 from "../assets/Location.png";
import Pic2 from "../assets/Login.png";
import Pic3 from "../assets/Tech.png";
import MissingImagePlaceHolder from "../assets/MissingImagePlaceholder.jpg";
import { useUserContext } from "../components/UserContext.jsx";
import { supabase } from "../supabaseClient.jsx";
import { useCompanyContext } from "../components/CompanyContext.jsx";
import { useNavigate } from "react-router-dom";

function Company() {
  const { userID, loading, authenticated } = useUserContext();
  const { setCompanyID } = useCompanyContext();
  const [companyList, setCompanyList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(companyList)
    if (userID) {
      getCompanyList();
    }
  }, [userID, loading, authenticated]);

  async function getCompanyList() {
    try {
      const response = await fetch(
        `http://localhost:5000/get_company_of_a_user?userID=${userID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      //console.log(response)
      const data = await response.json();
      if (response.status === 200) {
        // Map raw data to desired format
        const companies = data.map((company) => ({
          id: company.companyID,
          name: company.companyName,
          role: company.role,
          image_url: company.companyLogoURL,
        }));

        setCompanyList(companies); // render immediately

        // // Kick off all logo fetching in parallel
        // const fetchLogos = companies.map(async (company, index) => {
        //   const logoUrl = await getCompanyLogo(company.id);
        //   return { index, logoUrl };
        // });
        //
        // // Wait for all logos to finish loading
        // const logoResults = await Promise.all(fetchLogos);
        //
        // // Now update the company list with new logos
        // setCompanyList((prev) => {
        //   const updated = [...prev];
        //   logoResults.forEach(({ index, logoUrl }) => {
        //     updated[index] = { ...updated[index], image_url: logoUrl };
        //   });
        //   return updated;
        // });

        return;
      }

      if (response.status === 409) {
        alert(data.error);
        return [];
      }

      // Unexpected error
      alert(data.error);
      return [];
    } catch (error) {
      console.error("Error checking user:", error);
      return [];
    }
  }

  // const getCompanyLogo = async (companyID) => {
  //           const { data: imageList, error } = await supabase.storage
  //               .from('company-media')
  //               .list(`${companyID}/logo`, { limit: 1 });
  //
  //           if (error) {
  //               console.error("Image fetch error:", error.message);
  //               return;
  //           }
  //
  //           if (imageList.length > 0) {
  //               const imageName = imageList[0].name;
  //
  //               if (!imageName || imageName === "placeholder.txt") {
  //                   return;
  //               }
  //
  //               const { data } = supabase.storage
  //                   .from('company-media')
  //                   .getPublicUrl(`${companyID}/logo/${imageName}`);
  //               return data.publicUrl
  //           }
  //       };

  return (
    <div className="min-h-screen bg-gray-100">
      <Lnavbar />
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            My Company ({companyList.length})
          </h2>
          <button className="bg-orange-600 px-4 py-2 rounded hover:bg-orange-600">
            <a href="/react-frontend/src/pages/CreateCompany" className="text-white">
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
              {Array.isArray(companyList) &&
                companyList.map((company) => (
                  <tr key={company.id} className="border-b">
                    <td className="px-6 py-4 flex items-center space-x-4">
                      <img
                        src={company.image_url || MissingImagePlaceHolder}
                        alt="Invalid"
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
                      {/*<button className="bg-orange-600 text-white px-4 py-1 rounded hover:bg-orange-700">*/}
                      {/*  <a href={`/companylisting/${company.id}`}>View</a>*/}
                      {/*</button>*/}
                      <button
                        onClick={() => {
                          setCompanyID(company.id); // Set context first
                          navigate("/companylisting"); // Then navigate
                        }}
                        className="bg-orange-600 text-white px-4 py-1 rounded hover:bg-orange-700"
                      >
                        View
                      </button>
                      <button
                        className={`px-4 py-1 rounded ${
                          company.role === "Administrator"
                            ? "bg-orange-600 text-white hover:bg-orange-700"
                            : "bg-[#F9AD95] text-white cursor-not-allowed"
                        }`}
                        disabled={company.role !== "Administrator"}
                        onClick={() => {
                          setCompanyID(company.id); // Set context first
                          navigate("/companyprofileedit"); // Then navigate
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6">
          <button className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">
            View All ({companyList.length})
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Company;
